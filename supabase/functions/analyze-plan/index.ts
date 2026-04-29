// Supabase Edge Function: analyze-plan
// Primește un fișier (PDF sau imagine) în base64, apelează Anthropic API și returnează JSON structurat.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages'

const ANALYSIS_PROMPT = `Ești expert în citirea planurilor de construcție din România. Extrage TOATE datele tehnice.
Returnează EXCLUSIV JSON valid, fără text adițional, fără markdown.
Categorii în funcție de tipul planului detectat:
- ARMARE: specificatii_beton(campuri), armare(tabel: marca,nr_bare,diametru_mm,lungime_m,material,total_lungime_m,masa_liniara_kg_m,masa_totala_kg)
- COFRAJ: volume_beton(tabel: element,clasa_beton,volum_m3,suprafata_cofraj_m2)
- ARHITECTURAL: suprafete(tabel: incapere,destinatie,suprafata_mp,h_m,finisaje), usi, ferestre
- FUNDATII: tip_fundatie(campuri), fundatii(tabel)
- INSTALATII SANITARE: conducte_apa, conducte_canalizare, obiecte_sanitare
- INSTALATII ELECTRICE: circuite, aparataj, tablouri
- TERMOIZOLATIE: straturi(tabel: element,material,grosime_mm,lambda,suprafata_mp)
- HIDROIZOLATIE: straturi, materiale

Schema JSON de returnat:
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
      "campuri"?: [{ "label": string, "valoare": string, "unitate": string }],
      "coloane"?: [{ "cheie": string, "label": string, "tip": "text"|"numar" }],
      "randuri"?: [{ [cheie: string]: string | number }]
    }
  ],
  "note": string
}`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    if (!ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'ANTHROPIC_API_KEY nu este configurat în Supabase Secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { fileBase64, mediaType } = await req.json()

    if (!fileBase64 || !mediaType) {
      return new Response(
        JSON.stringify({ error: 'fileBase64 și mediaType sunt obligatorii.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const isPdf = mediaType === 'application/pdf'
    const contentBlock = isPdf
      ? { type: 'document', source: { type: 'base64', media_type: mediaType, data: fileBase64 } }
      : { type: 'image', source: { type: 'base64', media_type: mediaType, data: fileBase64 } }

    const anthropicResponse = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
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
            { type: 'text', text: ANALYSIS_PROMPT }
          ]
        }]
      })
    })

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text()
      return new Response(
        JSON.stringify({ error: `Anthropic API error: ${anthropicResponse.status} — ${errorText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const anthropicData = await anthropicResponse.json()
    const rawText: string = anthropicData?.content?.[0]?.text ?? ''

    // Strip markdown fences dacă modelul le adaugă totuși
    const jsonStr = rawText.replace(/```json\n?|```\n?/g, '').trim()
    const parsed = JSON.parse(jsonStr)

    return new Response(
      JSON.stringify(parsed),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Eroare necunoscută' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
