import { useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'
import type { DotType, CornerSquareType, CornerDotType } from 'qr-code-styling'

interface TemplateConfig {
  bgColor: string
  dotsColor: string
  cornersColor: string
  dotsType: DotType
  cornersSquareType: CornerSquareType
  cornersDotType: CornerDotType
  containerClass: string
  emoji?: string
}

const TEMPLATE_MAP: Record<string, TemplateConfig> = {
  'template-1': { bgColor: '#ffffff', dotsColor: '#1a1a1a', cornersColor: '#1a1a1a', dotsType: 'rounded', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-white' },
  'template-2': { bgColor: '#ffffff', dotsColor: '#C62A87', cornersColor: '#C62A87', dotsType: 'extra-rounded', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-gradient-to-br from-pink-100 via-rose-50 to-violet-100', emoji: '🌸' },
  'template-3': { bgColor: '#f9fafb', dotsColor: '#374151', cornersColor: '#374151', dotsType: 'classy-rounded', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-gray-50' },
  'template-4': { bgColor: '#fce7f3', dotsColor: '#9d174d', cornersColor: '#be185d', dotsType: 'dots', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-pink-100', emoji: '💗' },
  'template-5': { bgColor: '#e0f2fe', dotsColor: '#0369a1', cornersColor: '#0284c7', dotsType: 'rounded', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-sky-100', emoji: '☁️' },
  'template-6': { bgColor: '#f0fdf4', dotsColor: '#166534', cornersColor: '#15803d', dotsType: 'classy', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-green-50', emoji: '🌼' },
  'template-7': { bgColor: '#fff1f2', dotsColor: '#9f1239', cornersColor: '#e11d48', dotsType: 'extra-rounded', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-rose-50', emoji: '🌹' },
  'template-8': { bgColor: '#ede9fe', dotsColor: '#5b21b6', cornersColor: '#7c3aed', dotsType: 'dots', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-violet-100', emoji: '💜' },
  'template-9': { bgColor: '#e9d5ff', dotsColor: '#4c1d95', cornersColor: '#6d28d9', dotsType: 'extra-rounded', cornersSquareType: 'extra-rounded', cornersDotType: 'dot', containerClass: 'bg-purple-200', emoji: '🔮' },
}

const DEFAULT_TEMPLATE = TEMPLATE_MAP['template-1']

function emojiToDataUrl(emoji: string, size = 80): string {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.font = `${Math.floor(size * 0.72)}px serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(emoji, size / 2, size / 2 + size * 0.04)
  return canvas.toDataURL('image/png')
}

interface Props {
  slug: string
  qrTemplate?: string
  size?: number
}

export function QRCodeViewer({ slug, qrTemplate, size = 200 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRCodeStyling | null>(null)

  const siteUrl = `${window.location.origin}/site/${slug}`
  const tpl = TEMPLATE_MAP[qrTemplate ?? 'template-1'] ?? DEFAULT_TEMPLATE

  useEffect(() => {
    const emojiDataUrl = tpl.emoji ? emojiToDataUrl(tpl.emoji) : undefined

    const options = {
      type: 'canvas' as const,
      width: size,
      height: size,
      data: siteUrl,
      qrOptions: { errorCorrectionLevel: 'H' as const },
      backgroundOptions: { color: tpl.bgColor },
      dotsOptions: { color: tpl.dotsColor, type: tpl.dotsType },
      cornersSquareOptions: { color: tpl.cornersColor, type: tpl.cornersSquareType },
      cornersDotOptions: { color: tpl.cornersColor, type: tpl.cornersDotType },
      image: emojiDataUrl ?? '',
      imageOptions: { hideBackgroundDots: true, imageSize: 0.25, margin: 6, saveAsBlob: true },
    }

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling(options)
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
        qrRef.current.append(containerRef.current)
        const canvas = containerRef.current.querySelector('canvas')
        if (canvas) { canvas.style.width = '100%'; canvas.style.height = '100%' }
      }
    } else {
      qrRef.current.update(options)
      const canvas = containerRef.current?.querySelector('canvas')
      if (canvas) { canvas.style.width = '100%'; canvas.style.height = '100%' }
    }
  }, [siteUrl, tpl, size])

  return (
    <div className={`rounded-2xl overflow-hidden shadow-lg w-full h-full ${tpl.containerClass}`}>
      <div ref={containerRef} className="w-full h-full" />
    </div>
  )
}
