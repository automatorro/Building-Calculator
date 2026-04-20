'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login?redirectedFrom=/admin')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        router.push('/')
        return
      }

      setIsAdmin(true)
      setLoading(false)
    }

    checkAdmin()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#FAFAF8]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#E8500A]" />
          <p className="text-sm text-[#6B6860]">Se verifică accesul admin...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  )
}
