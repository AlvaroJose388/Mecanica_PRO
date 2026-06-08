
'use server';

import { db } from '@/lib/db';
import { invoices, orders, branches } from '@/lib/schema';
import { eq, desc, and } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import type { Invoice, InvoiceStatus } from '@/lib/types';

// Get all invoices for a workshop with Branch info
export async function getInvoicesForWorkshop(workshopId: string): Promise<any[]> {
  if (!workshopId) return [];

  const results = await db.select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      orderId: invoices.orderId,
      clientId: invoices.clientId,
      workshopId: invoices.workshopId,
      amount: invoices.amount,
      status: invoices.status,
      notes: invoices.notes,
      createdAt: invoices.createdAt,
      dueDate: invoices.dueDate,
      branchName: branches.name,
  })
    .from(invoices)
    .innerJoin(orders, eq(invoices.orderId, orders.id))
    .innerJoin(branches, eq(orders.branchId, branches.id))
    .where(eq(invoices.workshopId, workshopId))
    .orderBy(desc(invoices.createdAt));
    
  return results.map(i => ({
      ...i,
      amount: Number(i.amount),
      createdAt: i.createdAt!.toISOString(),
      dueDate: i.dueDate!,
  }));
}

// Create a new invoice for a specific order
export async function createInvoice(orderId: string): Promise<Invoice> {
  // 1. Check if an invoice for this order already exists
  const existingInvoice = await db.query.invoices.findFirst({
    where: eq(invoices.orderId, orderId),
  });

  if (existingInvoice) {
    throw new Error('Ya existe una factura para esta orden.');
  }

  // 2. Get the order details
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
  });

  if (!order) {
    throw new Error('No se pudo encontrar la orden para crear la factura.');
  }

  // 3. Create the new invoice
  const newInvoiceData = {
    id: `inv-${uuidv4()}`,
    invoiceNumber: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
    orderId: order.id,
    clientId: order.clientId,
    workshopId: order.workshopId,
    amount: String(Number(order.total).toFixed(2)),
    status: 'Pending' as const,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
  };

  const [result] = await db.insert(invoices).values(newInvoiceData).returning();
  
  revalidatePath('/invoices');
  revalidatePath('/orders');

  return {
      ...result,
      amount: Number(result.amount),
      createdAt: result.createdAt!.toISOString(),
      dueDate: result.dueDate!,
  };
}


// Update invoice status
export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): Promise<{ success: boolean }> {
  if (!invoiceId || !status) {
    throw new Error('ID de factura y estado son requeridos.');
  }

  await db.update(invoices)
    .set({ status })
    .where(eq(invoices.id, invoiceId));

  revalidatePath('/invoices');

  return { success: true };
}
