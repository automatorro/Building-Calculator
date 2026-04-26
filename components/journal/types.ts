import type { CSSProperties } from 'react'

export type EntryType = 'crew' | 'work' | 'weather' | 'note' | 'problem'

export interface JournalEntry {
  id: string
  project_id: string
  date: string
  entry_type: EntryType
  stage_name?: string
  estimate_line_id?: string
  data: Record<string, any>
  photos: string[]
  created_at: string
}

export interface Worker {
  name: string
  role: string
  hours: number
}

export const WORKER_ROLES = [
  'Zidar', 'Dulgher', 'Fierar betonist', 'Instalator', 'Electrician',
  'Tencuitor', 'Faianțar', 'Zugrav', 'Muncitor necalificat', 'Alta',
]

export const WEATHER_CONDITIONS: Record<string, string> = {
  sunny:  'Însorit ☀️',
  cloudy: 'Noros ☁️',
  rain:   'Ploaie 🌧️',
  snow:   'Ninsoare ❄️',
  freeze: 'Ger 🥶',
}

export const ENTRY_TYPE_LABELS: Record<EntryType, string> = {
  crew:    'Echipă',
  work:    'Lucrare',
  weather: 'Vreme',
  note:    'Notă',
  problem: 'Problemă',
}

export const ENTRY_TYPE_COLORS: Record<EntryType, { bg: string; text: string; border: string }> = {
  crew:    { bg: '#E6F1FB', text: '#093462', border: '#0C447C' },
  work:    { bg: '#E8F5EE', text: '#1F5E3A', border: '#2A7D4F' },
  weather: { bg: '#F3F2EF', text: '#4A4744', border: '#A8A59E' },
  note:    { bg: '#FFF0E8', text: '#C43F06', border: '#E8500A' },
  problem: { bg: '#FCEBEB', text: '#791F1F', border: '#C0392B' },
}

export function formatDateRo(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function getEntryDescription(entry: JournalEntry): string {
  switch (entry.entry_type) {
    case 'crew': {
      const workers: Worker[] = entry.data?.workers ?? []
      if (workers.length === 0) return 'Echipă prezentă'
      const names = workers.map(w => w.name).filter(Boolean).join(', ')
      const totalHours = workers.reduce((s, w) => s + (w.hours || 0), 0)
      return `${workers.length} muncitor${workers.length !== 1 ? 'i' : ''}: ${names} · ${totalHours}h total`
    }
    case 'work':
      return entry.data?.description || `Progres ${entry.data?.progress_pct ?? 0}%`
    case 'weather':
      return WEATHER_CONDITIONS[entry.data?.condition] || entry.data?.condition || 'Vreme înregistrată'
    case 'note':
      return entry.data?.text || 'Notă adăugată'
    case 'problem':
      return entry.data?.description || 'Problemă înregistrată'
    default:
      return 'Intrare jurnal'
  }
}

export const inputStyle: CSSProperties = {
  width: '100%',
  padding: '10px 14px',
  background: '#F3F2EF',
  border: '1px solid #E5E3DE',
  borderRadius: 8,
  fontSize: 14,
  color: '#1E2329',
  fontFamily: 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)',
  outline: 'none',
  boxSizing: 'border-box',
}
