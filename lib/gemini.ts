import { GoogleGenAI } from '@google/genai';

/**
 * Gemini AI Client
 * Uses the new @google/genai unified SDK.
 */
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

if (!apiKey) {
  console.warn('Warning: GOOGLE_GENERATIVE_AI_API_KEY is not defined in environment variables.');
}

export const geminiClient = new GoogleGenAI({
  apiKey: apiKey || '',
});

export const GEMINI_MODEL = process.env.GOOGLE_GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * Helper to process text prompts
 */
export async function generateText(prompt: string) {
  const result = await geminiClient.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });
  
  return result.text;
}
