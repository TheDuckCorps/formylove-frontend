import { useState, useRef } from 'react'

interface Props {
  phrase?: string
  options: string[]
}

const COLORS = [
  '#C62A87', '#E91E8C', '#a855f7', '#db2777',
  '#8b5cf6', '#ec4899', '#7c3aed', '#f472b6',
]

const SIZE = 280
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

function textTransform(index: number, total: number): { x: number; y: number; rotation: number } {
  const midDeg = ((index + 0.5) / total) * 360 - 90
  const x = cx + TEXT_RADIUS * Math.cos(toRad(midDeg))
  const y = cy + TEXT_RADIUS * Math.sin(toRad(midDeg))
  return { x, y, rotation: midDeg + 90 }
}

function truncate(text: string, max = 11) {
  return text.length > max ? text.slice(0, max - 1) + '…' : text
}

export function SpinWheelDisplay({ phrase, options }: Props) {
  const [rotation, setRotation] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const winnerRef = useRef<string | null>(null)

  const n = options.length
  const segmentAngle = 360 / n

  function handleSpin() {
    if (spinning || n === 0) return
    setWinner(null)
    setSpinning(true)

    const winnerIndex = Math.floor(Math.random() * n)
    winnerRef.current = options[winnerIndex]

    // Target: after rotation, pointer (top) points to center of winnerIndex segment.
    // After rotation R (clockwise), top sees wheel angle: (360 - R%360 + 360)%360
    // We want that angle = winnerIndex * segmentAngle + segmentAngle/2
    const targetAngle = (360 - (winnerIndex * segmentAngle + segmentAngle / 2 - 360)) % 360
    const currentNorm = ((rotation % 360) + 360) % 360
    let delta = targetAngle - currentNorm
    if (delta <= 0) delta += 360

    setRotation(rotation + 5 * 360 + delta)
  }

  function handleTransitionEnd() {
    setSpinning(false)
    setWinner(winnerRef.current)
  }

  return (
    <div className="flex flex-col items-center gap-5 py-4 select-none">
      {phrase && (
        <p className="text-lg font-bold text-gray-800 text-center px-4">{phrase}</p>
      )}

      {/* Wheel + pointer */}
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

        {/* Wheel */}
        <div
          className="rounded-full shadow-lg overflow-hidden"
          style={{
            width: SIZE,
            height: SIZE,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {options.map((opt, i) => {
              const { x, y, rotation: rot } = textTransform(i, n)
              return (
                <g key={i}>
                  <path d={segmentPath(i, n)} fill={COLORS[i % COLORS.length]} />
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
            {/* Separator lines */}
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
            {/* Center hub */}
            <circle cx={cx} cy={cy} r={18} fill="white" />
            <circle cx={cx} cy={cy} r={14} fill="#C62A87" />
          </svg>
        </div>
      </div>

      {/* Spin button */}
      <button
        onClick={handleSpin}
        disabled={spinning}
        className="px-10 py-3 rounded-full font-bold text-white text-base shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
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

      {/* Winner banner */}
      {winner && !spinning && (
        <div className="animate-fade-in bg-brand/10 border border-brand/30 rounded-2xl px-8 py-4 text-center w-full max-w-xs">
          <p className="text-xs text-brand font-semibold uppercase tracking-widest mb-1">Resultado</p>
          <p className="text-xl font-bold text-gray-800">{winner}</p>
        </div>
      )}
    </div>
  )
}
