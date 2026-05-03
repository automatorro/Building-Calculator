'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Send,
  Clock, Zap, Bot,
  ArrowRight, AlertCircle, ShoppingCart,
  Calculator, ChefHat, CheckCircle2, Info, RefreshCw,
} from 'lucide-react'
import type { OptimizationSuggestion, AIAction } from '@/lib/ai-types'
import { toast } from 'sonner'
import { fmtRon } from '@/utils/format'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  loading?: boolean
}

interface PendingAction {
  suggestion: OptimizationSuggestion
  action: AIAction
  line: any | null
  applying: boolean
}

interface Props {
  lines: any[]
  settings: any
  projectId: string
  projectName: string
  fullPage?: boolean
  onApplyAction?: (lineId: string, updates: Record<string, any>) => void
  initialSuggestions?: OptimizationSuggestion[]
  onSuggestionsChange?: (suggestions: OptimizationSuggestion[]) => void
}

const SUGGESTED_QUESTIONS_FULL = [
  'Identifică prețurile prea mari',
  'Verifică rețetele incomplete',
  'Compară BCA vs Cărămidă',
  'Cum pot economisi la manoperă?',
]

const SUGGESTED_QUESTIONS_MINI = [
  'Audit Prețuri',
  'Erori Rețetă',
  'Optimizări Cost',
]

const TYPE_CONFIG: Record<string, { icon: React.ElementType; colorClass: string; badgeClass: string }> = {
  price_audit: { icon: AlertCircle, colorClass: 'bg-red-100 text-red-600', badgeClass: 'bg-red-50/50 dark:bg-red-950/10 border-red-200/50 hover:bg-red-100/50' },
  recipe_error: { icon: ChefHat, colorClass: 'bg-orange-100 text-orange-600', badgeClass: 'bg-orange-50/50 dark:bg-orange-950/10 border-orange-200/50 hover:bg-orange-100/50' },
  material: { icon: Zap, colorClass: 'bg-blue-100 text-blue-600', badgeClass: 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-primary/20 hover:bg-white' },
  labor: { icon: Clock, colorClass: 'bg-amber-100 text-amber-600', badgeClass: 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-primary/20 hover:bg-white' },
  process: { icon: Zap, colorClass: 'bg-green-100 text-green-600', badgeClass: 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-primary/20 hover:bg-white' },
}

function SuggestionCard({
  s,
  onClick,
  onApply,
  canApply,
}: {
  s: OptimizationSuggestion
  onClick: () => void
  onApply?: () => void
  canApply: boolean
}) {
  const config = TYPE_CONFIG[s.type] ?? TYPE_CONFIG.material
  const Icon = config.icon
  const isAlert = s.type === 'price_audit' || s.type === 'recipe_error'
  const hasApply = canApply && !!s.action?.lineId && !!onApply

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-2xl border transition-all ${config.badgeClass}`}
    >
      <div
        className="cursor-pointer group"
        onClick={onClick}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.colorClass}`}>
              <Icon size={14} />
            </div>
            <h4 className={`font-bold text-sm transition-colors ${isAlert ? 'text-red-900 dark:text-red-400' : 'group-hover:text-primary'}`}>
              {s.title}
            </h4>
          </div>
          <div className="text-right shrink-0 ml-2">
            <div className={`${isAlert ? 'text-red-600' : 'text-green-600'} font-black text-sm`}>
              {isAlert ? 'Alertă' : s.impactPrice > 0 ? `-${fmtRon(s.impactPrice)} Lei` : '—'}
            </div>
            <div className="text-[9px] font-bold text-slate-400 uppercase">
              {isAlert ? 'Verificare necesară' : 'Impact estimat'}
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{s.description}</p>

        <div className="flex items-center justify-between pt-3 border-t border-border/30">
          <div className="flex items-center gap-2">
            {s.marketRefPrice != null && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 text-white rounded-lg font-mono text-[9px] font-bold">
                <ShoppingCart size={10} className="text-primary" />
                Ref. 2026: {fmtRon(s.marketRefPrice)} lei
              </div>
            )}
            {s.marketRefPrice == null && s.impactTime > 0 && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                <Clock size={10} /> {s.impactTime}h salvate
              </div>
            )}
          </div>
          <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
            {s.actionLabel} <ArrowRight size={12} />
          </button>
        </div>
      </div>

      {hasApply && (
        <button
          onClick={(e) => { e.stopPropagation(); onApply!() }}
          className="mt-3 w-full py-2.5 rounded-xl bg-primary text-white text-xs font-bold flex items-center justify-center gap-2 hover:bg-orange-600 transition-colors"
        >
          <CheckCircle2 size={13} /> Aplică modificarea în deviz
        </button>
      )}
    </motion.div>
  )
}

