import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { calculateLineCosts, type EstimateLine, type ProjectSettings } from '@/utils/calculators/estimate'
import { fmtRon } from '@/utils/format'

export const dynamic = 'force-dynamic'

export default async function SharePage({ params }: { params: { token: string } }) {
  const supabase = await createClient()
  const { token } = await params

  const { data: project } = await supabase
    .from('projects')
    .select('id, name, location, created_at, settings, public_share_enabled')
    .eq('public_token', token)
    .eq('public_share_enabled', true)
    .single()

  if (!project) notFound()

  const { data: rawLines } = await supabase
    .from('estimate_lines')
    .select('*, items(*, normatives(code), resources(*))')
    .eq('project_id', project.id)

  const lines: EstimateLine[] = (rawLines || []).map((line: any) => {
    const item = Array.isArray(line.items) ? line.items[0] : line.items
    const norm = item && Array.isArray(item.normatives) ? item.normatives[0] : item?.normatives
    return {
      ...line,
      custom_prices: line.custom_prices || {},
      excluded_resources: line.excluded_resources || [],
      items: item ? { ...item, normatives: norm || null, resources: item.resources || [] } : null,
    }
  })

  const settings: ProjectSettings = (project.settings as ProjectSettings) || {
    profit: 5, regie: 10, tva: 21, taxe_manopera: 2.25,
  }

  /* Grupare pe etapă pentru afișare simplificată */
  const grouped: Record<string, { total: number; count: number }> = {}
  let totalFaraTVA = 0

  for (const line of lines) {
    const stage = line.stage_name || 'Lucrări Generale'
    const costs = calculateLineCosts(line, settings)
    if (!grouped[stage]) grouped[stage] = { total: 0, count: 0 }
    grouped[stage].total += costs.totalOfertatWithoutTVA
    grouped[stage].count++
    totalFaraTVA += costs.totalOfertatWithoutTVA
  }

  const today = new Date().toLocaleDateString('ro-RO', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const C = {
    black: '#1E2329', orange: '#E8500A', white: '#FAFAF8',
    gray100: '#F3F2EF', gray200: '#E5E3DE', gray400: '#A8A59E', gray600: '#6B6860',
    serif: 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)',
    sans: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
  }

  return (
    <div style={{ minHeight: '100vh', background: C.gray100, fontFamily: C.sans }}>
      {/* Header */}
      <div style={{ background: C.black, padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 28, height: 28, background: C.orange, borderRadius: 7,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 18h18" />
            <path d="M5 18v-1a7 7 0 0 1 14 0v1" />
            <path d="M10 11V7a2 2 0 0 1 4 0v4" />
          </svg>
        </div>
        <span style={{ fontFamily: C.sans, fontWeight: 600, fontSize: 15,
          color: C.white, letterSpacing: '-0.02em' }}>
          Santi<span style={{ color: C.orange }}>er</span>
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
          Deviz partajat · {today}
        </span>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px' }}>

        {/* Card proiect */}
        <div style={{ background: C.white, borderRadius: 16, padding: '28px 32px',
          border: `1px solid ${C.gray200}`, marginBottom: 24 }}>
          <h1 style={{ fontFamily: C.serif, fontSize: 28, fontWeight: 400,
            color: C.black, marginBottom: 6, letterSpacing: '-0.02em' }}>
            {project.name}
          </h1>
          {project.location && (
            <p style={{ fontSize: 14, color: C.gray600, marginBottom: 0 }}>
              📍 {project.location}
            </p>
          )}
        </div>

        {/* Estimare pe categorii */}
        <div style={{ background: C.white, borderRadius: 16, border: `1px solid ${C.gray200}`,
          overflow: 'hidden', marginBottom: 24 }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${C.gray200}`,
            background: C.gray100 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: C.black,
              textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Estimare pe categorii
            </h2>
          </div>
          {Object.entries(grouped).map(([stage, data]) => (
            <div key={stage} style={{ display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', padding: '14px 24px',
              borderBottom: `1px solid ${C.gray100}` }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 500, color: C.black }}>
                  {stage}
                </div>
                <div style={{ fontSize: 12, color: C.gray400 }}>
                  {data.count} articole
                </div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.orange }}>
                ~{fmtRon(data.total)} lei
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div style={{ background: C.black, borderRadius: 16, padding: '24px 32px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
              Total estimativ fără TVA
            </div>
            <div style={{ fontFamily: C.serif, fontSize: 36, color: C.white, lineHeight: 1 }}>
              {fmtRon(totalFaraTVA)}
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.4)',
                fontFamily: C.sans, fontWeight: 400 }}> lei</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 4 }}>
              Cu TVA {settings.tva}%
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: C.orange }}>
              ~{fmtRon(totalFaraTVA * (1 + settings.tva / 100))} lei
            </div>
          </div>
        </div>

        {/* WhatsApp Share */}
        {(() => {
          const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://santier.app'}/share/${token}`
          const whatsappMsg = encodeURIComponent(
            `Deviz proiect "${project.name}"\nTotal estimativ: ${fmtRon(totalFaraTVA)} lei (fără TVA)\nVezi detalii: ${shareUrl}`
          )
          return (
            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <a
                href={`https://wa.me/?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#25D366', color: 'white', border: 'none',
                  padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                  textDecoration: 'none', fontFamily: C.sans,
                  transition: 'transform .15s, box-shadow .15s',
                  boxShadow: '0 4px 12px rgba(37,211,102,0.3)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Trimite pe WhatsApp
              </a>
            </div>
          )
        })()}

        {/* Disclaimer */}
        <p style={{ textAlign: 'center', fontSize: 12, color: C.gray400,
          marginTop: 24, lineHeight: 1.6 }}>
          Prețuri orientative, generate automat de Santier.app.<br />
          Pentru deviz definitiv, contactați constructorul.
        </p>
      </div>
    </div>
  )
}
