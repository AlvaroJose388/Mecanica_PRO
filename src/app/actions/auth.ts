'use server';

import { db } from '@/lib/db';
import { users, workshops, branches } from '@/lib/schema';
import { eq, sql } from 'drizzle-orm';
import type { User, Workshop } from '@/lib/types';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Motor de Autenticación de MecanicaPro
 * Simplificado para compatibilidad inmediata con la base de datos física de Neon.
 */
export async function authenticateUser(email: string, pass: string): Promise<Omit<User, 'password' | 'passwordHash'> | null> {
    try {
        const cleanEmail = email.trim().toLowerCase();
        
        // Búsqueda de alta precisión
        const result = await db.select().from(users).where(sql`lower(${users.email}) = ${cleanEmail}`).limit(1);
        
        if (result.length === 0) {
            return null;
        }
        
        const userFromDb = result[0];
        const storedPassword = userFromDb.passwordHash?.trim();

        if (!storedPassword) {
            return null;
        }

        // Validación Híbrida
        let isPasswordValid = false;
        if (storedPassword.startsWith('$2')) {
            isPasswordValid = await bcrypt.compare(pass, storedPassword);
        } else {
            isPasswordValid = (pass === storedPassword);
        }

        if (isPasswordValid) {
            const { passwordHash, ...userToReturn } = userFromDb;
            return {
                ...userToReturn,
                createdAt: userToReturn.createdAt?.toISOString() || new Date().toISOString()
            } as any;
        }
        
        return null;
    } catch (error) {
        console.error("AUTH_CRITICAL_ERROR:", error);
        return null;
    }
}

/**
 * Registro de nuevo Dueño de Taller (SaaS Onboarding)
 */
export async function registerWorkshopOwner(data: {
    userName: string;
    email: string;
    pass: string;
    workshopName: string;
    employeeCount: string;
    city: string;
    phone: string;
}) {
    try {
        const cleanEmail = data.email.trim().toLowerCase();
        
        // Verificar duplicados
        const existing = await db.select().from(users).where(eq(users.email, cleanEmail)).limit(1);
        if (existing.length > 0) {
            throw new Error("Este correo corporativo ya está registrado en el ecosistema.");
        }

        const userId = `user-${uuidv4()}`;
        const workshopId = `ws-${uuidv4()}`;
        const passwordHash = await bcrypt.hash(data.pass, 10);

        // 1. Crear Usuario Maestro
        await db.insert(users).values({
            id: userId,
            name: data.userName,
            email: cleanEmail,
            passwordHash: passwordHash,
            role: 'TallerAdmin',
            workshopId: null,
            emailVerified: false,
            createdAt: new Date()
        });

        // 2. Crear Taller Certificado
        await db.insert(workshops).values({
            id: workshopId,
            name: data.workshopName,
            ownerId: userId,
            subscription: 'Basic',
            employeeCount: data.employeeCount,
            city: data.city,
            phone: data.phone,
            type: 'Automotriz'
        });

        // 3. Vincular Usuario con el Taller
        const [updatedUser] = await db.update(users)
            .set({ workshopId: workshopId })
            .where(eq(users.id, userId))
            .returning();

        // 4. Crear Nodo de Sucursal Principal
        await db.insert(branches).values({
            id: `br-${uuidv4()}`,
            workshopId: workshopId,
            name: 'Sede Principal',
            address: data.city,
            phone: data.phone
        });

        return { success: true, user: updatedUser };
    } catch (error) {
        console.error("REGISTRATION_ERROR:", error);
        throw error;
    }
}
