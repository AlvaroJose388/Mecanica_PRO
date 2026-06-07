'use server';
import { 
    generateClientNotification as generate, 
    type ClientNotificationInput 
} from '@/ai/flows/notification-flow';

/**
 * Acciones de Servidor para el motor de IA de MecanicaPro.
 * Estas funciones actúan como puentes entre la UI y los flujos de Genkit.
 */

export async function generateClientNotification(input: ClientNotificationInput) {
    try {
        return await generate(input);
    } catch (error) {
        console.error("Notification Generation Error:", error);
        // Fallback robusto para asegurar que la automatización no se detenga si falla la IA
        return {
            message: `Hola ${input.clientName}, te informamos desde ${input.workshopName} que tu vehículo (${input.vehicleDescription}) se encuentra ${input.orderStatus} tras realizar el servicio de ${input.serviceDescription}. ¡Te esperamos!`
        };
    }
}

// Re-exporting types
export type { ClientNotificationInput };
