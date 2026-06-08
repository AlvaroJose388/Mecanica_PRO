"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageMessageProps {
  src: string
  alt?: string
  isOwn?: boolean
}

export function ImageMessage({ src, alt = "Imagen", isOwn = false }: ImageMessageProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Detectar si es data URL o URL normal
  const isDataUrl = src.startsWith('data:')
  const isWebP = src.includes('webp') || src.startsWith('data:image/webp')

  const downloadImage = () => {
    try {
      const link = document.createElement('a')
      link.href = src
      link.download = `evidencia-${Date.now()}.${isWebP ? 'webp' : 'png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error('Error descargando imagen:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-white shadow-lg hover:shadow-xl transition-all mt-1 max-w-sm">
          <img 
            src={src} 
            alt={alt}
            className="w-full h-auto object-cover max-h-80 rounded-2xl hover:scale-105 transition-transform"
            onError={(e) => {
              console.error('Error cargando imagen:', e)
            }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          <div className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex gap-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 bg-black/60 text-white hover:bg-black/80 rounded-full backdrop-blur-md"
              onClick={(e) => {
                e.stopPropagation()
                downloadImage()
              }}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogTrigger>
      
      <DialogContent className="max-w-3xl p-0 bg-black/95 border border-white/10">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-50 text-white hover:bg-white/10 h-8 w-8"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <img 
            src={src} 
            alt={alt}
            className="max-h-[70vh] max-w-full object-contain rounded-lg"
          />
          <Button
            onClick={downloadImage}
            className="bg-primary hover:bg-primary/80 text-white"
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
