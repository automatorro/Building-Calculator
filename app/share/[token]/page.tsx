import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { calculateLineCosts, type EstimateLine, type ProjectSettings } from '@/utils/calculators/estimate'

export const dynamic = 'force-dynamic'

const lei = (n: number) =>
  n.toLocaleString('ro-RO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })

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
                ~{lei(data.total)} lei
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
              {lei(totalFaraTVA)}
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
              ~{lei(totalFaraTVA * (1 + settings.tva / 100))} lei
            </div>
          </div>
        </div>

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
