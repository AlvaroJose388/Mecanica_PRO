
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * NODO DE CONEXIÓN GLOBAL - NEON POSTGRESQL
 * 
 * Este es el corazón del sistema. Establece un túnel seguro (SSL)
 * hacia el clúster global de Neon.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('FALLO CRÍTICO: DATABASE_URL no encontrada en las variables de entorno.');
}

// Configuración del cliente Postgres para Neon
const client = postgres(connectionString, { 
    ssl: 'require', 
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
});

// Exportación de la instancia global de base de datos
export const db = drizzle(client, { schema });
