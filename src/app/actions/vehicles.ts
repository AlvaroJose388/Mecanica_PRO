'use server';

import { db } from '@/lib/db';
import { vehicles } from '@/lib/schema';
import { and, eq } from 'drizzle-orm';
import type { Vehicle } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';


export async function getVehiclesForClient(clientId: string): Promise<Vehicle[]> {
  if (!clientId) return [];
  const results = await db.select().from(vehicles).where(eq(vehicles.clientId, clientId));
  return results.map(v => ({
    id: v.id,
    clientId: v.clientId,
    plate: v.plate,
    brand: v.brand,
    model: v.model,
    year: v.year,
    vin: v.vin,
    color: v.color,
    mileage: v.mileage,
  }));
}

export async function createVehicle(clientId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
  if (!clientId || !vehicleData.plate) {
    throw new Error('Client ID and plate are required.');
  }

  const newVehicle: Vehicle = {
    id: `vhc-${uuidv4()}`,
    clientId: clientId,
    plate: vehicleData.plate,
    brand: vehicleData.brand,
    model: vehicleData.model,
    year: vehicleData.year,
    color: vehicleData.color,
    mileage: vehicleData.mileage,
    vin: vehicleData.vin,
  };

  const [result] = await db.insert(vehicles).values(newVehicle).returning();
  revalidatePath('/clients');
  return {
    id: result.id,
    clientId: result.clientId,
    plate: result.plate,
    brand: result.brand,
    model: result.model,
    year: result.year,
    vin: result.vin,
    color: result.color,
    mileage: result.mileage,
  };
}

export async function updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>): Promise<Vehicle> {
  const [result] = await db.update(vehicles)
    .set(vehicleData)
    .where(eq(vehicles.id, vehicleId))
    .returning();
  
  if (!result) {
    throw new Error('Could not find vehicle to update.');
  }
  revalidatePath('/clients');
  return {
    id: result.id,
    clientId: result.clientId,
    plate: result.plate,
    brand: result.brand,
    model: result.model,
    year: result.year,
    vin: result.vin,
    color: result.color,
    mileage: result.mileage,
  };
}

export async function deleteVehicle(vehicleId: string): Promise<{ success: boolean }> {
  await db.delete(vehicles).where(eq(vehicles.id, vehicleId));
  revalidatePath('/clients');
  return { success: true };
}
