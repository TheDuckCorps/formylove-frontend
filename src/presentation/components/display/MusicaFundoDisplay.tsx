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
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(60)
  const [showVolume, setShowVolume] = useState(false)
  const longPressedRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const pressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const videoId = useMemo(() => getYoutubeVideoId(youtubeUrl), [youtubeUrl])
  const playerUrl = useMemo(() => {
    if (!videoId) return null
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&rel=0&playsinline=1&mute=${muted ? 1 : 0}`
  }, [muted, videoId])

  function postToPlayer(command: string, args: unknown[] = []) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args }),
      '*',
    )
  }

  useEffect(() => {
    postToPlayer(muted ? 'mute' : 'unMute')
  }, [muted])

  useEffect(() => {
    postToPlayer('setVolume', [volume])
  }, [volume])

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!showVolume) return
      if (!containerRef.current?.contains(event.target as Node)) {
        setShowVolume(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [showVolume])

  function handlePressStart() {
    longPressedRef.current = false
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
    pressTimerRef.current = setTimeout(() => {
      longPressedRef.current = true
      setShowVolume(true)
    }, 450)
  }

  function handlePressEnd() {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
    if (!longPressedRef.current) setMuted((m) => !m)
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
      ref={containerRef}
      className={[
        compact ? 'relative inline-flex' : 'fixed left-4 bottom-4 z-50',
        'select-none',
      ].join(' ')}
    >
      {showVolume && (
        <div className="absolute left-1/2 top-14 -translate-x-1/2 h-32 w-10 rounded-full bg-black/80 flex items-center justify-center py-3 shadow-lg">
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="h-24 w-24 -rotate-90 accent-white"
            aria-label="Volume da música"
          />
        </div>
      )}

      <button
        type="button"
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        className="w-11 h-11 rounded-full bg-black text-white flex items-center justify-center shadow-lg border border-white/10"
        aria-label={muted ? 'Ativar música' : 'Mutar música'}
        title="Clique para mutar. Segure para volume."
      >
        {muted || volume === 0 ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 9l5 5m0-5l-5 5M5 9v6h4l5 4V5L9 9H5z" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 9v6h4l5 4V5L9 9H5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9.5a4 4 0 010 5M19.5 7a7.5 7.5 0 010 10" />
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