function ChatMessages({ history, chatEndRef }: { history: ChatMessage[]; chatEndRef: React.RefObject<HTMLDivElement> }) {
  return (
    <>
      {history.map((msg, i) => (
        <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
          <div className={`max-w-[88%] p-4 rounded-2xl text-sm leading-relaxed ${
            msg.role === 'assistant'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-border/30 shadow-sm'
              : 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
          }`}>
            {msg.role === 'assistant' ? (
              msg.loading ? (
                <div className="flex gap-1 py-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                </div>
              ) : (
                <div className="prose dark:prose-invert prose-xs max-w-none
                  prose-p:mt-0 prose-p:mb-3 last:prose-p:mb-0
                  prose-headings:text-sm prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0
                  prose-ul:my-2 prose-li:my-0.5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text || '…'}</ReactMarkdown>
                </div>
              )
            ) : (
              msg.text
            )}
          </div>
        </div>
      ))}
      <div ref={chatEndRef} />
    </>
  )
}

function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Adresați o întrebare tehnică...',
  compact = false,
}: {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  placeholder?: string
  compact?: boolean
}) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        className={`w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl ${compact ? 'py-4 pl-6 pr-14' : 'py-5 pl-8 pr-16'} text-sm focus:ring-2 focus:ring-primary outline-none`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
      />
      <button
        onClick={onSend}
        className={`absolute right-2 top-1/2 -translate-y-1/2 ${compact ? 'w-10 h-10' : 'w-12 h-12'} bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/20`}
      >
        <Send size={compact ? 18 : 20} />
      </button>
    </div>
  )
}

