import { GoogleGenAI } from '@google/genai';

/**
 * Gemini AI Client (New SDK @google/genai)
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
    const prompt = `Ești un consultant senior în construcții din România, expert în devize și management de costuri pentru anul 2026.
Analizează rândurile de deviz primite și oferă recomandări profesionale. 

REGULI CRITICE DE LIMBAJ:
- NU folosi termeni în engleză sau englezisme (ex: NU folosi 'benchmark', 'insight', 'live analysis', 'hub', 'copilot').
- Folosește exclusiv terminologie tehnică românească (ex: 'Valoare de referință', 'Analiză în timp real', 'Centru de asistență', 'Ghid de optimizare').
- Tonul trebuie să fie sobru, profesionist, EXTREM de concis și la obiect. Evită introducerile lungi, politețurile inutile sau concluziile repetitive.

CALITATEA INFORMAȚIEI:
- NU inventa probleme care nu există. Analizează DACĂ materialele din deviz sunt potrivite.
- NU menționa 'zgură de locomotivă' sub nicio formă, decât dacă acest text apare exact în Datele proiectului de mai jos. Este o eroare gravă să sugerezi înlocuirea a ceva ce nu există în deviz.
- Fii realist: concentrează-te pe soluții actuale în România 2026 (BCA, Cărămidă poroterm, Polistiren grafitat, Vată bazaltică, Pompe de căldură).
- Sugestiile trebuie să fie direct corelate cu liniile de deviz primite. Dacă nu vezi oportunități evidente, nu forța sugestii absurde.
- Audit Preț: Compară prețurile cu media pieței de volum din 2026, minus 10%.

Direcții analiză:
1. OPTIMIZARE: 3 sugestii de reducere cost sau timp.
2. AUDIT PREȚ: Identifică prețuri unitare mult peste media pieței (Preț Referință - 10%).

Date proiect:
- Linii deviz: ${JSON.stringify(lines.map(l => ({ 
    name: l.name || l.manual_name || l.items?.name, 
    qty: l.quantity, 
    unit: l.unit || l.manual_um || l.items?.um, 
    unitPrice: l.unit_price || l.manual_price || 0 
})))}
- Setări TVA: ${settings.tva}%, Profit: ${settings.profit}%

Exemple prețuri referință (orientative): BCA (~420 lei/mc), Cărămidă (~500-600 lei/mc), Beton C16/20 (~380 lei/mc).

Răspunde strict în format JSON:
{
  "suggestions": [
    {
      "title": "Titlu profesionist",
      "description": "Explicație detaliată și realistă în română (menționează prețul de referință calculat)",
      "impactPrice": valoare_economie_lei,
      "impactTime": ore_salvate,
      "reasoning": "Argumentație tehnică solidă",
      "actionLabel": "Acțiune (ex: Vezi alternativă)",
      "type": "material" | "labor" | "process" | "price_audit",
      "marketRefPrice": pret_referinta_piata_minus_10_la_suta
    }
  ]
}`;

    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt
    });

    const text = response.text;
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);
    return data.suggestions || [];
  } catch (error) {
    console.error('Eroare AI:', error);
    return [];
  }
}
