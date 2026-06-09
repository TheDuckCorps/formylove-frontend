import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion'

interface Props {
  youtubeUrl: string
  compact?: boolean
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

export function MusicaFundoDisplay({ youtubeUrl, compact = false }: Props) {
  /* ── audio state ─────────────────────────────────────────────── */
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(70)
  const [showVolume, setShowVolume] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hasUserInteracted = useRef(false)

  /* ── UI / drag state ─────────────────────────────────────────── */
  // 'text'  → intro pill with "Música" label visible
  // 'idle'  → collapsed to icon only; expands on hover
  const [introPhase, setIntroPhase] = useState<'text' | 'idle'>('text')
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
    const t = setTimeout(() => setIntroPhase('idle'), 2200)
    return () => clearTimeout(t)
  }, [])

  /* ── youtube iframe api ───────────────────────────────────────── */
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
      if (e.origin !== 'https://www.youtube.com') return
      if (!e.data) return
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
        if (data.event === 'onReady') setPlayerReady(true)
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

  // On player ready: attempt autoplay and optimistically mark as playing.
  // We set playing=true here because onStateChange(info=1) is unreliable when
  // autoplay=1 starts the video before the postMessage listener is ready.
  // If the browser actually blocks autoplay, onStateChange(info=2) will fire
  // and correct the state back to false.
  // hasUserInteracted stays false so the sync effect below won't race with this.
  useEffect(() => {
    if (!playerReady) return
    postToPlayer('playVideo')
    postToPlayer('setVolume', [volume])
    setPlaying(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerReady])

  // Sync play/pause ONLY after an explicit widget interaction.
  // hasUserInteracted guards this so it never races with the onReady effect above.
  useEffect(() => {
    if (!playerReady || !hasUserInteracted.current) return
    postToPlayer(playing ? 'playVideo' : 'pauseVideo')
  }, [playing, playerReady])

  useEffect(() => {
    if (!playerReady) return
    postToPlayer('setVolume', [volume])
  }, [volume, playerReady])

  // Mobile: browser blocks autoplay without user gesture — start on first touch anywhere.
  useEffect(() => {
    if (!playerReady) return
    function onFirstTouch() {
      hasUserInteracted.current = true
      postToPlayer('playVideo')
      setPlaying(true)
    }
    document.addEventListener('touchstart', onFirstTouch, { once: true, passive: true })
    return () => document.removeEventListener('touchstart', onFirstTouch)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerReady])

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

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
  function scheduleHideVolume() {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => setShowVolume(false), 3000)
  }

  function handleToggle() {
    hasUserInteracted.current = true
    const next = !playing
    setPlaying(next)
    postToPlayer(next ? 'playVideo' : 'pauseVideo')
    setShowVolume(true)
    scheduleHideVolume()
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVolume(Number(e.target.value))
    setShowVolume(true)
    scheduleHideVolume()
  }

  /* ── compact mode (used in previews) ─────────────────────────── */
  if (compact) {
    return (
      <div className="relative inline-flex flex-col items-center select-none gap-2">
        <button
          type="button"
          onClick={() => {
            hasUserInteracted.current = true
            const next = !playing
            setPlaying(next)
            postToPlayer(next ? 'playVideo' : 'pauseVideo')
          }}
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-full"
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

  if (!youtubeUrl || !mounted) return null

  const MusicIcon = (
    <motion.svg
      className="w-5 h-5 text-brand flex-shrink-0"
      fill="currentColor"
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
        drag
        dragMomentum={false}
        dragElastic={0.06}
        onDragEnd={snapToNearestCorner}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          x: posX,
          y: posY,
          zIndex: 50,
        }}
        whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
        className="select-none touch-none cursor-grab"
        data-testid="music-pill"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 24, delay: 0.3 }}
      >
        <div
          className="flex items-center rounded-full bg-white/85 backdrop-blur-md shadow-lg border border-white/60 px-4 gap-0 overflow-hidden h-12"
          onMouseEnter={() => introPhase === 'idle' && setExpanded(true)}
          onMouseLeave={() => { setExpanded(false); setShowVolume(false) }}
          onPointerUp={(e) => {
            // toggle only for touch — desktop expansion is handled by hover
            if (e.pointerType !== 'touch') return
            if ((e.target as HTMLElement).closest('[data-testid="music-controls"]')) return
            if (introPhase === 'idle') setExpanded(v => !v)
          }}
        >
          {/* Music icon — always visible, same height as controls button */}
          <div className="w-9 h-9 flex items-center justify-center flex-shrink-0">
            {MusicIcon}
          </div>

          {/* ── intro label "Música" ── */}
          <AnimatePresence>
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
            {expanded && introPhase === 'idle' && (
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
                  className="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-brand transition rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand flex-shrink-0"
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
                <AnimatePresence>
                  {showVolume && (
                    <motion.div
                      key="volume"
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 80, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      className="flex items-center overflow-hidden flex-shrink-0"
                    >
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={volume}
                        onChange={handleVolumeChange}
                        aria-label="Volume da música"
                        className="accent-brand cursor-pointer w-full"
                        // Stop the pointer event from bubbling to the framer-motion
                        // drag handler on the parent widget — otherwise dragging the
                        // slider is treated as dragging the entire widget and the
                        // slider's onChange never fires.
                        onPointerDown={e => e.stopPropagation()}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
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
