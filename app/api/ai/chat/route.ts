import { NextRequest, NextResponse } from 'next/server';
import { geminiClient, GEMINI_MODEL } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { message, history, lines, settings, projectName } = await req.json();

    const contextPrompt = `Ești un consultant tehnic senior în construcții din România pentru proiectul "${projectName}". 
Context deviz curent (rezumat): ${JSON.stringify(lines.map((l: any) => ({ name: l.name || l.manual_name || l.items?.name, qty: l.quantity, price: l.unit_price || l.manual_price })))}

REGULI RĂSPUNS:
1. Răspunde EXCLUSIV în limba română, fără englezisme (fără benchmark, copilot, etc.).
2. Fii EXTREM de concis, direct și la obiect. Evită introducerile ("Bună ziua", "Analizez cu atenție") și concluziile lungi. Treci direct la date.
3. Fii specific și tehnic. Dacă ești întrebat de o optimizare, explică impactul exact în deviz în maxim 2-3 paragrafe sau listă.
4. Dacă utilizatorul întreabă de "zgură de locomotivă", verifică dacă există în devizul de mai sus. Dacă NU există, spune-i clar că nu vezi acest material în lista curentă și întreabă-l unde l-a văzut sau dacă se referă la o normă veche.
5. Folosește unități de măsură românești și prețuri raportate la piața 2026 (BCA ~420, Cărămidă ~500).

Istoric conversație:
${history.map((h: any) => `${h.role === 'assistant' ? 'AI' : 'User'}: ${h.text}`).join('\n')}

User: ${message}
AI:`;

    const response = await geminiClient.models.generateContent({
      model: GEMINI_MODEL,
      contents: contextPrompt,
    });

    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat AI Error:', error);
    return NextResponse.json({ error: 'Eroare la procesarea răspunsului AI' }, { status: 500 });
  }
}
