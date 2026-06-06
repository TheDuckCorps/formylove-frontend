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
  const [volume, setVolume] = useState(70)
  const [showVolume, setShowVolume] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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

  useEffect(() => {
    postToPlayer('setVolume', [volume])
  }, [volume])

  function scheduleHideVolume() {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setShowVolume(false), 3000)
  }

  function handleToggle() {
    setPlaying((p) => !p)
    if (!compact) {
      setShowVolume(true)
      scheduleHideVolume()
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(Number(e.target.value))
    setShowVolume(true)
    scheduleHideVolume()
  }

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  if (!youtubeUrl) {
    return (
      <div className="text-xs text-gray-400 text-center">
        Música de fundo não definida.
      </div>
    )
  }

  const positionClass = compact
    ? 'relative inline-flex flex-col items-center'
    : 'fixed left-4 top-4 z-50 flex flex-col items-center'

  const playPauseButton = (
    <button
      type="button"
      onClick={handleToggle}
      className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full"
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
  )

  return (
    <div className={[positionClass, 'select-none gap-2'].join(' ')}>
      {!compact && showVolume && (
        <div className="flex flex-col items-center gap-2 animate-fade-in py-1">
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Volume da música"
            className="accent-brand cursor-pointer"
            style={{
              writingMode: 'vertical-lr',
              direction: 'rtl',
              height: '100px',
              width: '6px',
            }}
          />
          <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </div>
      )}

      {playPauseButton}

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
}
