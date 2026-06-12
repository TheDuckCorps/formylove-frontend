import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion'
import { useSiteTheme } from '@/shared/context/SiteThemeContext'

interface Props {
  youtubeUrl: string
  compact?: boolean
  /** Renders inside a relative parent instead of fixed viewport overlay (preview mockup). */
  embedded?: boolean
}

function getYoutubeVideoId(url: string): string | null {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '') || null
    }
    if (parsed.pathname.includes('/shorts/')) {
      return parsed.pathname.split('/shorts/')[1]?.split('/')[0] || null
    }
    return parsed.searchParams.get('v')
  } catch {
    return null
  }
}

const PAD = 16
const IFRAME_ID = 'music-background-player'

export function MusicaFundoDisplay({ youtubeUrl, compact = false, embedded = false }: Props) {
  const theme = useSiteTheme()

  /* ── audio state ─────────────────────────────────────────────── */
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(50)
  const [playerReady, setPlayerReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hasUserInteracted = useRef(false)
  const volumeRef = useRef(volume)
  const playingRef = useRef(playing)
  const introCompleteRef = useRef(false)

  /* ── UI / drag state ─────────────────────────────────────────── */
  // 'text'  → intro pill with "Música" label visible
  // 'idle'  → collapsed to icon only; expands on hover
  const [introPhase, setIntroPhase] = useState<'text' | 'idle'>(compact ? 'idle' : 'text')
  const [introComplete, setIntroComplete] = useState(compact)
  const [expanded, setExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)

  // absolute position from top-left (populated after mount so SSR is safe)
  const posX = useMotionValue(0)
  const posY = useMotionValue(0)

  // default: top-left so it's visible immediately on page load
  useEffect(() => {
    posX.set(PAD)
    posY.set(PAD)
    setMounted(true)
  }, [posX, posY])

  // intro: show label, then collapse to icon after 2.2 s
  useEffect(() => {
    if (compact) return
    const t = setTimeout(() => setIntroPhase('idle'), 2200)
    return () => clearTimeout(t)
  }, [compact])

  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  useEffect(() => {
    playingRef.current = playing
  }, [playing])

  useEffect(() => {
    introCompleteRef.current = introComplete
  }, [introComplete])

  useEffect(() => {
    if (compact) introCompleteRef.current = true
  }, [compact])

  const iframeId = embedded ? 'music-background-player-preview' : IFRAME_ID

  /* ── youtube iframe api ───────────────────────────────────────── */
  const videoId = useMemo(() => getYoutubeVideoId(youtubeUrl), [youtubeUrl])

  const playerUrl = useMemo(() => {
    if (!videoId) return null
    const params = new URLSearchParams({
      enablejsapi: '1',
      widgetid: iframeId,
      autoplay: '0',
      loop: '1',
      playlist: videoId,
      controls: '0',
      disablekb: '1',
      fs: '0',
      iv_load_policy: '3',
      modestbranding: '1',
      rel: '0',
      playsinline: '1',
    })
    if (typeof window !== 'undefined') {
      params.set('origin', window.location.origin)
    }
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
  }, [videoId, iframeId])

  const YOUTUBE_ORIGINS = new Set([
    'https://www.youtube.com',
    'https://youtube.com',
    'https://youtu.be',
  ])

  function postToPlayer(command: string, args: unknown[] = []) {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args }),
      'https://www.youtube.com',
    )
  }

  function startPlayerListening() {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: iframeId, channel: 'widget' }),
      'https://www.youtube.com',
    )
  }

  function syncPlayerCommands() {
    postToPlayer('setVolume', [volumeRef.current])
    if (hasUserInteracted.current) {
      postToPlayer(playingRef.current ? 'playVideo' : 'pauseVideo')
    }
  }

  function handleIframeLoad() {
    startPlayerListening()
    window.setTimeout(() => {
      startPlayerListening()
      syncPlayerCommands()
    }, 300)
  }

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (!YOUTUBE_ORIGINS.has(e.origin)) return
      if (!e.data) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data.event === 'onReady' || data.event === 'initialDelivery') {
          setPlayerReady(true)
          postToPlayer('setVolume', [volumeRef.current])
        }
        if (data.event === 'onStateChange') {
          if (data.info === 1) {
            if (!introCompleteRef.current) {
              postToPlayer('pauseVideo')
              return
            }
            hasUserInteracted.current = true
            setPlaying(true)
          }
          if (data.info === 2) setPlaying(false)
        }
      } catch {
        // ignore non-JSON messages
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  useEffect(() => {
    if (!playerReady || !hasUserInteracted.current) return
    postToPlayer(playing ? 'playVideo' : 'pauseVideo')
  }, [playing, playerReady])

  useEffect(() => {
    if (!playerReady) return
    postToPlayer('setVolume', [volume])
  }, [volume, playerReady])

  /* ── drag → snap to nearest corner ──────────────────────────── */
  function snapToNearestCorner() {
    const el = dragRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const W = window.innerWidth
    const H = window.innerHeight
    const targetX = cx > W / 2 ? W - PAD - rect.width : PAD
    const targetY = cy > H / 2 ? H - PAD - rect.height : PAD
    animate(posX, targetX, { type: 'spring', stiffness: 500, damping: 42 })
    animate(posY, targetY, { type: 'spring', stiffness: 500, damping: 42 })
  }

  /* ── controls ────────────────────────────────────────────────── */
  function startPlaybackFromUserGesture() {
    if (!introComplete) return
    hasUserInteracted.current = true
    postToPlayer('setVolume', [volumeRef.current])
    postToPlayer('playVideo')
    setPlaying(true)
  }

  function handleToggle() {
    if (!introComplete) return
    hasUserInteracted.current = true
    if (playing) {
      setPlaying(false)
      postToPlayer('pauseVideo')
    } else {
      startPlaybackFromUserGesture()
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!introComplete) return
    const next = Number(e.target.value)
    setVolume(next)
    volumeRef.current = next
    postToPlayer('setVolume', [next])
  }

  /* ── compact mode (used in previews) ─────────────────────────── */
  if (compact) {
    return (
      <div className="relative inline-flex flex-col items-center select-none gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-[var(--site-primary)] transition focus-visible:outline-none focus-visible:ring-2 rounded-full"
          style={{ outlineColor: theme.primary }}
          aria-label={playing ? 'Pausar música' : 'Retomar música'}
        >
          {playing ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          )}
        </button>
        {playerUrl ? (
          <iframe
            id={iframeId}
            ref={iframeRef}
            title="Música de fundo"
            src={playerUrl}
            onLoad={handleIframeLoad}
            className="w-0 h-0 opacity-0 pointer-events-none absolute"
            allow="autoplay; encrypted-media"
          />
        ) : null}
      </div>
    )
  }

  if (!youtubeUrl || !mounted) return null

  const MusicIcon = (
    <motion.svg
      className="w-5 h-5 flex-shrink-0"
      fill="currentColor"
      style={{ color: theme.primary }}
      viewBox="0 0 24 24"
      aria-hidden
      animate={playing ? { rotate: [0, 12, -12, 0] } : { rotate: 0 }}
      transition={playing ? { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } : {}}
    >
      <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
    </motion.svg>
  )

  return (
    <>
      <motion.div
        ref={dragRef}
        drag={introComplete}
        dragMomentum={false}
        dragElastic={0.06}
        onDragEnd={snapToNearestCorner}
        style={{
          position: embedded ? 'absolute' : 'fixed',
          top: 0,
          left: 0,
          x: posX,
          y: posY,
          zIndex: 50,
        }}
        whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
        className={[
          'select-none touch-none',
          introComplete ? 'cursor-grab' : 'cursor-default pointer-events-none',
        ].join(' ')}
        data-testid="music-pill"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.3 }}
      >
        <div
          className="flex items-center rounded-full bg-white/85 backdrop-blur-md shadow-lg border px-4 gap-0 overflow-hidden h-12"
          style={{ borderColor: theme.borderSoft, boxShadow: theme.buttonShadow }}
          onMouseEnter={() => introComplete && setExpanded(true)}
          onMouseLeave={() => setExpanded(false)}
          onPointerUp={(e) => {
            if (!introComplete) return
            // toggle only for touch — desktop expansion is handled by hover
            if (e.pointerType !== 'touch') return
            if ((e.target as HTMLElement).closest('[data-testid="music-controls"]')) return
            setExpanded(v => !v)
          }}
        >
          {/* Music icon — always visible, same height as controls button */}
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            {MusicIcon}
          </div>

          {/* ── intro label "Música" ── */}
          <AnimatePresence onExitComplete={() => setIntroComplete(true)}>
            {introPhase === 'text' && (
              <motion.span
                key="label"
                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                animate={{ width: 'auto', opacity: 1, marginLeft: 10 }}
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className="text-base font-semibold text-gray-700 whitespace-nowrap overflow-hidden leading-none"
              >
                Música
              </motion.span>
            )}
          </AnimatePresence>

          {/* ── controls (hover / click after intro) ── */}
          <AnimatePresence>
            {expanded && introComplete && (
              <motion.div
                key="controls"
                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                animate={{ width: 'auto', opacity: 1, marginLeft: 10 }}
                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                data-testid="music-controls"
                className="flex items-center gap-2 overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                {/* play / pause */}
                <button
                  type="button"
                  onClick={handleToggle}
                  data-testid="music-play-btn"
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-[var(--site-primary)] transition rounded-full focus-visible:outline-none focus-visible:ring-2 flex-shrink-0"
                  style={{ outlineColor: theme.primary }}
                  aria-label={playing ? 'Pausar música' : 'Retomar música'}
                >
                  {playing ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="5" width="4" height="14" rx="1" />
                      <rect x="14" y="5" width="4" height="14" rx="1" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  )}
                </button>

                {/* volume — horizontal slider */}
                <div className="flex items-center overflow-hidden flex-shrink-0 w-20">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleVolumeChange}
                    aria-label="Volume da música"
                    className="cursor-pointer w-full"
                    style={{ accentColor: theme.primary }}
                    onPointerDown={e => e.stopPropagation()}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {playerUrl ? (
        <iframe
          id={iframeId}
          ref={iframeRef}
          title="Música de fundo"
          src={playerUrl}
          onLoad={handleIframeLoad}
          className={[
            'w-0 h-0 opacity-0 pointer-events-none',
            embedded ? 'absolute' : 'fixed',
          ].join(' ')}
          allow="autoplay; encrypted-media"
        />
      ) : null}
    </>
  )
}
