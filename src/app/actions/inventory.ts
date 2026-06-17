
'use server';

import { db } from '@/lib/db';
import { inventory, orderParts } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import type { InventoryItem } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function getInventoryForWorkshop(workshopId: string): Promise<InventoryItem[]> {
  if (!workshopId) {
    return [];
  }
  const results = await db.select().from(inventory).where(eq(inventory.workshopId, workshopId));
  return results.map(item => ({
    ...item,
    price: Number(item.price) // Convert string from DB to number.
  }));
}

export async function createInventoryItem(itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    if (!itemData.workshopId || !itemData.branchId || !itemData.name || itemData.price === undefined || itemData.quantity === undefined) {
        throw new Error('Faltan datos requeridos: workshopId, branchId, nombre, precio y cantidad son obligatorios.');
    }
    const newItem = {
        id: `inv-item-${uuidv4()}`,
        workshopId: itemData.workshopId,
        branchId: itemData.branchId,
        name: itemData.name,
        sku: itemData.sku || '',
        quantity: itemData.quantity,
        price: itemData.price.toString(),
        minStock: itemData.minStock ?? 5,
    };
    const [result] = await db.insert(inventory).values(newItem).returning();
    revalidatePath('/inventory');
    return { ...result, price: Number(result.price) };
}

export async function updateInventoryItem(itemId: string, itemData: Partial<InventoryItem>): Promise<InventoryItem> {
    if (!itemId) {
        throw new Error('ID del artículo es requerido para actualizar.');
    }
    const updateData: any = { ...itemData };
    delete updateData.id; // Prevent updating the ID
    
    if (itemData.price !== undefined) {
      updateData.price = itemData.price.toString();
    }
    
    const result = await db.update(inventory)
        .set(updateData)
        .where(eq(inventory.id, itemId))
        .returning();

    if (!result || result.length === 0) {
        throw new Error('No se pudo encontrar el artículo para actualizar. Verifica que el ID sea correcto.');
    }
    revalidatePath('/inventory');
    return { ...result[0], price: Number(result[0].price) };
}

export async function deleteInventoryItem(itemId: string): Promise<{ success: boolean }> {
    try {
        // Realizar limpieza manual de referencias en partes de órdenes
        // Esto es necesario si la base de datos no está aplicando el CASCADE correctamente
        await db.delete(orderParts).where(eq(orderParts.inventoryItemId, itemId));
        
        // Ahora borrar el artículo del inventario
        await db.delete(inventory).where(eq(inventory.id, itemId));
        
        revalidatePath('/inventory');
        return { success: true };
    } catch (error) {
        console.error("Error deleting inventory item:", error);
        throw new Error("No se pudo eliminar el artículo. Asegúrate de que no esté siendo usado en procesos críticos.");
    }
}
