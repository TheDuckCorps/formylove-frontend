import { useEffect, useMemo, useRef, useState } from 'react'
import { RewardReveal } from './RewardReveal'

interface HeartMark {
  id: string
  x: number
  y: number
}

interface Props {
  question: string
  imageUrl: string | null
  onComplete?: () => void
  previewMode?: boolean
}

const MAX_CLICKS = 40

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
  const [clicks, setClicks] = useState(0)
  const [hearts, setHearts] = useState<HeartMark[]>([])
  const [hasStarted, setHasStarted] = useState(false)
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completedRef = useRef(false)

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
    }
  }, [isComplete, onComplete])

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

    if (!hasStarted) setHasStarted(true)
    setClicks((prev) => Math.min(MAX_CLICKS, prev + 1))
    setHearts((prev) => [...prev, { id, x, y }])

    window.setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 800)

    resetDecayTimer()
  }

  return (
    <div className="space-y-3">
      <RewardReveal
        active={isComplete}
        message="Amor no máximo!"
        subtitle="Você revelou a surpresa"
        previewMode={previewMode}
      />

      <p className="text-center text-base font-semibold text-gray-800">
        {question || 'O quanto você me ama?'}
      </p>

      <div className="space-y-2">
        <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-200"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center">{percent}%</p>
      </div>

      <div
        className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100 cursor-pointer select-none touch-none"
        onClick={registerClick}
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: 'none' }}
        role="button"
        aria-label="Clique várias vezes para revelar a imagem"
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
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
            className="absolute pointer-events-none text-brand animate-ping"
            style={{ left: heart.x - 10, top: heart.y - 10 }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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
    </div>
  )
}
