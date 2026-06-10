import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import confettiLib from 'canvas-confetti'
import { useSiteTheme } from '@/shared/context/SiteThemeContext'
import { getThemeConfettiColors } from '@/shared/utils/siteTheme'
import { playWinSound } from '@/shared/utils/spinWheelAudio'

export function PresentEndScreen() {
  const theme = useSiteTheme()
  const firedRef = useRef(false)

  useEffect(() => {
    if (firedRef.current) return
    firedRef.current = true

    const colors = getThemeConfettiColors(theme)
    const base = { origin: { x: 0.5, y: 0.45 }, colors, disableForReducedMotion: true }

    playWinSound()
    confettiLib({ ...base, particleCount: 60, spread: 55, startVelocity: 28, scalar: 0.9 })
    setTimeout(
      () => confettiLib({ ...base, particleCount: 40, spread: 80, startVelocity: 20, scalar: 0.75 }),
      180,
    )
  }, [theme])

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center min-h-[50vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center text-center gap-5 flex-1 justify-center py-8"
      >
        <motion.svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-14 h-14 drop-shadow-sm"
          style={{ color: theme.primary }}
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden
        >
          <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
        </motion.svg>

        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-800 leading-snug">
            Este presente chegou ao fim
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
            Esperamos que a experiência tenha sido tão incrível quanto você é!
          </p>
        </div>
      </motion.div>
    </div>
  )
}
