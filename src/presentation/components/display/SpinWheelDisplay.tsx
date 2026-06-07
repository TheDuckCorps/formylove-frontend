import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { startWheelSpin, playWinSound } from '@/shared/utils/spinWheelAudio'
import { fireConfettiFrom } from '@/shared/utils/confetti'

interface Props {
  phrase?: string
  options: string[]
  onComplete?: () => void
  previewMode?: boolean
}

const COLORS = [
  '#C62A87', '#E91E8C', '#a855f7', '#db2777',
  '#8b5cf6', '#ec4899', '#7c3aed', '#f472b6',
]

const WINNER_COLOR = '#16a34a'
const SPIN_DURATION_MS = 4000

const SIZE = 320
const cx = SIZE / 2
const cy = SIZE / 2
const RADIUS = SIZE / 2 - 6
const TEXT_RADIUS = RADIUS * 0.62

function toRad(deg: number) { return (deg * Math.PI) / 180 }

function segmentPath(index: number, total: number): string {
  const startDeg = (index / total) * 360 - 90
  const endDeg = ((index + 1) / total) * 360 - 90
  const x1 = cx + RADIUS * Math.cos(toRad(startDeg))
  const y1 = cy + RADIUS * Math.sin(toRad(startDeg))
  const x2 = cx + RADIUS * Math.cos(toRad(endDeg))
  const y2 = cy + RADIUS * Math.sin(toRad(endDeg))
  const largeArc = 360 / total > 180 ? 1 : 0
  return `M ${cx} ${cy} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${x2} ${y2} Z`
}

function textTransform(index: number, total: number) {
  const midDeg = ((index + 0.5) / total) * 360 - 90
  const x = cx + TEXT_RADIUS * Math.cos(toRad(midDeg))
  const y = cy + TEXT_RADIUS * Math.sin(toRad(midDeg))
  return { x, y, rotation: midDeg + 90 }
}

function truncate(text: string, max = 11) {
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}


