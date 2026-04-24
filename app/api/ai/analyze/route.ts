import { NextRequest, NextResponse } from 'next/server'
import { geminiClient, GEMINI_MODEL } from '@/lib/gemini'
import type { OptimizationSuggestion } from '@/lib/ai-types'

function buildLinesSummary(lines: any[]) {
  return lines.map((l: any) => {
    const resources =
      (l.resources_override?.length > 0 ? l.resources_override : l.items?.resources) || []
    return {
      id: l.id,
      name: l.name || l.manual_name || l.items?.name,
      code: l.code || l.items?.code,
      qty: l.quantity,
      unit: l.unit || l.manual_um || l.items?.um,
      unitPrice: l.unit_price || l.manual_price || 0,
      category: l.category,
      stage: l.stage_name,
      resources: resources.map((r: any) => ({
        type: r.type,
        name: r.name,
        consumption: r.consumption,
        um: r.um,
        unitPrice: l.custom_prices?.[r.id] ?? r.unit_price,
        wastePct: r.waste_percent ?? 0,
      })),
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    const { lines, settings } = await req.json()

    if (!lines || lines.length === 0) {
      return NextResponse.json({ suggestions: [] })
    }

    const linesSummary = buildLinesSummary(lines)

    const prompt = `Ești un consultant senior în construcții din România, expert în devize, rețete de resurse și norme de consum pentru 2026.

REGULI CRITICE DE RĂSPUNS:
- Exclusiv română. Fără englezisme (fără benchmark, insight, etc.).
- Ton sobru, tehnic, concis. Fără introduceri sau concluzii lungi.
- NU inventa probleme care nu există în date.
- NU menționa materiale care nu apar în deviz.

CONTROL CANTITĂȚI — generează alertă "Eroare potențială de cantitate" dacă:
- >500mc beton într-o singură normă
- >3000mp tencuială/zugrăvit la o singură linie
- Consum de resursă zero sau negativ
- Cantitate de manoperă sub norma minimă indicativă

VERIFICARE REȚETE — verifică logica resurselor:
- Mortar la zidărie BCA: minim 0.25mc mortar per mc BCA
- Armatură la beton: minim 80kg/mc pentru fundații, 100kg/mc pentru planșee
- Ciment la tencuială: minim 250kg/mc mortar
- Dacă lipsesc resurse esențiale dintr-o normă, generează alertă tip "recipe_error"

PREȚURI REFERINȚĂ 2026 (compară cu unitPrice din deviz):
- BCA bloc 30cm: ~420 lei/mc | Cărămidă Porotherm: ~500-600 lei/mc
- Beton C16/20: ~380 lei/mc | Beton C25/30: ~430 lei/mc
- Mortar M10: ~450 lei/mc | Armătură PC52: ~4800 lei/t
- Nisip: ~80 lei/t | Pietriș: ~90 lei/t | Ciment CEM II: ~520 lei/t
- Tencuială manuală (manoperă): ~18-22 lei/mp | Zidărie BCA (manoperă): ~35-45 lei/mp
- Alarmă audit preț dacă unitPrice > 120%% din referință

DIRECȚII ANALIZĂ:
1. OPTIMIZĂRI: max 3 sugestii concrete (reducere cost sau timp).
2. AUDIT PREȚ: max 2 prețuri aberante față de piață.
3. ERORI REȚETĂ: resurse lipsă sau cantități de consum nereale.

DATE DEVIZ:
${JSON.stringify(linesSummary, null, 1)}

Setări proiect: TVA=${settings.tva}%%, Profit=${settings.profit}%%, Regie=${settings.regie ?? 'N/A'}%%

Răspunde STRICT în JSON, fără text suplimentar:
{
  "suggestions": [
    {
      "title": "string",
      "description": "string concis, max 2 propoziții, cu cifre concrete",
      "impactPrice": number,
      "impactTime": number,
      "reasoning": "string tehnic",
      "actionLabel": "string (ex: Verifică cantitatea, Înlocuiește material)",
      "type": "material"|"labor"|"process"|"price_audit"|"recipe_error",
      "marketRefPrice": number|null,
      "action": null | {
        "type": "correct_qty"|"replace_material"|"add_resource",
        "lineId": "string sau null",
        "payload": {}
      }
    }
  ]
}`

    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    })

    const text = response.text ?? ''
    const jsonStr = text.replace(/```json\n?|```\n?/g, '').trim()
    const data = JSON.parse(jsonStr)
    const suggestions: OptimizationSuggestion[] = data.suggestions || []

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error('AI Analyze Error:', error)
    return NextResponse.json({ suggestions: [] })
  }
}
