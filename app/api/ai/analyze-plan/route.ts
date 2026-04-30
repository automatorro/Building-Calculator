import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

const ANALYSIS_PROMPT = `Ești expert în citirea planurilor de construcție din România. Extrage TOATE datele tehnice.
Returnează EXCLUSIV JSON valid, fără text adițional, fără markdown, fără \`\`\`json.
Categorii în funcție de tipul planului detectat:
- ARMARE: specificatii_beton(campuri), armare(tabel: marca,nr_bare,diametru_mm,lungime_m,material,total_lungime_m,masa_liniara_kg_m,masa_totala_kg)
- COFRAJ: volume_beton(tabel: element,clasa_beton,volum_m3,suprafata_cofraj_m2)
- ARHITECTURAL: suprafete(tabel: incapere,destinatie,suprafata_mp,h_m,finisaje), usi, ferestre
- FUNDATII: tip_fundatie(campuri), fundatii(tabel)
- INSTALATII SANITARE: conducte_apa, conducte_canalizare, obiecte_sanitare
- INSTALATII ELECTRICE: circuite, aparataj, tablouri
- TERMOIZOLATIE: straturi(tabel: element,material,grosime_mm,lambda,suprafata_mp)
- HIDROIZOLATIE: straturi, materiale

Schema JSON de returnat (respectă exact această structură):
{
  "tip_plan": string,
  "element": string,
  "scara": string,
  "faza": string,
  "categorii": [
    {
      "id": string,
      "titlu": string,
      "tip": "campuri" | "tabel",
      "campuri": [{ "label": string, "valoare": string, "unitate": string }],
      "coloane": [{ "cheie": string, "label": string, "tip": "text"|"numar" }],
      "randuri": [{ [cheie: string]: string | number }]
    }
  ],
  "note": string
}`

export async function POST(req: NextRequest) {
  try {
    // Verifică autentificare
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Neautentificat.' }, { status: 401 })
    }

    // Verifică plan premium
    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_plan')
      .eq('id', user.id)
      .single()
    const plan = profile?.subscription_plan ?? 'gratuit'
    const isPremium = plan === 'constructor' || plan === 'echipa'
    if (!isPremium) {
      return NextResponse.json(
        { error: 'Funcție disponibilă doar pentru planurile Constructor și Echipă.' },
        { status: 403 }
      )
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY nu este configurat pe server.' },
        { status: 500 }
      )
    }

    const { fileBase64, mediaType } = await req.json()
    if (!fileBase64 || !mediaType) {
      return NextResponse.json(
        { error: 'fileBase64 și mediaType sunt obligatorii.' },
        { status: 400 }
      )
    }

    const isPdf = mediaType === 'application/pdf'
    const contentBlock = isPdf
      ? { type: 'document', source: { type: 'base64', media_type: mediaType, data: fileBase64 } }
      : { type: 'image', source: { type: 'base64', media_type: mediaType, data: fileBase64 } }

    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-beta': 'pdfs-2024-09-25',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{
          role: 'user',
          content: [
            contentBlock,
            { type: 'text', text: ANALYSIS_PROMPT },
          ],
        }],
      }),
    })

    if (!anthropicRes.ok) {
      const errorText = await anthropicRes.text()
      return NextResponse.json(
        { error: `Anthropic API error ${anthropicRes.status}: ${errorText}` },
        { status: 502 }
      )
    }

    const anthropicData = await anthropicRes.json()
    const rawText: string = anthropicData?.content?.[0]?.text ?? ''

    // Strip markdown fences dacă modelul le adaugă
    const jsonStr = rawText.replace(/```json\n?|```\n?/g, '').trim()
    const parsed = JSON.parse(jsonStr)

    return NextResponse.json(parsed)
  } catch (err: any) {
    console.error('analyze-plan error:', err)
    return NextResponse.json(
      { error: err?.message ?? 'Eroare internă.' },
      { status: 500 }
    )
  }
}
