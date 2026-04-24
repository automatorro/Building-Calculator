'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, MessageSquare, X, Send, 
  TrendingDown, Clock, Zap, Info, 
  ChevronRight, Lightbulb, Bot, 
  ArrowRight, AlertCircle, ShoppingCart,
  Search, Calculator, FileText
} from 'lucide-react'
import { getProjectOptimizations, OptimizationSuggestion } from '@/lib/gemini'
import { toast } from 'sonner'
import { fmtRon } from '@/utils/format'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  lines: any[]
  settings: any
  projectId: string
  projectName: string
  fullPage?: boolean
}

export default function ProjectAssistantAI({ lines, settings, projectId, projectName, fullPage = false }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  const [history, setHistory] = useState<any[]>([
    { role: 'assistant', text: `Bună ziua! Sunt asistentul dumneavoastră tehnic pentru proiectul **${projectName}**. Am analizat devizul și prețurile raportate la piața din 2026. Cu ce recomandare doriți să începem?` }
  ])

  useEffect(() => {
    async function load() {
      if (lines.length > 0) {
        setLoading(true)
        const data = await getProjectOptimizations(lines, settings)
        setSuggestions(data)
        setLoading(false)
      }
    }
    load()
  }, [projectId, lines.length])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleSendChat = async (text?: string) => {
    const msg = text || chatMessage
    if (!msg.trim()) return

    const newHistory = [...history, { role: 'user', text: msg }]
    setHistory(newHistory)
    setChatMessage('')
    
    // Adăugăm un mesaj temporar de "se gândește"
    const thinkingMsg = { role: 'assistant', text: 'Se analizează datele proiectului...', loading: true }
    setHistory(prev => [...prev, thinkingMsg])

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          history: newHistory,
          lines,
          settings,
          projectName
        })
      })

      const data = await res.json()
      
      // Înlocuim mesajul de încărcare cu răspunsul real
      setHistory(prev => {
        const newer = [...prev]
        newer[newer.length - 1] = { role: 'assistant', text: data.text || 'Nu am putut genera un răspuns acum.' }
        return newer
      })
    } catch (err) {
      toast.error('Eroare de comunicare cu asistentul.')
      setHistory(prev => prev.slice(0, -1)) // Scoatem mesajul de loading
    }
  }

  const handleSuggestionClick = (s: OptimizationSuggestion) => {
    if (!fullPage && !isOpen) {
      setIsOpen(true)
    }
    const prompt = `Doresc mai multe detalii despre sugestia: "${s.title}". ${s.description}. Cum influențează acest lucru restul devizului?`
    handleSendChat(prompt)
  }

  const SUGGESTED_QUESTIONS_FULL = [
    "Identifică prețurile prea mari",
    "Compară BCA vs Cărămidă",
    "Cum pot economisi la manoperă?",
    "Verifică normele de consum"
  ]

  const SUGGESTED_QUESTIONS_MINI = [
    "Audit Prețuri",
    "Optimizări Cost",
    "Analiză Manoperă"
  ]

  const renderMessageContent = (msg: any) => {
    if (msg.role === 'assistant') {
      if (msg.loading) {
        return (
          <div className="flex gap-1 py-1">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
          </div>
        )
      }
      return (
        <div className="prose dark:prose-invert prose-xs max-w-none 
          prose-p:mt-0 prose-p:mb-3 last:prose-p:mb-0
          prose-headings:text-sm prose-headings:font-bold prose-headings:mb-2 prose-headings:mt-4 first:prose-headings:mt-0
          prose-ul:my-2 prose-li:my-0.5"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
        </div>
      )
    }
    return msg.text
  }

  return (
    <div className={`space-y-6 ${fullPage ? 'min-h-[80vh]' : ''}`}>
      <div className={fullPage ? "grid grid-cols-1 lg:grid-cols-3 gap-8" : "space-y-6"}>
        {/* 1. Secțiunea de RECOMANDĂRI (Înlocuiește vechiul Hub/Comparator) */}
        <div className={`glass-card bg-white dark:bg-slate-900 border-border/50 shadow-2xl relative overflow-hidden rounded-3xl ${fullPage ? 'lg:col-span-1' : ''}`}>
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
              {!loading && (
                <span className="bg-primary/10 text-primary text-[10px] font-black uppercase px-2 py-1 rounded-full animate-pulse">
                  Verificare Reală
                </span>
              )}
            </div>
          </div>

          <div className="p-6 space-y-4">
            {loading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-slate-400 font-medium italic">Se verifică referințele de preț 2026...</p>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="space-y-4">
                {suggestions.map((s, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    onClick={() => handleSuggestionClick(s)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      s.type === 'price_audit' ? 'bg-red-50/50 dark:bg-red-950/10 border-red-200/50 hover:bg-red-100/50' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-primary/20 hover:bg-white'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          s.type === 'price_audit' ? 'bg-red-100 text-red-600' : 
                          s.type === 'material' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                          {s.type === 'price_audit' ? <AlertCircle size={14} /> : 
                           s.type === 'material' ? <Zap size={14} /> : <Clock size={14} />}
                        </div>
                        <h4 className={`font-bold text-sm ${s.type === 'price_audit' ? 'text-red-900 dark:text-red-400' : 'group-hover:text-primary'} transition-colors`}>{s.title}</h4>
                      </div>
                      <div className="text-right">
                        <div className={`${s.type === 'price_audit' ? 'text-red-600' : 'text-green-600'} font-black text-sm`}>
                          {s.type === 'price_audit' ? 'Derapaj' : `-${fmtRon(s.impactPrice)} Lei`}
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase">
                          {s.type === 'price_audit' ? 'Peste referință' : 'Impact estimat'}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">{s.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                      <div className="flex items-center gap-2">
                        {s.marketRefPrice && (
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 text-white rounded-lg font-mono text-[9px] font-bold">
                            <ShoppingCart size={10} className="text-primary" />
                            Ref. 2026: {fmtRon(s.marketRefPrice)} lei
                          </div>
                        )}
                        {!s.marketRefPrice && s.impactTime > 0 && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                             <Clock size={10} /> {s.impactTime} ore salvate
                          </div>
                        )}
                      </div>
                      <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-tighter group-hover:translate-x-1 transition-transform">
                        {s.actionLabel} <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-border rounded-3xl">
                <Info className="mx-auto text-slate-300 mb-2" />
                <p className="text-xs text-slate-400 italic">Nu am identificat abateri de preț. Devizul este echilibrat.</p>
              </div>
            )}
          </div>
        </div>

        {/* 2. Chat-ul ASISTENTULUI (Numai în modul Tab/FullPage) */}
        {fullPage && (
          <div className="lg:col-span-2 flex flex-col bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-border/50 overflow-hidden min-h-[600px]">
             {/* Header */}
             <div className="p-6 bg-primary text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Bot size={28} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg tracking-tight">Ghid Tehnic Proiect</h3>
                    <div className="text-xs text-white/70 font-medium flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" /> Disponibil pentru analiză rânduri
                    </div>
                  </div>
                </div>
              </div>

              {/* Istoric Chat */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {history.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[88%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'assistant' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-border/30 shadow-sm' 
                      : 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
                    }`}>
                      {renderMessageContent(msg)}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Sugestii întrebări */}
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

              {/* Zona de Input */}
              <div className="p-6 bg-white dark:bg-slate-900 border-t border-border/30">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Adresați o întrebare tehnică despre proiect..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-5 pl-8 pr-16 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  />
                  <button 
                    onClick={() => handleSendChat()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
          </div>
        )}
      </div>

      {/* 3. Butonul Plutitor (Numai în Dashboard) */}
      {!fullPage && (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="w-[380px] h-[550px] bg-white dark:bg-slate-900 shadow-2xl rounded-3xl border border-border/50 flex flex-col overflow-hidden mb-4"
            >
              {/* Header */}
              <div className="p-6 bg-primary text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-tight">Ghid Tehnic</h3>
                    <div className="text-[10px] text-white/70 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> Activ
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Istoric Chat */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
                {history.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'assistant' 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-border/30' 
                      : 'bg-primary text-white rounded-tr-none shadow-lg shadow-primary/20'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Sugestii Pills */}
              <div className="px-6 py-4 flex flex-wrap gap-2 border-t border-border/30 bg-slate-50 dark:bg-slate-800/30">
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

              {/* Zona de Input */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-border/30">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Adresați o întrebare..."
                    className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-2xl py-4 pl-6 pr-14 text-sm focus:ring-2 focus:ring-primary outline-none"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                  />
                  <button 
                    onClick={() => handleSendChat()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
            isOpen ? 'bg-slate-900 text-white rotate-90 scale-110' : 'bg-primary text-white hover:scale-110 hover:shadow-primary/30'
          }`}
        >
          {isOpen ? <X size={28} /> : <Bot size={28} />}
          {!isOpen && (
            <motion.div 
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold"
            >
              3
            </motion.div>
          )}
        </button>
      </div>
      )}
    </div>
  )
}
