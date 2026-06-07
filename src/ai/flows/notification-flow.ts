'use server';
/**
 * @fileOverview A flow for generating client notifications.
 *
 * - generateClientNotification - Generates a friendly notification message for a client.
 * - ClientNotificationInput - The input type for the flow.
 * - ClientNotificationOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClientNotificationInputSchema = z.object({
  clientName: z.string().describe('The name of the client.'),
  vehicleDescription: z.string().describe('A description of the vehicle (e.g., "tu Mazda 3").'),
  serviceDescription: z.string().describe('The main service performed on the vehicle.'),
  orderStatus: z.string().describe('The new status of the order (e.g., "listo para ser recogido").'),
  workshopName: z.string().describe('The name of the workshop.'),
});
export type ClientNotificationInput = z.infer<typeof ClientNotificationInputSchema>;

const ClientNotificationOutputSchema = z.object({
  message: z.string().describe('The generated notification message for the client.'),
});
export type ClientNotificationOutput = z.infer<typeof ClientNotificationOutputSchema>;


const prompt = ai.definePrompt({
    name: 'generateClientNotificationPrompt',
    model: 'googleai/gemini-1.5-flash',
    input: { schema: ClientNotificationInputSchema },
    output: { schema: ClientNotificationOutputSchema },
    prompt: `Eres un asistente de comunicación certificado para el taller "{{workshopName}}".
    Tu tarea es redactar un mensaje de WhatsApp corto, amigable y profesional para notificar a un cliente VIP sobre el estado técnico de su vehículo.

    Contexto Operativo:
    - Cliente: {{clientName}}
    - Vehículo: {{vehicleDescription}}
    - Servicio: {{serviceDescription}}
    - Estado Actual: {{orderStatus}}

    Mantén un tono de excelencia técnica y calidez humana.`,
});

const generateClientNotificationFlow = ai.defineFlow(
  {
    name: 'generateClientNotificationFlow',
    inputSchema: ClientNotificationInputSchema,
    outputSchema: ClientNotificationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Fallo en el nodo de comunicación IA.');
    }
    return output;
  }
);


export async function generateClientNotification(input: ClientNotificationInput): Promise<ClientNotificationOutput> {
    return generateClientNotificationFlow(input);
}
