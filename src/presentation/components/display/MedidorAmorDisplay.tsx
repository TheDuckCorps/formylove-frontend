import { useEffect, useMemo, useRef, useState } from 'react'
import { HeartConfetti } from './HeartConfetti'

interface HeartMark {
  id: string
  x: number
  y: number
}

interface Props {
  question: string
  imageUrl: string | null
}

const MAX_CLICKS = 40

const REVEAL_POINTS = [
  { percent: 0, visible: 0 },
  { percent: 25, visible: 15 },
  { percent: 50, visible: 40 },
  { percent: 75, visible: 60 },
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

export function MedidorAmorDisplay({ question, imageUrl }: Props) {
  const [clicks, setClicks] = useState(0)
  const [hearts, setHearts] = useState<HeartMark[]>([])
  const inactivityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const decayIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const percent = useMemo(
    () => Math.max(0, Math.min(100, Math.round((clicks / MAX_CLICKS) * 100))),
    [clicks],
  )
  const overlayOpacity = 1 - getVisiblePercent(percent) / 100

  useEffect(() => {
    return () => {
      if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current)
      if (decayIntervalRef.current) clearInterval(decayIntervalRef.current)
    }
  }, [])

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

    setClicks((prev) => Math.min(MAX_CLICKS, prev + 1))
    setHearts((prev) => [...prev, { id, x, y }])

    window.setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 800)

    resetDecayTimer()
  }

  return (
    <div className="space-y-3">
      <HeartConfetti active={percent >= 100} />

      <p className="text-center text-sm font-semibold text-gray-800">
        {question || 'O quanto você me ama?'}
      </p>

      <div className="space-y-2">
        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full bg-brand transition-all duration-200"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 text-center">{percent}%</p>
      </div>

      <div
        className="relative w-full h-56 rounded-xl overflow-hidden bg-gray-100 cursor-pointer select-none"
        onClick={registerClick}
      >
        {imageUrl ? (
          <img src={imageUrl} alt="Imagem do medidor" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Adicione uma imagem para o medidor
          </div>
        )}

        <div
          className="absolute inset-0 bg-gray-500 pointer-events-none transition-opacity duration-200"
          style={{ opacity: overlayOpacity }}
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
      </div>
    </div>
  )
}
