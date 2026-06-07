'use server';

import { db } from '@/lib/db';
import { technicalProtocols } from '@/lib/schema';
import { desc, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';

export async function getTechnicalProtocols() {
    try {
        const protocols = await db.select().from(technicalProtocols).orderBy(desc(technicalProtocols.createdAt));
        return protocols.map(p => ({
            ...p,
            steps: Array.isArray(p.steps) ? p.steps : [], 
        }));
    } catch (error) {
        console.error("Error fetching protocols:", error);
        return [];
    }
}

export async function createTechnicalProtocol(data: {
    title: string;
    category: string;
    level: string;
    description: string;
    steps: string[];
    warning?: string;
    tip?: string;
}) {
    const newProtocol = {
        id: `prot-${uuidv4()}`,
        ...data,
        steps: data.steps, // Drizzle maneja el JSONB
        createdAt: new Date(),
    };

    try {
        await db.insert(technicalProtocols).values(newProtocol);
        revalidatePath('/protocols');
        return { success: true, id: newProtocol.id };
    } catch (error) {
        console.error("Error creating protocol:", error);
        throw new Error("No se pudo registrar el protocolo en la base de datos.");
    }
}
