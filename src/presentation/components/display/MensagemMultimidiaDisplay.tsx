import { useEffect, useMemo, useState } from 'react'

interface Props {
  youtubeUrl: string
  autoPlayDelayMs?: number
}

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    if (parsed.pathname.includes('/shorts/')) {
      const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0]
      return id ? `https://www.youtube.com/embed/${id}` : null
    }

    const id = parsed.searchParams.get('v')
    return id ? `https://www.youtube.com/embed/${id}` : null
  } catch {
    return null
  }
}

export function MensagemMultimidiaDisplay({ youtubeUrl, autoPlayDelayMs }: Props) {
  const [shouldPlay, setShouldPlay] = useState(autoPlayDelayMs === undefined)
  const embedUrl = useMemo(() => getYoutubeEmbedUrl(youtubeUrl), [youtubeUrl])
  const iframeUrl = useMemo(() => {
    if (!embedUrl) return null
    const params = 'controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&playsinline=1'
    return shouldPlay
      ? `${embedUrl}?${params}&autoplay=1`
      : `${embedUrl}?${params}`
  }, [embedUrl, shouldPlay])

  useEffect(() => {
    if (autoPlayDelayMs === undefined) return
    setShouldPlay(false)
    const timer = setTimeout(() => setShouldPlay(true), autoPlayDelayMs)
    return () => clearTimeout(timer)
  }, [autoPlayDelayMs, youtubeUrl])

  if (!iframeUrl) {
    return (
      <div className="h-44 rounded-xl border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
        Link do YouTube não definido
      </div>
    )
  }

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-200">
      <iframe
        title="Mensagem multimídia"
        src={iframeUrl}
        className="w-full aspect-video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
