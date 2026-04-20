'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'

const sans = 'var(--font-dm-sans,"DM Sans",system-ui,sans-serif)'
const serif = 'var(--font-dm-serif,"DM Serif Display",Georgia,serif)'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      message: formData.get('message') as string,
    }

    const { error: insertError } = await supabase
      .from('contact_messages')
      .insert([data])

    setLoading(false)
    if (insertError) {
      setError('A apărut o eroare. Vă rugăm să reîncercați.')
    } else {
      setSuccess(true)
    }
  }

  return (
    <main style={{ background: '#FAFAF8', minHeight: '100vh', padding: '120px 32px 80px', fontFamily: sans }}>
      <div style={{ maxWidth: 1160, margin: '0 auto' }}>
        <Link href="/" style={{ color: '#E8500A', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 32 }}>
          ← Înapoi la prima pagină
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
          {/* Form & Info */}
          <div>
            <h1 style={{ fontFamily: serif, fontSize: 48, color: '#1E2329', marginBottom: 16, letterSpacing: '-.02em' }}>
              Contactează-ne
            </h1>
            <p style={{ fontSize: 18, color: '#6B6860', marginBottom: 40, lineHeight: 1.6 }}>
              Ai o întrebare tehnică sau vrei să afli mai multe despre cum te poate ajuta Șantier.app? Scrie-ne.
            </p>

            <div style={{ marginBottom: 40 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#E8500A', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 8 }}>E-mail</div>
              <a href="mailto:office@santier.app" style={{ fontSize: 24, fontWeight: 600, color: '#1E2329', textDecoration: 'none' }}>office@santier.app</a>
            </div>

            {success ? (
              <div style={{ padding: '32px', background: '#E8F5EE', borderRadius: 12, border: '1px solid #2A7D4F' }}>
                <h3 style={{ color: '#2A7D4F', fontSize: 20, marginBottom: 8, fontWeight: 700 }}>Mesaj trimis cu succes!</h3>
                <p style={{ color: '#2A7D4F', fontSize: 16 }}>Vom reveni cu un răspuns pe adresa de e-mail furnizată în cel mai scurt timp posibil.</p>
                <button onClick={() => setSuccess(false)} style={{ marginTop: 20, background: 'transparent', border: 'none', color: '#2A7D4F', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}>Trimite alt mesaj</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1E2329', marginBottom: 8 }}>Nume complet</label>
                    <input required name="name" type="text" placeholder="Ex: Popescu Ion" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #E5E3DE', fontSize: 15, fontFamily: sans }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1E2329', marginBottom: 8 }}>E-mail</label>
                    <input required name="email" type="email" placeholder="ion@firma.ro" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #E5E3DE', fontSize: 15, fontFamily: sans }} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1E2329', marginBottom: 8 }}>Subiect</label>
                  <input required name="subject" type="text" placeholder="Cum pot importa un Excel?" style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #E5E3DE', fontSize: 15, fontFamily: sans }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#1E2329', marginBottom: 8 }}>Mesaj</label>
                  <textarea required name="message" rows={5} placeholder="Descrie pe scurt cum te putem ajuta..." style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #E5E3DE', fontSize: 15, fontFamily: sans, resize: 'vertical' }} />
                </div>
                {error && <div style={{ color: '#C0392B', fontSize: 14, fontWeight: 600 }}>{error}</div>}
                <button disabled={loading} type="submit" style={{ 
                  background: '#1E2329', color: '#FFFFFF', padding: '16px', borderRadius: 8, 
                  border: 'none', fontSize: 16, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1, transition: 'all .2s'
                }}>
                  {loading ? 'Se trimite...' : 'Trimite mesajul'}
                </button>
              </form>
            )}
          </div>

          {/* Map */}
          <div style={{ position: 'relative', borderRadius: 24, overflow: 'hidden', height: '600px', background: '#E5E3DE' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d178122.95598687406!2d21.1118121!3d45.7537248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4745677dcb051a1f%3A0x512ad9484e3e3e0!2zVGltaciZb2FyYQ!5e1!3m2!1sro!2sro!4v1713600000000!5m2!1sro!2sro&layer=s" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', padding: '16px', borderRadius: 12, border: '1px solid rgba(0,0,0,0.1)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1E2329' }}>Centrul de Operațiuni Șantier</div>
              <div style={{ fontSize: 13, color: '#6B6860' }}>Timișoara, România</div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          main { padding: 80px 20px 40px !important; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 40px !important; }
          div[style*="height: 600px"] { height: 400px !important; order: -1; }
        }
      `}</style>
    </main>
  )
}
