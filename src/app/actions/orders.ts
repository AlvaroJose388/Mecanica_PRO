'use server';

import { db } from '@/lib/db';
import { orders, orderServices, orderParts, clients, users, branches, inventory, invoices, vehicles, orderAuditLogs } from '@/lib/schema';
import { eq, inArray, desc, and } from 'drizzle-orm';
import type { Order, Client, User, OrderStatus, Invoice, Vehicle } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

type FullOrder = Order & { client: Client, assignedMechanic?: User, invoice?: Invoice | null, vehicle?: Vehicle | null };
type OrderFormData = {
  clientId: string;
  vehicleId?: string;
  services: { name: string; price: number }[];
  parts: { inventoryItemId: string; quantity: number; price: number; name: string }[];
}

// Jerarquía de estados para evitar retrocesos
const STATUS_RANK: Record<OrderStatus, number> = {
    'Pending': 0,
    'InProgress': 1,
    'Ready': 2,
    'Completed': 3,
    'Cancelled': 4,
};

export async function getFullOrdersForWorkshop(workshopId: string): Promise<FullOrder[]> {
  if (!workshopId) return [];

  const workshopOrders = await db.query.orders.findMany({
    where: eq(orders.workshopId, workshopId),
    orderBy: [desc(orders.createdAt)],
    with: {
      client: true,
      vehicle: true,
      assignedMechanic: {
        columns: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatarUrl: true,
            workshopId: true,
        }
      },
      services: true,
      parts: {
        with: {
            inventoryItem: {
                columns: {
                    name: true,
                }
            }
        }
      },
      invoice: true,
    }
  });

  if (workshopOrders.length === 0) return [];
  
  const result = workshopOrders.map(order => {
    return {
      ...order,
      total: Number(order.total),
      createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
      services: order.services.map(s => ({ name: s.name, price: Number(s.price) })),
      parts: order.parts.map(p => ({
        inventoryItemId: p.inventoryItemId,
        name: p.inventoryItem?.name || 'Parte no encontrada',
        price: Number(p.price),
        quantity: p.quantity,
      })),
      invoice: order.invoice ? { ...order.invoice, amount: Number(order.invoice.amount), createdAt: order.invoice.createdAt!.toISOString(), dueDate: order.invoice.dueDate! } : null,
      assignedMechanic: order.assignedMechanic || undefined,
    };
  });
  
  return result as FullOrder[];
}

export async function getOrdersByClientId(clientId: string): Promise<FullOrder[]> {
    if (!clientId) return [];
    
    const results = await db.query.orders.findMany({
        where: eq(orders.clientId, clientId),
        orderBy: [desc(orders.createdAt)],
        with: {
            client: true,
            vehicle: true,
            assignedMechanic: {
                columns: { id: true, name: true, email: true, role: true, avatarUrl: true, workshopId: true }
            },
            services: true,
            parts: { with: { inventoryItem: { columns: { name: true } } } },
            invoice: true,
        }
    });

    return results.map(order => ({
        ...order,
        total: Number(order.total),
        createdAt: order.createdAt?.toISOString() || new Date().toISOString(),
        services: order.services.map(s => ({ name: s.name, price: Number(s.price) })),
        parts: order.parts.map(p => ({
            inventoryItemId: p.inventoryItemId,
            name: p.inventoryItem?.name || 'Parte no encontrada',
            price: Number(p.price),
            quantity: p.quantity,
        })),
        invoice: order.invoice ? { ...order.invoice, amount: Number(order.invoice.amount), createdAt: order.invoice.createdAt!.toISOString(), dueDate: order.invoice.dueDate! } : null,
        assignedMechanic: order.assignedMechanic || undefined,
    })) as FullOrder[];
}


