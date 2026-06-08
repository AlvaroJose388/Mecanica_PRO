
'use server';

import { db } from '@/lib/db';
import { workshops, branches as branchesTable, invoices, orders, appointments, clients, users as usersTable, inventory } from '@/lib/schema';
import { and, eq, sql, desc } from 'drizzle-orm';
import type { Workshop, Branch, Appointment, Client, WorkshopType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import { startOfMonth, subMonths, startOfDay, endOfDay } from 'date-fns';

export async function getWorkshops(): Promise<Workshop[]> {
  const result = await db.select().from(workshops);
  
  const allBranches = await db.select().from(branchesTable);

  return result.map(w => ({
    ...w,
    branches: allBranches.filter(b => b.workshopId === w.id),
    type: w.type as WorkshopType | undefined,
    createdAt: w.createdAt ? new Date(w.createdAt).toISOString() : undefined,
  }));
}

export async function getWorkshopById(id: string): Promise<Workshop | null> {
    if (!id) return null;
    
    const result = await db.select().from(workshops).where(eq(workshops.id, id));
    if (result.length === 0) return null;

    const workshopBranches = await db.select().from(branchesTable).where(eq(branchesTable.workshopId, id));
    
    return {
        ...result[0],
        type: result[0].type as WorkshopType | undefined,
        branches: workshopBranches,
        createdAt: result[0].createdAt ? new Date(result[0].createdAt).toISOString() : undefined,
    };
}

export async function createWorkshop(workshopData: Partial<Workshop>, ownerId: string): Promise<Workshop> {
  const workshopId = `ws-${uuidv4()}`;
  
  const newWorkshop = {
    id: workshopId,
    name: workshopData.name!,
    ownerId: ownerId, 
    subscription: workshopData.subscription || 'Basic',
    type: (workshopData.type || 'Automotriz') as any,
  };

  const createdWorkshop = await db.insert(workshops).values(newWorkshop).returning();

  const mainBranch: Omit<Branch, 'workshopId'> & { workshopId: string } = {
    id: `br-${uuidv4()}`,
    workshopId: workshopId,
    name: workshopData.branches?.[0]?.name || 'Sucursal Principal',
    address: workshopData.branches?.[0]?.address || '',
    phone: workshopData.branches?.[0]?.phone || '',
  };

  await db.insert(branchesTable).values(mainBranch);
  
  revalidatePath('/dashboard');

  return {
    ...createdWorkshop[0],
    type: createdWorkshop[0].type as WorkshopType | undefined,
    branches: [mainBranch],
    createdAt: createdWorkshop[0].createdAt ? new Date(createdWorkshop[0].createdAt).toISOString() : undefined,
  };
}

export async function updateWorkshop(workshopId: string, workshopData: Partial<Workshop>): Promise<Workshop> {
  
  const payload: any = {};
  if (workshopData.name) payload.name = workshopData.name;
  if (workshopData.subscription) payload.subscription = workshopData.subscription;
  if (workshopData.logoUrl) payload.logoUrl = workshopData.logoUrl;
  if (workshopData.primaryColor) payload.primaryColor = workshopData.primaryColor;
  if (workshopData.accentColor) payload.accentColor = workshopData.accentColor;
  if (workshopData.sidebarBgColor) payload.sidebarBgColor = workshopData.sidebarBgColor;
  if (workshopData.type) payload.type = workshopData.type;

  const updatedWorkshop = await db.update(workshops)
    .set(payload)
    .where(eq(workshops.id, workshopId))
    .returning();
  
  if (workshopData.branches) {
      for (const branch of workshopData.branches) {
          if (branch.id.startsWith('new-')) {
             await db.insert(branchesTable).values({
                id: `br-${uuidv4()}`,
                workshopId: workshopId,
                name: branch.name,
                address: branch.address,
                phone: branch.phone,
            });
          } else {
            await db.update(branchesTable)
            .set({
                name: branch.name,
                address: branch.address,
                phone: branch.phone,
            })
            .where(eq(branchesTable.id, branch.id));
          }
      }
  }

  revalidatePath('/dashboard');
  revalidatePath(`/settings/workshop`);

  const updatedBranches = await db.select().from(branchesTable).where(eq(branchesTable.workshopId, workshopId));

  return {
      ...updatedWorkshop[0],
      type: updatedWorkshop[0].type as WorkshopType | undefined,
      branches: updatedBranches,
      createdAt: updatedWorkshop[0].createdAt ? new Date(updatedWorkshop[0].createdAt).toISOString() : undefined,
  };
}

export async function deleteBranch(branchId: string) {
    await db.delete(branchesTable).where(eq(branchesTable.id, branchId));
    revalidatePath(`/settings/workshop`);
}

export async function getDashboardData(workshopId: string, branchId?: string) {
    if (!workshopId) {
        throw new Error("Workshop ID is required");
    }

    const firstDayOfMonth = startOfMonth(new Date());
    
    // Filtrado por Sucursal en Ingresos (Join con órdenes)
    const monthlyRevenueQuery = db.select({
        total: sql<number>`sum(${invoices.amount})`
    }).from(invoices)
    .innerJoin(orders, eq(invoices.orderId, orders.id))
    .where(
        and(
            eq(invoices.workshopId, workshopId),
            eq(invoices.status, 'Paid'),
            sql`${invoices.createdAt} >= ${firstDayOfMonth.toISOString()}`,
            branchId ? eq(orders.branchId, branchId) : undefined
        )
    );
    const monthlyRevenueResult = await monthlyRevenueQuery;
    const monthlyRevenue = Number(monthlyRevenueResult[0].total) || 0;

    // Órdenes Activas por Sucursal
    const activeOrdersResult = await db.select({
        count: sql<number>`count(${orders.id})`
    }).from(orders).where(
        and(
            eq(orders.workshopId, workshopId),
            eq(orders.status, 'InProgress'),
            branchId ? eq(orders.branchId, branchId) : undefined
        )
    );
    const activeOrders = activeOrdersResult[0].count;

    // Citas por Taller (Las citas actualmente son nivel taller, pero se muestran según contexto)
    const todayStart = startOfDay(new Date());
    const todayEnd = endOfDay(new Date());
    
    const appointmentsTodayResult = await db.select({
        count: sql<number>`count(${appointments.id})`
    }).from(appointments).where(
        and(
            eq(appointments.workshopId, workshopId),
            sql`${appointments.date} >= ${todayStart.toISOString()}`,
            sql`${appointments.date} <= ${todayEnd.toISOString()}`
        )
    );
    const appointmentsToday = appointmentsTodayResult[0].count;
    
    const totalClientsResult = await db.select({
        count: sql<number>`count(${clients.id})`
    }).from(clients).where(eq(clients.workshopId, workshopId));
    const totalClients = totalClientsResult[0].count;
    
    const analyticsData = await getAnalyticsData(workshopId, branchId);

    return {
        monthlyRevenue: { total: monthlyRevenue },
        activeOrders: { count: activeOrders },
        appointmentsToday: { count: appointmentsToday },
        totalClients: { count: totalClients },
        analytics: analyticsData
    };
}


export async function getAnalyticsData(workshopId: string, branchId?: string) {
    if (!workshopId) {
        throw new Error("Workshop ID is required");
    }

    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const monthlyRevenueData = await db.select({
            month: sql<string>`to_char(${invoices.createdAt}, 'YYYY-MM')`,
            revenue: sql<number>`sum(${invoices.amount})`,
            ordersCount: sql<number>`count(${invoices.id})`
        })
        .from(invoices)
        .innerJoin(orders, eq(invoices.orderId, orders.id))
        .where(and(
            eq(invoices.workshopId, workshopId),
            eq(invoices.status, 'Paid'),
            sql`${invoices.createdAt} >= ${sixMonthsAgo.toISOString()}`,
            branchId ? eq(orders.branchId, branchId) : undefined
        ))
        .groupBy(sql`to_char(${invoices.createdAt}, 'YYYY-MM')`)
        .orderBy(sql`to_char(${invoices.createdAt}, 'YYYY-MM')`);
    
    const popularServicesData = await db.select({
        service: sql<string>`s.name`,
        count: sql<number>`count(s.id)`
    })
    .from(orders)
    .innerJoin(sql`order_services s`, sql`s.order_id = ${orders.id}`)
    .where(and(
        eq(orders.workshopId, workshopId),
        branchId ? eq(orders.branchId, branchId) : undefined
    ))
    .groupBy(sql`s.name`)
    .orderBy(sql`count(s.id) DESC`)
    .limit(8);

    const totalsResult = await db.select({
        totalRevenue: sql<number>`sum(${invoices.amount})`,
        totalOrders: sql<number>`count(${invoices.id})`
    })
    .from(invoices)
    .innerJoin(orders, eq(invoices.orderId, orders.id))
    .where(and(
        eq(invoices.workshopId, workshopId), 
        eq(invoices.status, 'Paid'),
        branchId ? eq(orders.branchId, branchId) : undefined
    ));

    const inventoryValueResult = await db.select({
        totalValue: sql<number>`sum(cast(price as numeric) * quantity)`
    }).from(inventory).where(and(
        eq(inventory.workshopId, workshopId),
        branchId ? eq(inventory.branchId, branchId) : undefined
    ));

    const totalRevenue = Number(totalsResult[0].totalRevenue) || 0;
    const totalOrders = Number(totalsResult[0].totalOrders) || 0;
    const averageTicket = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    return {
        monthlyRevenue: monthlyRevenueData.map(item => ({ ...item, revenue: Number(item.revenue), orders: Number(item.ordersCount) })),
        popularServices: popularServicesData.map(item => ({...item, count: Number(item.count)})),
        summary: {
            totalRevenue,
            totalOrders,
            averageTicket,
            inventoryValue: Number(inventoryValueResult[0].totalValue) || 0
        }
    };
}

export async function getSuperAdminDashboardData() {
    const PREMIUM_SUBSCRIPTION_PRICE = 99000; 

    const totalWorkshopsResult = await db.select({
        count: sql<number>`count(${workshops.id})`
    }).from(workshops);
    const totalWorkshops = totalWorkshopsResult[0].count;

    const totalUsersResult = await db.select({
        count: sql<number>`count(${usersTable.id})`
    }).from(usersTable);
    const totalUsers = totalUsersResult[0].count;

    const premiumSubscriptionsResult = await db.select({
        count: sql<number>`count(${workshops.id})`
    }).from(workshops).where(eq(workshops.subscription, 'Premium'));
    const premiumSubscriptions = premiumSubscriptionsResult[0].count;

    const totalMonthlyRevenue = premiumSubscriptions * PREMIUM_SUBSCRIPTION_PRICE;

    return {
        totalMonthlyRevenue,
        totalWorkshops,
        totalUsers,
        premiumSubscriptions
    };
}
