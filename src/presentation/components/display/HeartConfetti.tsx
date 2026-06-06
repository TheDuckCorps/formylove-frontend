interface Props {
  active?: boolean
  count?: number
}

const COLORS = ['#C62A87', '#E91E8C', '#F472B6', '#A855F7', '#FB7185']

function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 999) * 10000
  return x - Math.floor(x)
}

export function HeartConfetti({ active = true, count = 350 }: Props) {
  if (!active) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[80] overflow-hidden" aria-hidden>
      <style>{`
        @keyframes heart-confetti-fall {
          0% { transform: translate3d(0, -15vh, 0) rotate(0deg) scale(0.7); opacity: 0; }
          8% { opacity: 1; }
          100% { transform: translate3d(var(--heart-drift), 115vh, 0) rotate(720deg) scale(1.15); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: count }).map((_, index) => {
        const left = pseudoRandom(index + 1) * 100
        const delay = pseudoRandom(index + 11) * 1.8
        const duration = 2.8 + pseudoRandom(index + 21) * 2.6
        const size = 12 + pseudoRandom(index + 31) * 18
        const drift = `${(pseudoRandom(index + 41) - 0.5) * 160}px`
        const color = COLORS[index % COLORS.length]

        return (
          <svg
            key={index}
            viewBox="0 0 24 24"
            fill={color}
            className="absolute top-0"
            style={{
              left: `${left}%`,
              width: size,
              height: size,
              animation: `heart-confetti-fall ${duration}s linear ${delay}s forwards`,
              ['--heart-drift' as string]: drift,
            }}
          >
            <path d="M12 21s-7.2-4.56-9.6-9A5.6 5.6 0 0112 5.4 5.6 5.6 0 0121.6 12C19.2 16.44 12 21 12 21z" />
          </svg>
        )
      })}
    </div>
  )
}
