import { NextRequest, NextResponse } from 'next/server'
import { geminiClient, GEMINI_MODEL } from '@/lib/gemini'

const VALID_TYPES = ['material', 'labor', 'equipment', 'transport']

export async function POST(req: NextRequest) {
  try {
    const { lineName, lineCode, lineUnit, quantity, dimensions } = await req.json()

    if (!lineName || !lineUnit) {
      return NextResponse.json({ error: 'Date insuficiente.' }, { status: 400 })
    }

    const dimText = dimensions
      ? [
          dimensions.suprafata ? `Suprafață: ${dimensions.suprafata} mp` : '',
          dimensions.perimetru ? `Perimetru: ${dimensions.perimetru} ml` : '',
          dimensions.inaltime || dimensions.height
            ? `Înălțime nivel: ${dimensions.inaltime || dimensions.height} m`
            : '',
          dimensions.niveluri || dimensions.levels
            ? `Niveluri: ${dimensions.niveluri || dimensions.levels}`
            : '',
        ]
          .filter(Boolean)
          .join(' · ')
      : ''

    const prompt = `Ești expert în normative de construcții românești 2026.
RETURNEAZĂ EXCLUSIV JSON VALID, fără text suplimentar, fără markdown, fără \`\`\`.

Generează rețeta completă de resurse pentru:
- Lucrare: ${lineName}
- Cod normativ: ${lineCode || 'nedefinit'}
- Unitate de măsură: ${lineUnit}
- Cantitate totală în proiect: ${quantity} ${lineUnit}${dimText ? `\n- Context proiect: ${dimText}` : ''}

REGULI STRICTE:
1. Consumurile sunt PER 1 ${lineUnit} (nu per cantitate totală)
2. Prețuri RON conform piața România 2026
3. Include OBLIGATORIU materialele principale + manopera
4. Utilaje/transport: doar dacă norma le cere explicit
5. waste_percent: 5-10 pentru materiale, 0 pentru manoperă/utilaje
6. Minimum 2 resurse (cel puțin 1 material + 1 manoperă)

FORMAT JSON EXACT (nu alt text):
{"explanation":"explicație scurtă în română despre rețeta generată, max 2 fraze","resources":[{"name":"denumire resursă","type":"material","um":"mc","consumption":0.022,"unit_price":280,"waste_percent":5}]}`

    const result = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    })

    const raw = result.text?.trim() ?? ''
    if (!raw) throw new Error('Răspuns gol de la AI.')

    let parsed: { explanation: string; resources: any[] }
    try {
      parsed = JSON.parse(raw)
    } catch {
      const match = raw.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('JSON invalid în răspunsul AI.')
      parsed = JSON.parse(match[0])
    }

    if (!Array.isArray(parsed.resources) || parsed.resources.length === 0) {
      throw new Error('Rețeta generată este goală.')
    }

    const resources = parsed.resources.map((r: any) => ({
      id: crypto.randomUUID(),
      name: String(r.name || 'Resursă'),
      type: VALID_TYPES.includes(r.type) ? r.type : 'material',
      um: String(r.um || 'buc'),
      consumption: Math.max(0, Number(r.consumption) || 0),
      unit_price: Math.max(0, Number(r.unit_price) || 0),
      waste_percent: Math.min(30, Math.max(0, Number(r.waste_percent) || 0)),
    }))

    return NextResponse.json({ explanation: String(parsed.explanation || ''), resources })
  } catch (error: any) {
    console.error('suggest-recipe error:', error)
    return NextResponse.json(
      { error: error.message || 'Eroare la generarea rețetei. Încearcă din nou.' },
      { status: 500 }
    )
  }
}
