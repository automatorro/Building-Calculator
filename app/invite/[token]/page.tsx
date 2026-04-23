import { createClient } from '@/utils/supabase/server'
import { acceptInvitationAction } from '@/lib/actions/invitations'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, AlertCircle, ArrowRight, UserPlus } from 'lucide-react'

export default async function InviteAcceptPage({ params }: { params: { token: string } }) {
  const { token } = await params
  const supabase = await createClient()
  
  // 1. Get invitation info
  const { data: invite, error: inviteError } = await supabase
    .from('project_invitations')
    .select(`
      *,
      projects (
        name
      )
    `)
    .eq('token', token)
    .single()

  // 2. Check auth
  const { data: { user } } = await supabase.auth.getUser()

  if (inviteError || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full glass-card bg-white dark:bg-slate-900 border border-border/50 p-8 text-center space-y-6 rounded-3xl shadow-xl">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto text-red-500">
            <AlertCircle size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Invitație Invalidă</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Această invitație nu mai este valabilă, a expirat sau a fost deja folosită de altcineva.
          </p>
          <Link href="/" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
            Înapoi la Dashboard
          </Link>
        </div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login but keep the current URL as return to
    return redirect(`/auth/login?redirectedFrom=/invite/${token}`)
  }

  const project = invite.projects as any

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-md w-full glass-card bg-white dark:bg-slate-900 p-10 border border-border/50 shadow-2xl rounded-[40px] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-10">
          <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto text-primary mb-6 rotate-3">
                  <UserPlus size={40} />
              </div>
              <h3 className="font-black uppercase text-[10px] tracking-[0.2em] text-primary">Colaborare Nouă</h3>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  Ești gata să te alături echipei?
              </h1>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/40 p-8 rounded-[28px] space-y-6 border border-white/20">
              <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Proiectul</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-white">{project?.name || 'Proiect Fără Nume'}</p>
              </div>
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700/50">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Rolul tău atribuit</p>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                      <div className="bg-emerald-500/20 p-1 rounded-md">
                        <CheckCircle2 size={16} />
                      </div>
                      <span>Acces Complet • {invite.role}</span>
                  </div>
              </div>
          </div>

          <form action={async () => {
              'use server'
              const res = await acceptInvitationAction(token)
              if (res.success) {
                  redirect(`/projects/${res.projectId}`)
              }
          }}>
              <button type="submit" className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/30 hover:scale-[1.02] hover:bg-primary-dark active:scale-95 transition-all flex items-center justify-center gap-3 group">
                  Acceptă și Intră în Proiect
                  <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </button>
          </form>

          <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest opacity-60">
              Acceptând, vei avea acces securizat la datele proiectului.
          </p>
        </div>
      </div>
    </div>
  )
}