export async function createOrder(workshopId: string, data: OrderFormData, creatorId: string): Promise<Order> {
    const { clientId, vehicleId, services, parts } = data;

    const workshopBranches = await db.select({ id: branches.id }).from(branches).where(eq(branches.workshopId, workshopId));
    if (workshopBranches.length === 0) {
        throw new Error("El taller no tiene sucursales configuradas.");
    }
    const branchId = workshopBranches[0].id;
    
    for (const p of parts) {
        const currentItem = await db.query.inventory.findFirst({ where: eq(inventory.id, p.inventoryItemId) });
        if (!currentItem || currentItem.quantity < p.quantity) {
            throw new Error(`Stock insuficiente para "${p.name}". Disponible: ${currentItem?.quantity || 0}`);
        }
    }

    const total = services.reduce((sum, s) => sum + s.price, 0) + parts.reduce((sum, p) => sum + p.price * p.quantity, 0);
    
    const orderId = `ord-${uuidv4()}`;
    const newOrderData = {
        id: orderId,
        orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        clientId: clientId,
        vehicleId: vehicleId || null,
        workshopId: workshopId,
        branchId: branchId,
        status: 'Pending' as const,
        total: total.toString(),
        createdAt: new Date(),
    };

    const [createdOrder] = await db.insert(orders).values(newOrderData).returning();
    
    if (services.length > 0) {
        await db.insert(orderServices).values(services.map(s => ({
            orderId: createdOrder.id,
            name: s.name,
            price: s.price.toString()
        })));
    }
    
    if (parts.length > 0) {
         await db.insert(orderParts).values(parts.map(p => ({
            orderId: createdOrder.id,
            inventoryItemId: p.inventoryItemId,
            quantity: p.quantity,
            price: p.price.toString()
        })));

        for (const p of parts) {
            const currentItem = await db.query.inventory.findFirst({ where: eq(inventory.id, p.inventoryItemId) });
            if (currentItem) {
                await db.update(inventory).set({ quantity: currentItem.quantity - p.quantity }).where(eq(inventory.id, p.inventoryItemId));
            }
        }
    }

    await db.insert(orderAuditLogs).values({
        id: `audit-${uuidv4()}`,
        orderId: createdOrder.id,
        userId: creatorId,
        action: 'Apertura de Orden',
        newValue: `Estado inicial: ${createdOrder.status}`,
    });

    revalidatePath('/orders');
    revalidatePath('/inventory');
    
    return {
        ...createdOrder,
        total: Number(createdOrder.total),
        services,
        parts: parts.map(p => ({...p, name: p.name})),
        createdAt: createdOrder.createdAt!.toISOString(),
    };
}


export async function updateOrderStatus(orderId: string, status: OrderStatus, userId: string): Promise<Order> {
    const existingOrder = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
    if (!existingOrder) throw new Error("Orden no encontrada");

    // VALIDACIÓN DE SEGURIDAD: No permitir retrocesos
    const currentRank = STATUS_RANK[existingOrder.status as OrderStatus];
    const newRank = STATUS_RANK[status];

    if (newRank < currentRank) {
        throw new Error(`Protocolo denegado: No se puede retroceder de ${existingOrder.status} a ${status}.`);
    }

    const [updatedOrder] = await db.update(orders)
        .set({ status })
        .where(eq(orders.id, orderId))
        .returning();

    await db.insert(orderAuditLogs).values({
        id: `audit-${uuidv4()}`,
        orderId: orderId,
        userId: userId,
        action: 'Cambio de Estado',
        previousValue: existingOrder.status,
        newValue: status,
    });

    revalidatePath('/orders');
    return {
        ...updatedOrder,
        total: Number(updatedOrder.total),
        createdAt: updatedOrder.createdAt!.toISOString(),
        services: [],
        parts: [],
    };
}


export async function assignMechanicToOrder(orderId: string, mechanicId: string, userId: string): Promise<Order> {
    const existingOrder = await db.query.orders.findFirst({ where: eq(orders.id, orderId) });
    if (!existingOrder) throw new Error("Orden no encontrada");

    const [updatedOrder] = await db.update(orders)
        .set({ assignedMechanicId: mechanicId })
        .where(eq(orders.id, orderId))
        .returning();
        
    await db.insert(orderAuditLogs).values({
        id: `audit-${uuidv4()}`,
        orderId: orderId,
        userId: userId,
        action: 'Asignación de Mecánico',
        newValue: `ID Mecánico: ${mechanicId}`,
    });

    revalidatePath('/orders');
    return {
        ...updatedOrder,
        total: Number(updatedOrder.total),
        createdAt: updatedOrder.createdAt!.toISOString(),
        services: [],
        parts: [],
    };
}
