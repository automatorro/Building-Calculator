'use client'

import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Image as ImageIcon, X, UploadCloud, Loader2 } from 'lucide-react'
import Image from 'next/image'

interface ImageUploaderProps {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label = 'Imagine reprezentativă' }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) return

      let file = e.target.files[0]
      
      // Optimizare automată înainte de upload
      const { optimizeImage } = await import('@/utils/image-optimizer')
      file = await optimizeImage(file)

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `post-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('blog-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Storage Error:', uploadError)
        throw new Error('Nu s-a putut încărca imaginea. Verifică dacă bucket-ul "blog-images" este creat.')
      }

      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(filePath)

      onChange(publicUrl)
      import('sonner').then(({ toast }) => toast.success('Imagine optimizată și încărcată'))
    } catch (error: any) {
      console.error('Upload error details:', error)
      import('sonner').then(({ toast }) => toast.error(error.message))
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    onChange('')
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-[#6B6860]">
        {label}
      </label>
      
      {value ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#E5E3DE] bg-white group">
          <Image 
            src={value} 
            alt="Preview" 
            fill 
            className="object-cover"
          />
          <button
            onClick={removeImage}
            className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-[#C0392B] opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E5E3DE] bg-[#F9F9F8] transition-colors hover:border-[#E8500A]/50 hover:bg-[#FFF0E8]/30">
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            {uploading ? (
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-[#E8500A]" />
            ) : (
              <UploadCloud className="mb-3 h-8 w-8 text-[#A8A59E]" />
            )}
            <p className="mb-1 text-sm text-[#6B6860]">
              <span className="font-semibold text-[#E8500A]">Apasă pentru a încărca</span> sau trage fișierul aici
            </p>
            <p className="text-xs text-[#A8A59E]">PNG, JPG sau WEBP (max. 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={uploadImage} 
            disabled={uploading}
          />
        </label>
      )}
    </div>
  )
}
