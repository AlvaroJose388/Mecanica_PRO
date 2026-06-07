'use server';

import { db } from '@/lib/db';
import { clients, vehicles, orders, invoices, appointments, orderServices, orderParts } from '@/lib/schema';
import { eq, inArray } from 'drizzle-orm';
import type { Client } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

// Get all clients for a workshop
export async function getClientsForWorkshop(workshopId: string): Promise<Client[]> {
  const results = await db.select().from(clients).where(eq(clients.workshopId, workshopId));
  return results.map(c => ({
    id: c.id,
    name: c.name,
    phone: c.phone || '',
    email: c.email || '',
    address: c.address || '',
    workshopId: c.workshopId,
  }));
}

// Create a new client
export async function createClient(clientData: Partial<Client>): Promise<Client> {
  if (!clientData.workshopId || !clientData.name) {
    throw new Error('Faltan datos para crear el cliente.');
  }

  const newClient: Client = {
    id: `client-${uuidv4()}`,
    workshopId: clientData.workshopId,
    name: clientData.name,
    email: clientData.email || '',
    phone: clientData.phone || '',
    address: clientData.address || '',
  };

  const [result] = await db.insert(clients).values(newClient).returning();
  revalidatePath('/clients');
  
  return {
    id: result.id,
    name: result.name,
    phone: result.phone || '',
    email: result.email || '',
    address: result.address || '',
    workshopId: result.workshopId,
  };
}

// Update a client
export async function updateClient(clientId: string, clientData: Partial<Client>): Promise<Client> {
  const [result] = await db.update(clients)
    .set(clientData)
    .where(eq(clients.id, clientId))
    .returning();
  
  if (!result) {
    throw new Error('No se pudo encontrar el cliente para actualizar.');
  }
  revalidatePath('/clients');
  return {
    id: result.id,
    name: result.name,
    phone: result.phone || '',
    email: result.email || '',
    address: result.address || '',
    workshopId: result.workshopId,
  };
}

// Delete a client with manual cascade to avoid FK constraints errors
export async function deleteClient(clientId: string): Promise<{ success: boolean }> {
  try {
    // 1. Obtener todas las órdenes del cliente
    const clientOrders = await db.select({ id: orders.id }).from(orders).where(eq(orders.clientId, clientId));
    const orderIds = clientOrders.map(o => o.id);

    if (orderIds.length > 0) {
      // 2. Limpiar servicios y partes de las órdenes
      await db.delete(orderServices).where(inArray(orderServices.orderId, orderIds));
      await db.delete(orderParts).where(inArray(orderParts.orderId, orderIds));
      // 3. Eliminar facturas asociadas
      await db.delete(invoices).where(inArray(invoices.orderId, orderIds));
      // 4. Eliminar las órdenes
      await db.delete(orders).where(eq(orders.clientId, clientId));
    }

    // 5. Eliminar citas, vehículos y finalmente el cliente
    await db.delete(appointments).where(eq(appointments.clientId, clientId));
    await db.delete(vehicles).where(eq(vehicles.clientId, clientId));
    await db.delete(clients).where(eq(clients.id, clientId));

    revalidatePath('/clients');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error("Error in deleteClient action:", error);
    throw new Error("No se pudo eliminar el cliente debido a registros vinculados activos.");
  }
}
