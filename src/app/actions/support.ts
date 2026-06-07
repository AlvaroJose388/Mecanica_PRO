
'use server';

import { db } from '@/lib/db';
import { supportTickets } from '@/lib/schema';
import { and, eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import type { SupportTicket, SupportTicketStatus } from '@/lib/types';
import { revalidatePath } from 'next/cache';

type CreateTicketData = {
    subject: string;
    description: string;
    userId: string;
    workshopId?: string | null;
}

export async function createSupportTicket(data: CreateTicketData): Promise<SupportTicket> {
    const newTicket = {
        id: `ticket-${uuidv4()}`,
        ...data,
    };
    const [result] = await db.insert(supportTickets).values(newTicket).returning();
    revalidatePath('/support');
    return { ...result, description: result.description!, createdAt: result.createdAt!.toISOString() };
}

export async function getTicketsForUser(userId: string): Promise<SupportTicket[]> {
    const results = await db.query.supportTickets.findMany({
        where: eq(supportTickets.userId, userId),
        orderBy: [desc(supportTickets.createdAt)],
    });
    return results.map(t => ({ ...t, description: t.description!, createdAt: t.createdAt!.toISOString() }));
}

export async function getAllTickets(): Promise<SupportTicket[]> {
    const results = await db.query.supportTickets.findMany({
        orderBy: [desc(supportTickets.createdAt)],
        with: {
            user: { columns: { name: true, email: true }},
            workshop: { columns: { name: true }},
        }
    });

    return results.map(t => ({
        id: t.id,
        subject: t.subject,
        description: t.description!,
        status: t.status,
        userId: t.userId,
        workshopId: t.workshopId,
        createdAt: t.createdAt!.toISOString(),
        user: t.user ? { name: t.user.name, email: t.user.email } : undefined,
        workshop: t.workshop ? { name: t.workshop.name } : undefined,
    }));
}

export async function updateTicketStatus(ticketId: string, status: SupportTicketStatus): Promise<SupportTicket> {
    const [result] = await db.update(supportTickets)
        .set({ status })
        .where(eq(supportTickets.id, ticketId))
        .returning();

    if (!result) {
        throw new Error("Ticket no encontrado");
    }
    revalidatePath('/support');
    return { ...result, description: result.description!, createdAt: result.createdAt!.toISOString() };
}
