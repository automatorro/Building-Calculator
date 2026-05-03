import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export async function POST(req: NextRequest) {
  try {
    // Auth guard
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Neautorizat' }, { status: 401 })
    }

    const { projectId, projectName, stage, exceeded, userEmail } = await req.json()

    if (!projectName || !stage || !exceeded) {
      return NextResponse.json({ error: 'Date insuficiente.' }, { status: 400 })
    }

    const recipientEmail = userEmail || user.email
    if (!recipientEmail) {
      return NextResponse.json({ error: 'Nu s-a putut determina adresa email.' }, { status: 400 })
    }

    const projectLink = projectId ? `${APP_URL}/projects/${projectId}` : APP_URL
    const exceededFormatted = Number(exceeded).toLocaleString('ro-RO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    const { data, error } = await getResend().emails.send({
      from: 'Santier.app <onboarding@resend.dev>',
      to: recipientEmail,
      subject: `⚠️ Depășire buget: etapa "${stage}" pe proiect "${projectName}"`,
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #E5E3DE; border-radius: 16px; background: #FAFAF8;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 20px;">
            <div style="width: 28px; height: 28px; background: #E8500A; border-radius: 7px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-weight: bold; font-size: 14px;">S</span>
            </div>
            <span style="font-weight: 600; font-size: 15px; color: #1E2329;">Santier.app</span>
          </div>

          <div style="background: #FCEBEB; border: 1px solid rgba(192, 57, 43, 0.2); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
            <h2 style="color: #791F1F; font-size: 18px; margin: 0 0 8px 0;">
              ⚠️ Depășire buget detectată
            </h2>
            <p style="color: #C0392B; font-size: 14px; line-height: 1.6; margin: 0;">
              Etapa <strong>"${stage}"</strong> din proiectul <strong>"${projectName}"</strong>
              a depășit bugetul planificat cu <strong>${exceededFormatted} lei</strong>.
            </p>
          </div>

          <div style="margin: 24px 0;">
            <a href="${projectLink}" style="background: #E8500A; color: white; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; display: inline-block; font-size: 14px; box-shadow: 0 4px 12px rgba(232, 80, 10, 0.2);">
              Accesează proiectul →
            </a>
          </div>

          <p style="font-size: 12px; color: #A8A59E; margin-top: 24px; line-height: 1.5;">
            Această notificare a fost generată automat de Santier.app.<br>
            Verifică achiziția recentă și ajustează bugetul dacă e necesar.
          </p>

          <hr style="border: 0; border-top: 1px solid #E5E3DE; margin: 20px 0;">
          <p style="font-size: 10px; color: #A8A59E; text-align: center; text-transform: uppercase; letter-spacing: 0.1em;">
            © 2026 Santier.app — Software pentru Construcții
          </p>
        </div>
      `,
    })

    if (error) {
      return NextResponse.json({ error: error.message || 'Eroare la trimiterea emailului.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Eroare internă.' }, { status: 500 })
  }
}
