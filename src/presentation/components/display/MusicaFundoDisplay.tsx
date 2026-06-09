import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

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
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [showVolume, setShowVolume] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasUserInteracted = useRef(false)

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
    function handleMessage(e: MessageEvent) {
      if (!e.data) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data.event === 'onReady') {
          setPlayerReady(true)
        }
        // Sync playing state from YouTube's own events (desktop autoplay)
        if (data.event === 'onStateChange') {
          if (data.info === 1) setPlaying(true)
          if (data.info === 2) setPlaying(false)
        }
      } catch {
        // ignore non-JSON messages
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Only send play/pause after the user has interacted at least once
  useEffect(() => {
    if (!playerReady || !hasUserInteracted.current) return
    postToPlayer(playing ? 'playVideo' : 'pauseVideo')
  }, [playing, playerReady])

  useEffect(() => {
    if (!playerReady) return
    postToPlayer('setVolume', [volume])
  }, [volume, playerReady])

  function scheduleHideVolume() {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setShowVolume(false), 3000)
  }

  function handleToggle() {
    hasUserInteracted.current = true
    const next = !playing
    setPlaying(next)
    // Direct call in click handler so mobile browsers treat it as a user gesture
    postToPlayer(next ? 'playVideo' : 'pauseVideo')
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

  const playPauseButton = (
    <button
      type="button"
      onClick={handleToggle}
      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full"
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

  if (compact) {
    return (
      <div className="relative inline-flex flex-col items-center select-none gap-2">
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

  return (
    <>
      <motion.div
        initial={{ y: -72, opacity: 0, scale: 0.92 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24, delay: 0.4 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 select-none"
      >
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-white/60">
          <svg
            className="w-4 h-4 text-brand flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
          </svg>

          <span className="text-sm font-medium text-gray-700 leading-none">
            {playing ? 'Tocando' : 'Música'}
          </span>

          {playPauseButton}

          <motion.div
            initial={false}
            animate={{ width: showVolume ? 28 : 0, opacity: showVolume ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="overflow-hidden flex items-center justify-center"
          >
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
                height: '64px',
                width: '6px',
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {playerUrl ? (
        <iframe
          ref={iframeRef}
          title="Música de fundo"
          src={playerUrl}
          className="w-0 h-0 opacity-0 pointer-events-none fixed"
          allow="autoplay; encrypted-media"
        />
      ) : null}
    </>
  )
}
