'use client'

import { useState, useEffect } from 'react'
import { Plus, Users, Mail, Shield, Trash2, Loader2, UserPlus, ShieldCheck, Eye } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Member {
  id: string
  user_email: string
  role: 'Manager' | 'Editor' | 'Viewer'
  created_at: string
}

interface ProjectTeamSettingsProps {
  projectId: string
}

export default function ProjectTeamSettings({ projectId }: ProjectTeamSettingsProps) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [inviting, setInviting] = useState(false)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'Manager' | 'Editor' | 'Viewer'>('Editor')
  const supabase = createClient()

  const fetchMembers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('project_members')
      .select('*')
      .eq('project_id', projectId)
    
    if (error) {
      toast.error('Eroare la încărcarea echipei.')
    } else {
      setMembers(data as Member[])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchMembers()
  }, [projectId])

  const handleInvite = async () => {
    if (!email.includes('@')) {
      toast.error('Te rugăm să introduci o adresă de email validă.')
      return
    }

    setInviting(true)
    const { error } = await supabase
      .from('project_members')
      .insert([
        { project_id: projectId, user_email: email.toLowerCase(), role }
      ])

    if (error) {
      if (error.code === '23505') {
        toast.error('Acest utilizator face deja parte din echipă.')
      } else {
        toast.error('Eroare la invitarea membrului: ' + error.message)
      }
    } else {
      toast.success(`Invitație trimisă către ${email}!`)
      setEmail('')
      fetchMembers()
    }
    setInviting(false)
  }

  const handleRemoveMember = async (id: string, memberEmail: string) => {
    const confirmed = confirm(`Sigur vrei să elimini utilizatorul ${memberEmail} din proiect?`)
    if (!confirmed) return

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Eroare la eliminarea membrului.')
    } else {
      toast.success('Membru eliminat cu succes.')
      fetchMembers()
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Invite Section */}
      <div className="glass-card bg-white dark:bg-slate-900 border-border/50 shadow-xl p-6 md:p-8 rounded-3xl overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <UserPlus size={24} />
            </div>
            <div>
              <h3 className="font-black uppercase text-[10px] tracking-widest text-slate-400">Colaborare Proiect</h3>
              <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">Invită un Coleg sau Partener</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Email Utilizator</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email"
                  placeholder="ex: coleg@firma.ro"
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border border-border/50 rounded-xl py-3 pl-11 pr-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Rol Acces</label>
              <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-xl text-xs font-black flex items-center gap-2 border border-emerald-500/20">
                <ShieldCheck size={16} /> Acces Complet
              </div>
            </div>
            <button 
              onClick={handleInvite}
              disabled={inviting || !email}
              className="bg-primary text-white px-6 py-3.5 rounded-xl text-sm font-black shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {inviting ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
              <span>Invită în Echpă</span>
            </button>
          </div>
        </div>
        <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Members List */}
      <div className="glass-card bg-white dark:bg-slate-900 border-border/50 shadow-lg rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-slate-400" />
            <h3 className="font-black uppercase text-xs tracking-widest">Echipa Proiectului</h3>
            <span className="bg-slate-100 dark:bg-slate-800 text-[10px] font-black px-2 py-0.5 rounded-full text-slate-500">{members.length + 1} membri</span>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          <AnimatePresence>
            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-4">
                <Loader2 className="animate-spin" size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">Se încarcă membrii...</p>
              </div>
            ) : (
              <>
                {/* Note: In a real app, I'd also show the project owner here as "Admin" */}
                {members.length === 0 ? (
                  <div className="p-12 flex flex-col items-center justify-center text-slate-500 gap-2 text-center">
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                      <Users size={24} className="text-slate-300" />
                    </div>
                    <h4 className="font-black text-sm uppercase">Niciun alt membru invitat</h4>
                    <p className="text-xs text-slate-400 max-w-[250px]">Doar tu ai acces la acest proiect. Invită un coleg pentru a colabora.</p>
                  </div>
                ) : (
                  members.map((member) => (
                    <motion.div 
                      key={member.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                          {member.user_email[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-slate-900 dark:text-white">{member.user_email}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Membru din: {new Date(member.created_at).toLocaleDateString('ro-RO')}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          <span className={`text-[10px] font-black uppercase tracking-widest text-emerald-600`}>
                            Acces Complet
                          </span>
                        </div>
                        <button 
                          onClick={() => handleRemoveMember(member.id, member.user_email)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
