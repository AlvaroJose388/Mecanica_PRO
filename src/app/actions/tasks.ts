'use server';

import { db } from '@/lib/db';
import { tasks } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { revalidatePath } from 'next/cache';
import type { Task, TaskStatus } from '@/lib/types';

export async function getTasksForWorkshop(workshopId: string): Promise<Task[]> {
    if (!workshopId) return [];
    const results = await db.query.tasks.findMany({
        where: eq(tasks.workshopId, workshopId),
        orderBy: [desc(tasks.createdAt)],
    });
    return results.map(t => ({
        ...t,
        dueDate: t.dueDate?.toISOString() || null,
        createdAt: t.createdAt!.toISOString(),
        status: t.status as TaskStatus
    }));
}

export async function createTask(data: Partial<Task>): Promise<Task> {
    if (!data.workshopId || !data.title) throw new Error("Missing required task data");

    const newTask = {
        id: `task-${uuidv4()}`,
        workshopId: data.workshopId,
        title: data.title,
        description: data.description || null,
        status: 'Pending' as const,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
    };

    const [result] = await db.insert(tasks).values(newTask).returning();
    revalidatePath('/tasks');
    return {
        ...result,
        dueDate: result.dueDate?.toISOString() || null,
        createdAt: result.createdAt!.toISOString(),
        status: result.status as TaskStatus
    };
}

export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
    await db.update(tasks).set({ status }).where(eq(tasks.id, taskId));
    revalidatePath('/tasks');
}

export async function deleteTask(taskId: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    revalidatePath('/tasks');
}
