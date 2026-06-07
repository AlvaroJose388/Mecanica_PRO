
'use server';

import { db } from '@/lib/db';
import { orders, orderServices, invoices, users, branches, workshops } from '@/lib/schema';
import { and, eq, gte, lte, sql, desc } from 'drizzle-orm';
import { startOfDay, endOfDay } from 'date-fns';

export type ReportFilters = {
    startDate: string;
    endDate: string;
    branchId?: string;
};

export async function getPerformanceReports(workshopId: string, filters: ReportFilters) {
    if (!workshopId) throw new Error("Workshop ID required");

    const start = startOfDay(new Date(filters.startDate));
    const end = endOfDay(new Date(filters.endDate));

    // 1. Ingresos por Periodo (Agrupado por día)
    const incomeData = await db.select({
        date: sql<string>`to_char(${invoices.createdAt}, 'YYYY-MM-DD')`,
        amount: sql<number>`sum(${invoices.amount})`,
        count: sql<number>`count(${invoices.id})`
    })
    .from(invoices)
    .where(and(
        eq(invoices.workshopId, workshopId),
        eq(invoices.status, 'Paid'),
        gte(invoices.createdAt, start),
        lte(invoices.createdAt, end)
    ))
    .groupBy(sql`to_char(${invoices.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${invoices.createdAt}, 'YYYY-MM-DD')`);

    // 2. Servicios más realizados
    const servicesData = await db.select({
        name: orderServices.name,
        count: sql<number>`count(${orderServices.id})`,
        total: sql<number>`sum(${orderServices.price})`
    })
    .from(orderServices)
    .innerJoin(orders, eq(orderServices.orderId, orders.id))
    .where(and(
        eq(orders.workshopId, workshopId),
        filters.branchId ? eq(orders.branchId, filters.branchId) : undefined,
        gte(orders.createdAt, start),
        lte(orders.createdAt, end)
    ))
    .groupBy(orderServices.name)
    .orderBy(desc(sql`count(${orderServices.id})`))
    .limit(10);

    // 3. Rendimiento de Mecánicos
    const mechanicsData = await db.select({
        id: users.id,
        name: users.name,
        ordersCount: sql<number>`count(${orders.id})`,
        revenue: sql<number>`sum(${orders.total})`
    })
    .from(users)
    .innerJoin(orders, eq(users.id, orders.assignedMechanicId))
    .where(and(
        eq(users.workshopId, workshopId),
        eq(users.role, 'Mechanic'),
        eq(orders.status, 'Completed'),
        filters.branchId ? eq(orders.branchId, filters.branchId) : undefined,
        gte(orders.createdAt, start),
        lte(orders.createdAt, end)
    ))
    .groupBy(users.id, users.name)
    .orderBy(desc(sql`count(${orders.id})`));

    return {
        income: incomeData.map(i => ({ ...i, amount: Number(i.amount), count: Number(i.count) })),
        services: servicesData.map(s => ({ ...s, count: Number(s.count), total: Number(s.total) })),
        mechanics: mechanicsData.map(m => ({ ...m, ordersCount: Number(m.ordersCount), revenue: Number(m.revenue) }))
    };
}

export async function getSuperAdminReports(filters: ReportFilters) {
    const start = startOfDay(new Date(filters.startDate));
    const end = endOfDay(new Date(filters.endDate));

    // Ingresos globales por día
    const globalIncome = await db.select({
        date: sql<string>`to_char(${invoices.createdAt}, 'YYYY-MM-DD')`,
        amount: sql<number>`sum(${invoices.amount})`,
        count: sql<number>`count(${invoices.id})`
    })
    .from(invoices)
    .where(and(
        eq(invoices.status, 'Paid'),
        gte(invoices.createdAt, start),
        lte(invoices.createdAt, end)
    ))
    .groupBy(sql`to_char(${invoices.createdAt}, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(${invoices.createdAt}, 'YYYY-MM-DD')`);

    // Ingresos desglosados por taller
    const workshopIncome = await db.select({
        id: workshops.id,
        name: workshops.name,
        amount: sql<number>`sum(${invoices.amount})`,
        count: sql<number>`count(${invoices.id})`
    })
    .from(invoices)
    .innerJoin(workshops, eq(invoices.workshopId, workshops.id))
    .where(and(
        eq(invoices.status, 'Paid'),
        gte(invoices.createdAt, start),
        lte(invoices.createdAt, end)
    ))
    .groupBy(workshops.id, workshops.name)
    .orderBy(desc(sql`sum(${invoices.amount})`));

    return {
        income: globalIncome.map(i => ({ ...i, amount: Number(i.amount), count: Number(i.count) })),
        workshopIncome: workshopIncome.map(w => ({ ...w, amount: Number(w.amount), count: Number(w.count) }))
    };
}
