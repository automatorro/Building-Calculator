import { NextRequest, NextResponse } from 'next/server'
import { geminiClient, GEMINI_MODEL } from '@/lib/gemini'
import { checkRateLimit } from '@/lib/rate-limit'
import { checkAndIncrementAiLimit } from '@/lib/check-ai-limit'
import { createClient } from '@/utils/supabase/server'

const MAX_HISTORY = 12

function buildLinesSummary(lines: any[]) {
  return lines.slice(0, 25).map((l: any) => {
    const resources =
      (l.resources_override?.length > 0 ? l.resources_override : l.items?.resources) || []
    return {
      id: l.id,
      name: l.name || l.manual_name || l.items?.name,
      qty: l.quantity,
      unit: l.unit || l.manual_um || l.items?.um,
      unitPrice: l.unit_price || l.manual_price || 0,
      stage: l.stage_name,
      resources: resources.slice(0, 6).map((r: any) => ({
        type: r.type,
        name: r.name,
        consumption: r.consumption,
        um: r.um,
        unitPrice: l.custom_prices?.[r.id] ?? r.unit_price,
      })),
    }
  })
}

export async function POST(req: NextRequest) {
  try {
    // Rate limit per IP (protecție burst)
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
    const { allowed, retryAfterSeconds } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: `Prea multe cereri. Încearcă din nou în ${retryAfterSeconds} secunde.` },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      )
    }

    // Limita zilnică per utilizator (bazată pe planul de abonament)
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const limitResult = await checkAndIncrementAiLimit(user.id)
    if (limitResult instanceof NextResponse) return limitResult

    const { message, history, lines, settings, projectName } = await req.json()

    const recentHistory: any[] = (history || []).slice(-MAX_HISTORY)
    const linesSummary = buildLinesSummary(lines || [])

    const systemContext = `Ești consultant tehnic senior în construcții din România pentru proiectul "${projectName}".

Context deviz (primele 25 linii):
${JSON.stringify(linesSummary)}

Setări: TVA ${settings?.tva ?? 21}%, Profit ${settings?.profit ?? 10}%

REGULI ABSOLUTE:
1. Exclusiv română. Fără englezisme.
2. Concis și direct — fără "Bună ziua", fără rezumate repetitive la final.
3. Tehnic și cu cifre concrete. Referințe piață 2026: BCA ~420 lei/mc, Cărămidă ~500 lei/mc, Beton C16/20 ~380 lei/mc, Armătură ~4800 lei/t.
4. Dacă ești întrebat despre ceva ce NU există în devizul de mai sus, spune direct că nu îl găsești.
5. Pentru întrebări despre rețete: verifică resursele din context și identifică eventuale lipsuri față de normele standard.
6. Pentru corecții de calcul: arată formula și rezultatul numeric.`

    const historyText = recentHistory
      .map((h: any) => `${h.role === 'assistant' ? 'Consultant' : 'Constructor'}: ${h.text}`)
      .join('\n')

    const fullPrompt = historyText
      ? `${systemContext}\n\nConversație anterioară:\n${historyText}\n\nConstructor: ${message}\nConsultant:`
      : `${systemContext}\n\nConstructor: ${message}\nConsultant:`

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
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
        } catch (err: any) {
          console.error('Gemini stream error:', err)
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
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error: any) {
    console.error('Chat AI Error:', error)
    return new Response('Eroare internă la procesarea cererii.', { status: 500 })
  }
}
