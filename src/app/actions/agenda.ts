
'use server';

import { db } from '@/lib/db';
import { appointments } from '@/lib/schema';
import { eq, and, sql } from 'drizzle-orm';
import type { Appointment, Client, Vehicle } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

// Get all appointments for a workshop
export async function getAppointments(workshopId: string): Promise<any[]> {
  const result = await db.query.appointments.findMany({
    where: eq(appointments.workshopId, workshopId),
    with: {
      client: true
    }
  });

  // Manually construct the object to ensure it's a plain JS object and serializable
  return result
    .filter(a => a.date)
    .map(a => ({
        id: a.id,
        workshopId: a.workshopId,
        clientId: a.clientId,
        service: a.service,
        date: a.date.toISOString(),
        client: a.client ? {
            id: a.client.id,
            workshopId: a.client.workshopId,
            name: a.client.name,
            phone: a.client.phone,
            email: a.client.email,
            address: a.client.address
        } : null,
    }));
}

// Create a new appointment with conflict validation (US-10)
export async function createAppointment(appointmentData: Partial<Appointment>): Promise<any> {
  if (!appointmentData.workshopId || !appointmentData.clientId || !appointmentData.service || !appointmentData.date) {
    throw new Error('Faltan datos para crear la cita.');
  }

  const newDate = new Date(appointmentData.date);

  // US-10: Validar conflicto de horario (Mismo taller, misma hora exacta)
  // Nota: En un sistema real buscaríamos rangos, aquí validamos colisión directa por simplicidad del prototipo
  const existing = await db.query.appointments.findFirst({
    where: and(
        eq(appointments.workshopId, appointmentData.workshopId),
        eq(appointments.date, newDate)
    )
  });

  if (existing) {
      throw new Error('Conflicto Técnico: Ya existe una cita agendada en este mismo horario. Por favor seleccione otro intervalo.');
  }

  const newAppointment = {
    id: `appt-${uuidv4()}`,
    workshopId: appointmentData.workshopId,
    clientId: appointmentData.clientId,
    service: appointmentData.service,
    date: newDate,
  };

  const [result] = await db.insert(appointments).values(newAppointment).returning();

  const fullResult = await db.query.appointments.findFirst({
      where: eq(appointments.id, result.id),
      with: {
          client: true,
      }
  });

  revalidatePath('/agenda');
  
  if (!fullResult || !fullResult.date) {
      throw new Error('Failed to retrieve created appointment or appointment has no date.');
  }

  // Manually construct the return object to ensure it's plain and serializable
  return {
    id: fullResult.id,
    workshopId: fullResult.workshopId,
    clientId: fullResult.clientId,
    service: fullResult.service,
    date: fullResult.date.toISOString(),
    client: fullResult.client ? {
        id: fullResult.client.id,
        workshopId: fullResult.client.workshopId,
        name: fullResult.client.name,
        phone: fullResult.client.phone,
        email: fullResult.client.email,
        address: fullResult.client.address
    } : null,
  };
}
