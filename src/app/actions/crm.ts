'use server';

import { db } from '@/lib/db';
import { orders, clients, vehicles } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import { subMonths, isBefore } from 'date-fns';

export type CRMOpportunity = {
    name: string;
    vehicle: string;
    reason: string;
    status: 'Crítico' | 'Próximo' | 'Sugerido';
    phone: string;
}

/**
 * Motor de Inteligencia CRM de MecanicaPro
 * Analiza el historial de órdenes para detectar ciclos de mantenimiento vencidos.
 */
export async function getCRMOpportunities(workshopId: string): Promise<CRMOpportunity[]> {
    if (!workshopId) return [];

    try {
        // Consulta de Ingeniería: Agrupamos por cliente y vehículo para obtener la última intervención
        const lastOrders = await db.select({
            clientId: orders.clientId,
            clientName: clients.name,
            clientPhone: clients.phone,
            vehicleBrand: vehicles.brand,
            vehicleModel: vehicles.model,
            lastDate: sql<Date>`max(${orders.createdAt})`
        })
        .from(orders)
        .innerJoin(clients, eq(orders.clientId, clients.id))
        .leftJoin(vehicles, eq(orders.vehicleId, vehicles.id))
        .where(eq(orders.workshopId, workshopId))
        .groupBy(
            orders.clientId, 
            clients.name, 
            clients.phone, 
            vehicles.brand, 
            vehicles.model
        );

        const sixMonthsAgo = subMonths(new Date(), 6);
        const fourMonthsAgo = subMonths(new Date(), 4);

        const opportunities: CRMOpportunity[] = lastOrders.map(order => {
            const lastVisit = new Date(order.lastDate);
            const phone = order.clientPhone || '';
            const vehicleDesc = order.vehicleBrand ? `${order.vehicleBrand} ${order.vehicleModel || ''}` : 'Vehículo no registrado';
            
            // Lógica de Clasificación Técnica
            if (isBefore(lastVisit, sixMonthsAgo)) {
                return {
                    name: order.clientName,
                    vehicle: vehicleDesc,
                    reason: 'Mantenimiento Vencido (> 6 meses)',
                    status: 'Crítico',
                    phone: phone.replace(/\D/g, '')
                };
            }

            if (isBefore(lastVisit, fourMonthsAgo)) {
                return {
                    name: order.clientName,
                    vehicle: vehicleDesc,
                    reason: 'Revisión Preventiva Sugerida',
                    status: 'Próximo',
                    phone: phone.replace(/\D/g, '')
                };
            }

            return null;
        }).filter((opt): opt is CRMOpportunity => opt !== null);

        return opportunities.slice(0, 10);
    } catch (error) {
        console.error("Error en el Motor CRM de MecanicaPro:", error);
        return [];
    }
}
