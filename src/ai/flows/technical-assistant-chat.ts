
'use server';
/**
 * @fileOverview Nodo Maestro de Vigilancia Tecnológica.
 * 
 * Este módulo actúa como el cerebro de diagnóstico, consultando
 * modelos de IA para generar protocolos certificados.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TechnicalAssistantInputSchema = z.object({
  query: z.string().describe('Síntoma técnico o ruido detectado.'),
  vehicleInfo: z.string().optional().describe('Ficha del vehículo.'),
});
export type TechnicalAssistantInput = z.infer<typeof TechnicalAssistantInputSchema>;

const TechnicalAssistantOutputSchema = z.object({
  analysis: z.string().describe('Análisis de ingeniería de la falla.'),
  steps: z.array(z.string()).describe('Protocolo de reparación paso a paso.'),
  tools: z.array(z.string()).describe('Herramientas certificadas requeridas.'),
});
export type TechnicalAssistantOutput = z.infer<typeof TechnicalAssistantOutputSchema>;

// Definición del Prompt usando el modelo global
const technicalAssistantPrompt = ai.definePrompt({
    name: 'technicalAssistantPrompt',
    model: 'googleai/gemini-1.5-flash',
    input: { schema: TechnicalAssistantInputSchema },
    output: { schema: TechnicalAssistantOutputSchema },
    prompt: `Actúa como el Maestro Mecánico Principal de MecanicaPro. 
    Tu objetivo es proporcionar una Vigilancia Tecnológica precisa y profesional.

    CONTEXTO TÉCNICO:
    Vehículo: {{#if vehicleInfo}}{{vehicleInfo}}{{else}}No especificado{{/if}}
    Reporte de Falla: "{{query}}"

    INSTRUCCIONES:
    1. Proporciona un "analysis" técnico profundo y profesional.
    2. En "steps", enumera un protocolo de ejecución certificado paso a paso.
    3. En "tools", lista las herramientas especializadas necesarias.
    
    IMPORTANTE: Si el síntoma es vago, pide más detalles técnicos.`,
});

export async function technicalAssistantChat(input: TechnicalAssistantInput): Promise<TechnicalAssistantOutput> {
    try {
        if (!input.query || input.query.length < 3) {
            return {
                analysis: "SISTEMA EN ESPERA: Describa el síntoma técnico para iniciar el escaneo.",
                steps: ["Ingresar descripción de falla", "Especificar modelo del vehículo"],
                tools: ["Terminal MecanicaPro"]
            };
        }

        const { output } = await technicalAssistantPrompt(input);
        
        if (!output) {
            throw new Error('El modelo de IA no generó una respuesta válida.');
        }

        return output;
    } catch (error) {
        console.error("AI NODO ERROR:", error);
        // Devolvemos un error estructurado para que la UI sepa qué pasó
        return {
            analysis: `FALLO DE SINCRONIZACIÓN: ${error instanceof Error ? error.message : 'Error desconocido en el nodo de IA'}.`,
            steps: ["Verificar API Key de Gemini", "Revisar conexión a Internet", "Reintentar en 30 segundos"],
            tools: ["Protocolo de Soporte Técnico"]
        };
    }
}
