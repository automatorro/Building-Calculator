import { GoogleGenAI } from '@google/genai';

/**
 * Gemini AI Client
 */
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export const geminiClient = new GoogleGenAI({
  apiKey: apiKey || '',
});

export const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-3-flash-preview';

/**
 * Interface for AI Optimization Suggestions
 */
export interface OptimizationSuggestion {
  title: string;
  description: string;
  impactPrice: number;
  impactTime: number; // in hours
  reasoning: string;
  actionLabel: string;
  type: 'material' | 'labor' | 'process';
}

/**
 * Utility to analyze project lines and suggest optimizations using Gemini
 */
export async function getProjectOptimizations(
  lines: any[], 
  settings: any
): Promise<OptimizationSuggestion[]> {
  try {
    const model = geminiClient.getGenerativeModel({ model: GEMINI_MODEL });
    
    const prompt = `Ești un expert în managementul proiectelor de construcții din România.
Analizează următoarele rânduri de deviz (articole) și sugerează 3 oportunități concrete de optimizare (reducere cost sau timp).
Fii specific: dacă vezi vată bazaltică, sugerează polistiren; dacă vezi manoperă mare, sugerează soluții mecanizate.

Date proiect:
- Linii deviz: ${JSON.stringify(lines.map(l => ({ name: l.name, qty: l.quantity, unit: l.unit, total: l.unit_price * l.quantity })))}
- Setări TVA: ${settings.tva}%, Profit: ${settings.profit}%

Răspunde DOAR cu un obiect JSON valid având structura:
{
  "suggestions": [
    {
      "title": "Titlu scurt",
      "description": "Explicație scurtă",
      "impactPrice": valoare_estimată_economie_lei,
      "impactTime": ore_estimate_salvate,
      "reasoning": "De ce e o idee bună",
      "actionLabel": "Buton text",
      "type": "material" | "labor" | "process"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON safely
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);
    return data.suggestions || [];
  } catch (error) {
    console.error('Error getting AI optimizations:', error);
    return [];
  }
}