export default function ProjectAssistantAI({ lines, settings, projectId, projectName, fullPage = false, onApplyAction, initialSuggestions, onSuggestionsChange }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>(initialSuggestions ?? [])
  const [loading, setLoading] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      text: `Bună ziua! Sunt consultantul tehnic pentru proiectul **${projectName}**. Am analizat devizul și rețetele de resurse. Cu ce vă pot ajuta?`,
    },
  ])

  const runAnalysis = () => {
    if (lines.length === 0) { setLoading(false); return }
    setLoading(true)
    fetch('/api/ai/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lines, settings }),
    })
      .then((r) => r.json())
      .then((data) => {
        const s = data.suggestions || []
        setSuggestions(s)
        onSuggestionsChange?.(s)
      })
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false))
  }

  // Auto-fetch eliminat — utilizatorul declanșează manual analiza via butonul Regenerează

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleSendChat = async (text?: string) => {
    const msg = text || chatMessage
    if (!msg.trim()) return

    const newHistory: ChatMessage[] = [...history, { role: 'user', text: msg }]
    setHistory(newHistory)
    setChatMessage('')
    setHistory((prev) => [...prev, { role: 'assistant', text: '', loading: true }])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: newHistory, lines, settings, projectName }),
      })

      if (!res.ok || !res.body) throw new Error('Network error')

      // Replace loading indicator with empty message for streaming
      setHistory((prev) => {
        const next = [...prev]
        next[next.length - 1] = { role: 'assistant', text: '' }
        return next
      })

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        const snap = accumulated
        setHistory((prev) => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', text: snap }
          return next
        })
      }
    } catch {
      toast.error('Eroare de comunicare cu asistentul.')
      setHistory((prev) => prev.slice(0, -1))
    }
  }

  const handleSuggestionClick = (s: OptimizationSuggestion) => {
    if (!fullPage && !isOpen) setIsOpen(true)
    handleSendChat(
      `Detalii despre: "${s.title}". ${s.description} Cum influențează restul devizului și ce acțiune concretă recomandați?`
    )
  }

  const handleApply = (s: OptimizationSuggestion) => {
    if (!s.action) return
    const line = s.action.lineId ? lines.find(l => l.id === s.action!.lineId) ?? null : null
    setPendingAction({ suggestion: s, action: s.action, line, applying: false })
  }

  const confirmApply = () => {
    if (!pendingAction || !onApplyAction) return
    const { action, line } = pendingAction
    if (!line) {
      toast.error('Linia din deviz nu a fost găsită. Regenerează analiza și încearcă din nou.')
      setPendingAction(null)
      return
    }

    setPendingAction(prev => prev ? { ...prev, applying: true } : null)

    let updates: Record<string, any> = {}

    if (action.type === 'correct_qty' && action.payload.newQty != null) {
      updates = { quantity: Number(action.payload.newQty) }
    } else if (action.type === 'add_resource' && action.payload.resource) {
      const base: any[] = line.resources_override?.length > 0
        ? line.resources_override
        : [...(line.items?.resources ?? [])]
      const newRes = {
        id: `ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        type: action.payload.resource.type ?? 'material',
        name: action.payload.resource.name ?? 'Resursă nouă',
        um: action.payload.resource.um ?? 'buc',
        consumption: Number(action.payload.resource.consumption ?? 0),
        unit_price: Number(action.payload.resource.unit_price ?? 0),
        waste_percent: Number(action.payload.resource.waste_percent ?? 0),
      }
      updates = { resources_override: [...base, newRes] }
    } else if (action.type === 'replace_material' && action.payload.resourceId) {
      const base: any[] = line.resources_override?.length > 0
        ? line.resources_override
        : [...(line.items?.resources ?? [])]
      updates = {
        resources_override: base.map((r: any) =>
          r.id === action.payload.resourceId ? { ...r, ...(action.payload.updates ?? {}) } : r
        ),
      }
    }

    if (Object.keys(updates).length > 0) {
      onApplyAction(line.id, updates)
      toast.success('Modificare aplicată — se salvează automat.')
    } else {
      toast.error('Nu am putut aplica modificarea. Verifică manual în editor.')
    }
    setPendingAction(null)
  }

  const badgeCount = suggestions.length

  // ── Modal confirmare acțiune ────────────────────────────────────
  const ConfirmModal = pendingAction ? (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-md w-full border border-border/50"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center">
            <CheckCircle2 size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-black text-base dark:text-white">Confirmi modificarea?</h3>
            <p className="text-[11px] text-slate-400 font-medium">{pendingAction.suggestion.title}</p>
          </div>
        </div>

        {/* Preview modificare */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 mb-4 space-y-2">
          {pendingAction.action.type === 'correct_qty' && pendingAction.line && (
            <>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                {pendingAction.line.name ?? pendingAction.line.items?.name ?? 'Articol'}
              </p>
              <div className="flex items-center gap-3 text-sm">
                <span className="line-through text-red-500 font-mono font-bold">
                  {pendingAction.line.quantity} {pendingAction.line.unit ?? pendingAction.line.items?.um ?? ''}
                </span>
                <ArrowRight size={14} className="text-slate-400" />
                <span className="text-green-600 font-mono font-bold">
                  {pendingAction.action.payload.newQty} {pendingAction.line.unit ?? pendingAction.line.items?.um ?? ''}
                </span>
              </div>
            </>
          )}
          {pendingAction.action.type === 'add_resource' && pendingAction.line && (
            <>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">
                Se adaugă resursă la: {pendingAction.line.name ?? pendingAction.line.items?.name}
              </p>
              <p className="text-xs text-slate-500">
                {pendingAction.action.payload.resource?.name} — {pendingAction.action.payload.resource?.consumption} {pendingAction.action.payload.resource?.um} × {fmtRon(pendingAction.action.payload.resource?.unit_price ?? 0)} lei
              </p>
            </>
          )}
          {pendingAction.action.type === 'replace_material' && pendingAction.line && (
            <p className="text-xs text-slate-500">
              Se actualizează resursa în: {pendingAction.line.name ?? pendingAction.line.items?.name}
            </p>
          )}
          {!pendingAction.line && (
            <div className="flex items-start gap-2 text-amber-700">
              <Info size={14} className="mt-0.5 shrink-0" />
              <p className="text-xs">Linia nu a fost identificată automat. Aplică manual din editor.</p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 italic mb-6 leading-relaxed">{pendingAction.suggestion.reasoning}</p>

        <div className="flex gap-3">
          <button
            onClick={() => setPendingAction(null)}
            className="flex-1 py-3 rounded-2xl border border-border font-bold text-sm text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Renunț
          </button>
          <button
            onClick={confirmApply}
            disabled={pendingAction.applying || !pendingAction.line}
            className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-orange-600 transition-colors disabled:opacity-40"
          >
            {pendingAction.applying ? 'Se aplică…' : 'Aplică modificarea'}
          </button>
        </div>
      </motion.div>
    </div>
  ) : null

  // ── FULL PAGE MODE ──────────────────────────────────────────────
  if (fullPage) {
    return (
      <>
        {ConfirmModal}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[80vh]">
        {/* Panel stânga — Sugestii */}
        <div className="glass-card bg-white dark:bg-slate-900 border-border/50 shadow-2xl relative overflow-hidden rounded-3xl lg:col-span-1">
          <div className="p-6 border-b border-border/30 bg-primary/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Calculator size={20} />
                </div>
                <div>
                  <h3 className="font-black uppercase text-[10px] tracking-widest text-primary">Asistență Tehnică</h3>
                  <h2 className="text-lg font-black dark:text-white">Audit & Optimizări</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!loading && badgeCount > 0 && (
                  <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-1 rounded-full">
                    {badgeCount} alerte
                  </span>
                )}
                <button
                  onClick={runAnalysis}
                  disabled={loading}
                  title="Regenerează analiza"
                  className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors disabled:opacity-40"
                >
                  <RefreshCw size={14} className={`text-primary ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-slate-400 font-medium italic">Se analizează rețetele și prețurile 2026…</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((s, i) => (
                  <SuggestionCard
                    key={i}
                    s={s}
                    onClick={() => handleSuggestionClick(s)}
                    onApply={onApplyAction ? () => handleApply(s) : undefined}
                    canApply={!!onApplyAction}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-border rounded-3xl">
                <p className="text-xs text-slate-400 italic">Nu am identificat abateri de preț sau erori de rețetă. Devizul pare echilibrat.</p>
              </div>
            )}
          </div>
        </div>

        {/* Panel dreapta — Chat */}
        <div className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-border/50 overflow-hidden min-h-[600px]">
          <div className="p-6 bg-primary text-white flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Bot size={28} />
            </div>
            <div>
              <h3 className="font-bold text-lg tracking-tight">Consultant Tehnic</h3>
              <div className="text-xs text-white/70 font-medium flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Disponibil pentru deviz și rețete
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            <ChatMessages history={history} chatEndRef={chatEndRef} />
          </div>

          <div className="px-6 py-4 flex flex-wrap gap-2 border-t border-border/30 bg-slate-50 dark:bg-slate-800/30">
            {SUGGESTED_QUESTIONS_FULL.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendChat(q)}
                className="text-xs font-bold px-4 py-2 bg-white dark:bg-slate-900 border border-border/50 rounded-full hover:border-primary/50 text-slate-500 hover:text-primary transition-all shadow-sm"
              >
                {q}
              </button>
            ))}
          </div>

          <div className="p-6 bg-white dark:bg-slate-900 border-t border-border/30">
            <ChatInput
              value={chatMessage}
              onChange={setChatMessage}
              onSend={handleSendChat}
              placeholder="Adresați o întrebare despre deviz sau rețete..."
            />
          </div>
        </div>
      </div>
      </>
    )
  }

  // ── FLOATING / DASHBOARD MODE ────────────────────────────────────
  return (
    <>
      {ConfirmModal}
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="w-[380px] h-[580px] bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-border/50 flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-5 bg-primary text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-tight">Consultant Tehnic</h3>
                  <div className="text-[10px] text-white/70 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Activ
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Sugestii compacte */}
            {!loading && suggestions.length > 0 && (
              <div className="px-4 pt-3 pb-1 space-y-2 border-b border-border/20">
                {suggestions.slice(0, 2).map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestionClick(s)}
                    className={`w-full text-left text-[11px] px-3 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                      s.type === 'price_audit' || s.type === 'recipe_error'
                        ? 'bg-red-50 text-red-700 hover:bg-red-100'
                        : 'bg-primary/5 text-primary hover:bg-primary/10'
                    }`}
                  >
                    {(s.type === 'price_audit' || s.type === 'recipe_error') ? <AlertCircle size={12} /> : <Zap size={12} />}
                    <span className="line-clamp-1">{s.title}</span>
                    <ArrowRight size={10} className="ml-auto shrink-0" />
                  </button>
                ))}
              </div>
            )}

            {/* Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              <ChatMessages history={history} chatEndRef={chatEndRef} />
            </div>

            {/* Pills */}
            <div className="px-4 py-3 flex flex-wrap gap-2 border-t border-border/30 bg-slate-50 dark:bg-slate-800/30">
              {SUGGESTED_QUESTIONS_MINI.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendChat(q)}
                  className="text-[10px] font-bold px-3 py-1.5 bg-white dark:bg-slate-900 border border-border/50 rounded-full hover:border-primary/50 text-slate-500 hover:text-primary transition-all shadow-sm"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-border/30">
              <ChatInput
                value={chatMessage}
                onChange={setChatMessage}
                onSend={handleSendChat}
                placeholder="Adresați o întrebare..."
                compact
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buton flotant */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-slate-900 text-white rotate-90 scale-110' : 'bg-primary text-white hover:scale-110 hover:shadow-primary/30'
        }`}
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && badgeCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white"
          >
            {badgeCount > 9 ? '9+' : badgeCount}
          </motion.div>
        )}
      </button>
    </div>
    </>
  )
}
