import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSiteTheme } from '@/shared/context/SiteThemeContext'
import { fireConfettiFrom } from '@/shared/utils/confetti'
import { getThemeConfettiColors } from '@/shared/utils/siteTheme'
import { playHeartClick, playMilestone } from '@/shared/utils/audioEffects'
import { playWinSound } from '@/shared/utils/spinWheelAudio'
import { CROP_ASPECT_RATIO } from '@/shared/constants/cropAspect'

interface HeartMark {
  id: string
  x: number
  y: number
  offset: number
}

interface Props {
  question: string
  imageUrl: string | null
  onComplete?: () => void
  previewMode?: boolean
}

const MAX_CLICKS = 10

const REVEAL_POINTS = [
  { percent: 0, visible: 0 },
  { percent: 25, visible: 10 },
  { percent: 50, visible: 28 },
  { percent: 75, visible: 45 },
  { percent: 100, visible: 100 },
]

function getVisiblePercent(percent: number) {
  for (let i = 1; i < REVEAL_POINTS.length; i += 1) {
    const previous = REVEAL_POINTS[i - 1]
    const next = REVEAL_POINTS[i]

    if (percent <= next.percent) {
      const progress = (percent - previous.percent) / (next.percent - previous.percent)
      return previous.visible + progress * (next.visible - previous.visible)
    }
  }

  return 100
}


export function MedidorAmorDisplay({ question, imageUrl, onComplete, previewMode = false }: Props) {
  const theme = useSiteTheme()
  const [clicks, setClicks] = useState(0)
  const [hearts, setHearts] = useState<HeartMark[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completedRef = useRef(false)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const percent = useMemo(
    () => Math.max(0, Math.min(100, Math.round((clicks / MAX_CLICKS) * 100))),
    [clicks],
  )
  const overlayOpacity = 1 - getVisiblePercent(percent) / 100
  const isComplete = percent >= 100

  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current)
      if (decayIntervalRef.current) clearInterval(decayIntervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
      if (!previewMode && imageContainerRef.current) {
        fireConfettiFrom(imageContainerRef.current, getThemeConfettiColors(theme))
      }
    }
  }, [isComplete, onComplete, previewMode, theme])

  function resetDecayTimer() {
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current)
    if (decayIntervalRef.current) clearInterval(decayIntervalRef.current)

    inactivityTimeoutRef.current = setTimeout(() => {
      decayIntervalRef.current = setInterval(() => {
        setClicks((prev) => {
          if (prev >= MAX_CLICKS) {
            if (decayIntervalRef.current) clearInterval(decayIntervalRef.current)
            return MAX_CLICKS
          }
          if (prev <= 0) {
            if (decayIntervalRef.current) clearInterval(decayIntervalRef.current)
            return 0
          }
          return prev - 1
        })
      }, 100)
    }, 5000)
  }

  function registerClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const offset = (Math.random() - 0.5) * 40

    if (!hasStarted) setHasStarted(true)
    if (!previewMode) playHeartClick()
    setClicks((prev) => {
      const next = Math.min(MAX_CLICKS, prev + 1)
      const prevPct = Math.round((prev / MAX_CLICKS) * 100)
      const nextPct = Math.round((next / MAX_CLICKS) * 100)
      if (!previewMode) {
        if (prevPct < 25 && nextPct >= 25) playMilestone(1)
        else if (prevPct < 50 && nextPct >= 50) playMilestone(2)
        else if (prevPct < 75 && nextPct >= 75) playMilestone(3)
        else if (nextPct >= 100) playWinSound()
      }
      return next
    })
    setHearts((prev) => [...prev, { id, x, y, offset }])

    window.setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 800)

    resetDecayTimer()
  }

  return (
    <div className="space-y-3">
      <p className="text-center text-base font-semibold text-gray-800">
        {question || 'O quanto você me ama?'}
      </p>

      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
          <motion.div
            className={isComplete ? 'h-full bg-green-500' : 'h-full'}
            style={isComplete ? undefined : { backgroundColor: theme.primary }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
        <p className={`text-xs text-center font-semibold ${isComplete ? 'text-green-600' : 'text-gray-500'}`}>
          {percent}%
        </p>
      </div>

      <div
        ref={imageContainerRef}
        className="relative w-full rounded-xl overflow-hidden bg-gray-100 cursor-pointer select-none touch-none"
        onClick={registerClick}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: 'none', aspectRatio: `${CROP_ASPECT_RATIO} / 1` }}
        role="button"
        aria-label="Clique várias vezes para revelar a imagem"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            className="w-full h-full object-cover block pointer-events-none select-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Adicione uma imagem para o medidor
          </div>
        )}

        <div
          className="absolute inset-0 bg-gray-600/70 backdrop-blur-xl pointer-events-none transition-opacity duration-200"
          style={{ opacity: overlayOpacity }}
          aria-hidden
        />

        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="absolute pointer-events-none animate-ping"
            style={{
              color: theme.primary,
              left: heart.x - 24 + heart.offset,
              top: heart.y - 24,
            }}
          >
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 21s-7.2-4.56-9.6-9A5.6 5.6 0 0112 5.4 5.6 5.6 0 0121.6 12C19.2 16.44 12 21 12 21z" />
            </svg>
          </span>
        ))}

        {!hasStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3">
            <span className="animate-finger-tap text-5xl select-none drop-shadow-md">👆</span>
            <p className="text-white text-xs font-semibold bg-black/45 px-3 py-1.5 rounded-full tracking-wide">
              Clique várias vezes para revelar!
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: [0.5, 1.12, 0.96, 1.04, 1], y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, scale: { type: 'spring', stiffness: 420, damping: 18 } }}
            className="relative overflow-hidden bg-green-50 border-2 border-green-400 rounded-2xl px-6 py-4 text-center shadow-lg"
          >
            <motion.div
              className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{ delay: 0.3, duration: 0.55, ease: 'easeInOut' }}
            />
            <p className="text-xs text-green-600 font-semibold uppercase tracking-widest mb-1">Amor no máximo!</p>
            <p className="text-lg font-extrabold text-green-700">Você revelou a surpresa 💚</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
