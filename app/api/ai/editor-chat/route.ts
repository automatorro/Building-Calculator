import { NextRequest } from 'next/server'
import { geminiClient, GEMINI_MODEL } from '@/lib/gemini'

const MAX_HISTORY = 10

function buildEditorContext(lines: any[], dimensions: any, settings: any, projectName: string) {
  const dimText = dimensions ? [
    dimensions.suprafata   ? `Suprafață utilă: ${dimensions.suprafata} mp` : '',
    dimensions.perimetru   ? `Perimetru: ${dimensions.perimetru} ml` : '',
    dimensions.inaltime || dimensions.height
      ? `Înălțime nivel: ${dimensions.inaltime || dimensions.height} m` : '',
    dimensions.niveluri || dimensions.levels
      ? `Niveluri: ${dimensions.niveluri || dimensions.levels}` : '',
    dimensions.adancime    ? `Adâncime fundație: ${dimensions.adancime} m` : '',
  ].filter(Boolean).join('\n') : 'Dimensiuni nedefinite'

  const linesSummary = lines.map((l: any) => {
    const resources = (l.resources_override?.length > 0
      ? l.resources_override
      : l.items?.resources) || []
    return {
      id: l.id,
      cod: l.code || l.items?.code || 'MANUAL',
      denumire: l.name || l.manual_name || l.items?.name,
      um: l.unit || l.manual_um || l.items?.um,
      cantitate: l.quantity,
      etapa: l.stage_name || '—',
      resurse: resources.map((r: any) => ({
        tip: r.type,
        denumire: r.name,
        consum_per_um: r.consumption,
        um: r.um,
        pret_unitar: l.custom_prices?.[r.id] ?? r.unit_price,
        pierderi_pct: r.waste_percent ?? 0,
      })),
    }
  })

  return { dimText, linesSummary }
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, lines, settings, dimensions, projectName } = await req.json()
    const recentHistory: any[] = (history || []).slice(-MAX_HISTORY)
    const { dimText, linesSummary } = buildEditorContext(lines || [], dimensions, settings, projectName)

    const systemPrompt = `Ești verificatorul tehnic al devizului pentru proiectul "${projectName}". Răspunzi EXCLUSIV în română, fără englezisme.

DIMENSIUNI PROIECT:
${dimText}

REGULI DE VERIFICARE A REȚETELOR (norme românești 2026):
- Zidărie BCA 30cm: mortar M5/M10 ≥0.28mc/mc, manoperă 2.5-4h/mp
- Zidărie cărămidă: mortar ≥0.25mc/mc, manoperă 3-5h/mp
- Tencuială interioară (manuală): mortar 0.020-0.025mc/mp, manoperă 0.15-0.20h/mp
- Tencuială exterioară: mortar 0.025-0.030mc/mp
- Placaj ceramic / faianță: adeziv 4-7kg/mp, chit rosturi 0.3-0.5kg/mp, manoperă 0.25-0.4h/mp
- Gresie: adeziv 4-6kg/mp, manoperă 0.20-0.35h/mp
- Zugrăvit interior (vopsea lavabilă 2 straturi): vopsea 0.25-0.35kg/mp
- Beton turnat monolit: beton ≥0.95mc/mc element, armătură min 80kg/mc fundații, 100kg/mc planșee
- Cofraj: suprafața cofrată ≥ 2× suprafața secțiunii
- Izolație termică EPS/PIR: plăci 1mp/mp + dibluri 6-8buc/mp
- Instalație țeavă PP: îmbinări + fitinguri (min 1 buc la 2ml)
- Parchet: parchet 1.05-1.10mp/mp (pierderi 5-10%)

CE POȚI FACE:
1. VERIFICARE REȚETĂ: pentru orice linie, verifică dacă resursele și consumurile sunt corecte
2. DETECTARE LIPSURI: identifică linii fără resurse sau cu resurse insuficiente
3. VALIDARE CANTITĂȚI: corelează cantitățile cu dimensiunile proiectului (ex: dacă suprafața e 120mp, 500mp tencuială e nerealist)
4. CALCULE: calculează cantitatea totală de material X, costul unui stadiu, etc.
5. SUGESTII CONCRETE: propune consumuri corecte cu valori exacte

TON: tehnic, concis, direct. Fără introduceri. Treci direct la date.

DEVIZ COMPLET (${linesSummary.length} linii):
${JSON.stringify(linesSummary, null, 1)}`

    const historyText = recentHistory
      .map((h: any) => `${h.role === 'assistant' ? 'Verificator' : 'Constructor'}: ${h.text}`)
      .join('\n')

    const fullPrompt = historyText
      ? `${systemPrompt}\n\nConversație anterioară:\n${historyText}\n\nConstructor: ${message}\nVerificator:`
      : `${systemPrompt}\n\nConstructor: ${message}\nVerificator:`

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await geminiClient.models.generateContentStream({
            model: GEMINI_MODEL,
            contents: fullPrompt,
          })
          for await (const chunk of result) {
            const text = chunk.text
            if (text) controller.enqueue(encoder.encode(text))
          }
        } catch (err) {
          console.error('Editor chat stream error:', err)
          controller.enqueue(encoder.encode('Eroare la generarea răspunsului. Încearcă din nou.'))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error: any) {
    console.error('Editor chat error:', error)
    return new Response('Eroare internă.', { status: 500 })
  }
}
