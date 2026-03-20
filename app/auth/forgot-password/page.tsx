"use client"

import { useState } from "react"
import Link from "next/link"
import { createBrowserClient } from "@supabase/ssr"
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    setLoading(false)

    if (error) {
      setError("Nu am putut trimite emailul. Verifică adresa introdusă.")
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="card-bc space-y-6">
          <div className="w-16 h-16 bg-[#E8F5EE] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-[#2A7D4F]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#1E2329] mb-2">Email trimis!</h2>
            <p className="text-[#6B6860] text-sm leading-relaxed">
              Am trimis un link de resetare la <strong className="text-[#1E2329]">{email}</strong>. Verifică și folderul de spam.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="btn-ghost-bc w-full justify-center inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
            Înapoi la autentificare
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="card-bc space-y-6">
        <div>
          <div className="w-12 h-12 bg-[#FFF0E8] rounded-xl flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-[#E8500A]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1E2329] mb-1">Resetare parolă</h1>
          <p className="text-[#6B6860] text-sm">
            Introdu adresa de email și îți trimitem un link de resetare.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#6B6860] uppercase tracking-wider mb-1.5">
              Adresă email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@firma.ro"
              required
              className="input-bc"
            />
          </div>

          {error && (
            <div className="bg-[#FCECEA] border border-[#C0392B]/20 rounded-lg px-4 py-3 text-[#C0392B] text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email}
            className="btn-primary-bc w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Se trimite..." : "Trimite link de resetare"}
          </button>
        </form>

        <Link
          href="/auth/login"
          className="flex items-center justify-center gap-1.5 text-sm text-[#6B6860] hover:text-[#1E2329] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Înapoi la autentificare
        </Link>
      </div>
    </div>
  )
}
