import { useEffect, useMemo, useRef, useState } from 'react'

interface Props {
  youtubeUrl: string
  compact?: boolean
}

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)

    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.replace('/', '')
      return id || null
    }

    if (parsed.pathname.includes('/shorts/')) {
      const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0]
      return id || null
    }

    return parsed.searchParams.get('v')
  } catch {
    return null
  }
}

export function MusicaFundoDisplay({ youtubeUrl, compact = false }: Props) {
  const [playing, setPlaying] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const videoId = useMemo(() => getYoutubeVideoId(youtubeUrl), [youtubeUrl])

  const playerUrl = useMemo(() => {
    if (!videoId) return null
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&playsinline=1`
  }, [videoId])

  function postToPlayer(command: string, args: unknown[] = []) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args }),
      'https://www.youtube.com',
    )
  }

  useEffect(() => {
    postToPlayer(playing ? 'playVideo' : 'pauseVideo')
  }, [playing])

  function handleToggle() {
    setPlaying((p) => !p)
  }

  if (!youtubeUrl) {
    return (
      <div className="text-xs text-gray-400 text-center">
        Música de fundo não definida.
      </div>
    )
  }

  const control = (
    <div
      className={[
        compact ? 'relative inline-flex' : 'fixed left-4 bottom-4 z-50',
        'select-none',
      ].join(' ')}
    >
      <button
        type="button"
        onClick={handleToggle}
        className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-lg border border-white/10"
        aria-label={playing ? 'Pausar música' : 'Retomar música'}
      >
        {playing ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        )}
      </button>

      {playerUrl ? (
        <iframe
          ref={iframeRef}
          title="Música de fundo"
          src={playerUrl}
          className="w-0 h-0 opacity-0 pointer-events-none absolute"
          allow="autoplay; encrypted-media"
        />
      ) : null}
    </div>
  )

  return compact ? control : control
}
