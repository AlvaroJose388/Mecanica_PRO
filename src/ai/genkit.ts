
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * CEREBRO CENTRAL DE INTELIGENCIA ARTIFICIAL
 * 
 * Configuración de Genkit v1.x.
 * Este nodo se comunica con Gemini 1.5 Flash para diagnósticos.
 */

export const ai = genkit({
  plugins: [
    googleAI(),
  ],
});
