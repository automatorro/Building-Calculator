'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, ArrowRight, CheckCircle, AlertTriangle, Calculator, Search } from 'lucide-react'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  loading?: boolean
}

interface Props {
  lines: any[]
  settings: any
  dimensions: any
  projectName: string
}

const QUICK_ACTIONS = [
  { label: 'Verifică toate rețetele', icon: CheckCircle, q: 'Verifică toate liniile din deviz și spune-mi care rețete sunt incomplete sau au consumuri nereale față de normele românești.' },
  { label: 'Găsește resurse lipsă', icon: AlertTriangle, q: 'Care linii de deviz nu au resurse definite sau au resurse insuficiente (ex: lipsă manoperă, lipsă material principal)?' },
  { label: 'Validează față de dimensiuni', icon: Calculator, q: 'Compară cantitățile din deviz cu dimensiunile proiectului. Există cantități care nu au sens față de suprafața sau perimetrul declarat?' },
  { label: 'Rezumă devizul pe etape', icon: Search, q: 'Fă un rezumat al devizului grupat pe etape: număr linii, resurse totale și eventuale probleme per etapă.' },
]

function buildInitialMessage(lines: any[], dimensions: any, projectName: string) {
  const totalResources = lines.reduce((acc, l) => {
    const res = (l.resources_override?.length > 0 ? l.resources_override : l.items?.resources) || []
    return acc + res.length
  }, 0)
  const linesWithoutRecipe = lines.filter(l => {
    const res = (l.resources_override?.length > 0 ? l.resources_override : l.items?.resources) || []
    return res.length === 0
  }).length

  const dimParts = dimensions ? [
    dimensions.suprafata ? `${dimensions.suprafata} mp` : '',
    dimensions.niveluri || dimensions.levels ? `${dimensions.niveluri || dimensions.levels} niveluri` : '',
    dimensions.perimetru ? `perim. ${dimensions.perimetru} ml` : '',
  ].filter(Boolean).join(', ') : ''

  let msg = `Sunt verificatorul tehnic pentru **${projectName}**.\n\nCunosc **${lines.length} linii** de deviz cu **${totalResources} resurse**.`
  if (dimParts) msg += `\nDimensiuni proiect: ${dimParts}.`
  if (linesWithoutRecipe > 0) msg += `\n\n⚠️ **${linesWithoutRecipe} linii** fără rețetă definită — recomand să încep cu verificarea acestora.`
  msg += `\n\nCu ce verificăm?`
  return msg
}

export default function EditorAIAssistant({ lines, settings, dimensions, projectName }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [history, setHistory] = useState<ChatMessage[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lines.length > 0) {
      setHistory([{ role: 'assistant', text: buildInitialMessage(lines, dimensions, projectName) }])
    }
  }, [projectName, lines.length])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const sendMessage = async (text?: string) => {
    const msg = text || message
    if (!msg.trim()) return

    const newHistory: ChatMessage[] = [...history, { role: 'user', text: msg }]
    setHistory(newHistory)
    setMessage('')
    setHistory(prev => [...prev, { role: 'assistant', text: '', loading: true }])

    try {
      const res = await fetch('/api/ai/editor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, history: newHistory, lines, settings, dimensions, projectName }),
      })

      if (!res.ok || !res.body) throw new Error()

      setHistory(prev => {
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
        setHistory(prev => {
          const next = [...prev]
          next[next.length - 1] = { role: 'assistant', text: snap }
          return next
        })
      }
    } catch {
      toast.error('Eroare la comunicarea cu verificatorul AI.')
      setHistory(prev => prev.slice(0, -1))
    }
  }

  const linesWithIssues = lines.filter(l => {
    const res = (l.resources_override?.length > 0 ? l.resources_override : l.items?.resources) || []
    return res.length === 0 && l.code !== 'MANUAL'
  }).length

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-[400px] max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-border/50 flex flex-col overflow-hidden mb-2"
            style={{ height: 'min(580px, calc(100vh - 120px))' }}
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div>
                  <p className="font-black text-sm">Verificator Deviz & Rețete</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    {lines.length} linii · cunoaște dimensiunile proiectului
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[90%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-border/30'
                      : 'bg-primary text-white rounded-tr-none'
                  }`}>
                    {msg.role === 'assistant' ? (
                      msg.loading ? (
                        <div className="flex gap-1 py-1">
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                          <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                      ) : (
                        <div className="prose dark:prose-invert prose-sm max-w-none
                          prose-p:mt-0 prose-p:mb-2 last:prose-p:mb-0
                          prose-headings:text-sm prose-headings:font-bold prose-headings:mb-1 prose-headings:mt-3
                          prose-ul:my-1 prose-li:my-0 prose-strong:text-slate-900 dark:prose-strong:text-white">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text || '…'}</ReactMarkdown>
                        </div>
                      )
                    ) : msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick actions */}
            <div className="px-4 py-3 grid grid-cols-2 gap-1.5 border-t border-border/20 bg-slate-50 dark:bg-slate-800/30 shrink-0">
              {QUICK_ACTIONS.map((action, i) => {
                const Icon = action.icon
                return (
                  <button
                    key={i}
                    onClick={() => sendMessage(action.q)}
                    className="flex items-center gap-2 text-left text-[11px] font-semibold px-3 py-2 bg-white dark:bg-slate-900 border border-border/50 rounded-xl hover:border-primary/50 hover:text-primary text-slate-600 transition-all"
                  >
                    <Icon size={11} className="shrink-0 text-primary" />
                    <span className="line-clamp-1">{action.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-slate-900 border-t border-border/20 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Ex: E corectă rețeta pentru tencuială?"
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl py-4 pl-5 pr-14 text-sm outline-none focus:ring-2 focus:ring-primary border-none"
                />
                <button
                  onClick={() => sendMessage()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-orange-600 transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buton flotant */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className={`relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-colors duration-200 ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-slate-900 text-white hover:bg-primary'
        }`}
        title="Verificator AI Rețete & Deviz"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
        {!isOpen && linesWithIssues > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-[10px] font-black text-white flex items-center justify-center border-2 border-white"
          >
            {linesWithIssues > 9 ? '9+' : linesWithIssues}
          </motion.span>
        )}
      </motion.button>
    </div>
  )
}
