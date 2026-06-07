'use server';
/**
 * @fileOverview Recomendación inteligente de partes basada en servicios.
 *
 * - recommendParts - Sugiere repuestos necesarios basándose en la descripción del servicio.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const RecommendationInputSchema = z.object({
  serviceDescription: z.string().describe('Descripción del servicio a realizar.'),
});

const RecommendationOutputSchema = z.object({
  suggestedParts: z.array(z.object({
    name: z.string(),
    reason: z.string(),
  })).describe('Lista de partes sugeridas y la razón de la sugerencia.'),
});

const recommendPartsPrompt = ai.definePrompt({
    name: 'recommendPartsPrompt',
    model: 'googleai/gemini-1.5-flash',
    input: { schema: RecommendationInputSchema },
    output: { schema: RecommendationOutputSchema },
    prompt: `Actúa como un experto en logística de talleres automotrices certificados. 
    Basado en el servicio "{{serviceDescription}}", ¿qué partes o consumibles del inventario logístico se suelen requerir bajo protocolos OEM?
    
    Ejemplo: Si es "Cambio de aceite", sugiere "Aceite 10W30" y "Filtro de aceite".
    `,
});

const recommendPartsFlow = ai.defineFlow(
    {
        name: 'recommendPartsFlow',
        inputSchema: RecommendationInputSchema,
        outputSchema: RecommendationOutputSchema,
    },
    async (input) => {
        const { output } = await recommendPartsPrompt(input);
        if (!output) throw new Error('Error al generar recomendación de partes logísticas.');
        return output;
    }
);

export async function recommendParts(serviceDescription: string) {
    return recommendPartsFlow({ serviceDescription });
}
