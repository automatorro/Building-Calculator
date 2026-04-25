import { NextRequest, NextResponse } from 'next/server';
import { geminiClient, GEMINI_MODEL } from '@/lib/gemini';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (!rateLimit(`${ip}-purchase`, 5, 60_000)) {
    return NextResponse.json({ error: 'Prea multe cereri. Încearcă din nou în câteva secunde.' }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('file') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString('base64');
    const mimeType = imageFile.type;

    const prompt = `Analizează acest bon fiscal sau factură de achiziții materiale de construcții din România. 
Extrage informațiile relevante în format JSON strict. Nu adăuga alte explicații sau markdown în afara obiectului JSON.

Structura cerută:
{
  "vendorName": "Numele magazinului (ex: Dedeman, Hornbach, Mathaus)",
  "vendorCui": "Codul de identificare fiscală (CIF/CUI)",
  "date": "Data achiziției în format YYYY-MM-DD",
  "totalAmount": suma totală de plată (număr),
  "tvaAmount": valoarea totală a TVA-ului (număr),
  "items": [
    {
      "name": "Numele produsului (ex: Ciment, Nisip, Șuruburi)",
      "quantity": cantitatea (număr),
      "unitPrice": prețul unitar (număr),
      "totalPrice": prețul total pe linie (număr)
    }
  ]
}

Dacă o informație nu este lizibilă, pune null. Încearcă să normalizezi numele produselor pentru a fi ușor de recunoscut (ex: transforma "CIMENT HOLCIM 40KG" în "Ciment").`;

    const result = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const candidate = result.candidates?.[0];
    const responseText = candidate?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      return NextResponse.json({ error: 'AI failed to generate a response' }, { status: 500 });
    }
    try {
      const parsedData = JSON.parse(responseText);
      return NextResponse.json(parsedData);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', responseText);
      return NextResponse.json({ 
        error: 'Failed to parse AI response', 
        rawResponse: responseText 
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Gemini Purchase Processing Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
