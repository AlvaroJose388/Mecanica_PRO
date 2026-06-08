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

export type TechnicalAssistantOutput = {
    analysis: string;
    steps: string[];
    tools: string[];
};

export async function askTechnicalAssistant(input: { query: string; vehicleInfo?: string }): Promise<TechnicalAssistantOutput> {
    try {
        // Placeholder for actual AI implementation
        return {
            analysis: `Análisis de: ${input.query}`,
            steps: ["Paso 1: Diagnóstico inicial", "Paso 2: Revisión de componentes", "Paso 3: Recomendaciones"],
            tools: ["Escáner OBD2", "Multímetro", "Herramienta de diagnóstico"]
        };
    } catch (error) {
        console.error("Technical Assistant Error:", error);
        return {
            analysis: "No se pudo procesar la solicitud",
            steps: ["Reintentar la operación"],
            tools: []
        };
    }
}

// Re-exporting types
export type { ClientNotificationInput };
