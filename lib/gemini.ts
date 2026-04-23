import { GoogleGenAI } from '@google/genai';

/**
 * Gemini AI Client (New SDK @google/genai)
 */
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

export const geminiClient = new GoogleGenAI({
  apiKey: apiKey || '',
});

export const GEMINI_MODEL = process.env.NEXT_PUBLIC_GEMINI_MODEL || 'gemini-2.0-flash'; // Optimized for new SDK

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
  type: 'material' | 'labor' | 'process' | 'price_audit';
  marketRefPrice?: number;
}

/**
 * Utility to analyze project lines and suggest optimizations using Gemini
 * Includes a market price audit functionality
 */
export async function getProjectOptimizations(
  lines: any[], 
  settings: any
): Promise<OptimizationSuggestion[]> {
  try {
    const prompt = `Ești un expert în managementul proiectelor de construcții din România, specializat pe piața din anul 2026.
Analizează următoarele rânduri de deviz (articole) și oferă insight-uri pe două direcții:

1. OPTIMIZARE: Sugerează 3 oportunități de reducere cost sau timp (ex: materiale alternative, procese mecanizate).
2. AUDIT PREȚ: Compară prețurile unitare din deviz cu prețurile medii de piață estimate pentru 2026. 
   IMPORTANT: Piața 2026 se bazează pe prețuri de volum. Scade automat 10% din prețul pieței pentru a obține un benchmark conservator.
   Dacă prețul din deviz depășește acest benchmark (Preț Piață 2026 - 10%), semnalează-l ca "price_audit".

Date proiect:
- Linii deviz: ${JSON.stringify(lines.map(l => ({ 
    id: l.id,
    name: l.name || l.manual_name || l.items?.name, 
    qty: l.quantity, 
    unit: l.unit || l.manual_um || l.items?.um, 
    unitPrice: l.unit_price || l.manual_price || 0 
})))}
- Setări TVA: ${settings.tva}%, Profit: ${settings.profit}%

Exemplu context preț: BCA (circa 420 lei/mc), Cărămidă (circa 500-600 lei/mc). Dacă vezi Cărămidă la 1350 lei, este un derapaj masiv.

Răspunde DOAR cu un obiect JSON valid:
{
  "suggestions": [
    {
      "title": "Titlu scurt",
      "description": "Explicație (menționează prețul de piață calculat: preț_ref * 0.9)",
      "impactPrice": valoare_estimată_economie_lei,
      "impactTime": ore_estimate_salvate_sau_zero,
      "reasoning": "De ce e o idee bună",
      "actionLabel": "Buton text",
      "type": "material" | "labor" | "process" | "price_audit",
      "marketRefPrice": pret_piata_2026_minus_10_la_suta
    }
  ]
}`;

    // New SDK Syntax: models.generateContent
    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    const text = response.text; // Text directly available on response
    
    // Parse JSON safely
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);
    return data.suggestions || [];
  } catch (error) {
    console.error('Error getting AI optimizations:', error);
    return [];
  }
}