export function SpinWheelDisplay({ phrase, options, onComplete, previewMode = false }: Props) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const winnerIndexRef = useRef<number | null>(null)
  const completedRef = useRef(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const stopSpinAudioRef = useRef<(() => void) | null>(null)
  const vibrateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const n = options.length
  const segmentAngle = 360 / n

  const handleSpin = useCallback(() => {
    if (spinning || n === 0) return
    setWinnerIndex(null)
    setShowResult(false)
    setSpinning(true)

    const idx = Math.floor(Math.random() * n)
    winnerIndexRef.current = idx

    const targetAngle = (360 - (idx * segmentAngle + segmentAngle / 2 - 360)) % 360
    const currentNorm = ((rotation % 360) + 360) % 360
    let delta = targetAngle - currentNorm
    if (delta <= 0) delta += 360

    setRotation((r) => r + 5 * 360 + delta)

    if (!previewMode) {
      stopSpinAudioRef.current = startWheelSpin(SPIN_DURATION_MS, n)

      // Periodic vibration during spin — starts dense, becomes sparse (mirrors tick deceleration)
      if ('vibrate' in navigator) {
        let elapsed = 0
        let interval = 120
        const tick = () => {
          navigator.vibrate(12)
          elapsed += interval
          interval = Math.min(interval * 1.12, 500)
          if (elapsed < SPIN_DURATION_MS) {
            vibrateIntervalRef.current = setTimeout(tick, interval)
          }
        }
        vibrateIntervalRef.current = setTimeout(tick, interval)
      }
    }
  }, [spinning, n, segmentAngle, rotation, previewMode])

  function handleTransitionEnd() {
    stopSpinAudioRef.current?.()
    stopSpinAudioRef.current = null

    if (vibrateIntervalRef.current) {
      clearTimeout(vibrateIntervalRef.current)
      vibrateIntervalRef.current = null
    }

    const idx = winnerIndexRef.current
    setSpinning(false)
    setWinnerIndex(idx)

    // Strong win vibration: two punchy pulses
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([80, 60, 140])
    }

    if (!previewMode && wheelRef.current) {
      fireConfettiFrom(wheelRef.current)
      playWinSound()
    }

    setTimeout(() => setShowResult(true), 180)

    if (!completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }

  useEffect(() => {
    if (spinning) setShowResult(false)
  }, [spinning])

  // Cleanup audio + vibration intervals on unmount
  useEffect(() => {
    return () => {
      stopSpinAudioRef.current?.()
      if (vibrateIntervalRef.current) clearTimeout(vibrateIntervalRef.current)
    }
  }, [])

  const winner = winnerIndex !== null ? options[winnerIndex] : null
  const winPath = winnerIndex !== null ? segmentPath(winnerIndex, n) : null

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none">
      {phrase && (
        <p className="text-lg font-bold text-gray-800 text-center px-4">{phrase}</p>
      )}

      <div className="lg:scale-125 lg:my-8 transition-transform" ref={wheelRef}>
      <div className="relative flex items-center justify-center">
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 z-10 -translate-x-1/2"
          style={{ marginTop: '-2px' }}
        >
          <svg width="22" height="32" viewBox="0 0 22 32">
            <polygon points="11,32 0,0 22,0" fill="#C62A87" />
            <polygon points="11,32 0,0 22,0" fill="none" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>

        <div
          className="rounded-full shadow-lg overflow-hidden"
          style={{
            width: SIZE,
            height: SIZE,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            <defs>
              {/* Glow filter applied to winner segment */}
              <filter id="winner-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {options.map((opt, i) => {
              const { x, y, rotation: rot } = textTransform(i, n)
              const isWinner = !spinning && winnerIndex === i
              const fill = isWinner ? WINNER_COLOR : COLORS[i % COLORS.length]
              return (
                <g key={i} filter={isWinner ? 'url(#winner-glow)' : undefined}>
                  <path d={segmentPath(i, n)} fill={fill} />
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${rot},${x},${y})`}
                    fontSize={n <= 4 ? '13' : '11'}
                    fontWeight="700"
                    fill="white"
                  >
                    {truncate(opt, n <= 4 ? 14 : 10)}
                  </text>
                </g>
              )
            })}

            {options.map((_, i) => {
              const angleDeg = (i / n) * 360 - 90
              const x2 = cx + RADIUS * Math.cos(toRad(angleDeg))
              const y2 = cy + RADIUS * Math.sin(toRad(angleDeg))
              return (
                <line
                  key={`sep-${i}`}
                  x1={cx} y1={cy} x2={x2} y2={y2}
                  stroke="white" strokeWidth="1.5" opacity="0.5"
                />
              )
            })}

            <circle cx={cx} cy={cy} r={18} fill="white" />
            <circle cx={cx} cy={cy} r={14} fill="#C62A87" />
          </svg>
        </div>

        {/* Winner shimmer overlay — sits on top of the stopped wheel */}
        {winPath && !spinning && (
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="absolute inset-0 pointer-events-none rounded-full overflow-hidden"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <motion.path
              d={winPath}
              fill="white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.38, 0, 0.25, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        )}
      </div>
      </div>

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="px-10 py-3 rounded-full font-bold text-white text-base shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        style={{ background: 'linear-gradient(135deg, #C62A87, #E91E8C)' }}
      >
        {spinning ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Girando…
          </span>
        ) : winner ? 'Girar novamente' : 'Girar!'}
      </button>

      <AnimatePresence mode="wait">
        {winner && showResult && (
          <motion.div
            key={winner}
            initial={{ opacity: 0, scale: 0.4, y: 16 }}
            animate={{
              opacity: 1,
              scale: [0.4, 1.22, 0.94, 1.06, 1],
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.8, y: 8, transition: { duration: 0.2 } }}
            transition={{
              duration: 0.55,
              ease: 'easeOut',
              scale: { type: 'spring', stiffness: 420, damping: 18 },
            }}
            className="relative overflow-hidden bg-green-50 border-2 border-green-400 rounded-2xl px-8 py-4 text-center w-full max-w-xs shadow-lg"
          >
            {/* shimmer sweep */}
            <motion.div
              className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{ delay: 0.3, duration: 0.55, ease: 'easeInOut' }}
            />
            <motion.p
              className="text-xs text-green-600 font-semibold uppercase tracking-widest mb-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              Resultado
            </motion.p>
            <motion.p
              className="text-2xl font-extrabold text-green-700"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            >
              {winner}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
