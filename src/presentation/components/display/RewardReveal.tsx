import { useEffect, useState } from 'react'
import { HeartConfetti } from './HeartConfetti'

interface Props {
  active: boolean
  message?: string
  subtitle?: string
  previewMode?: boolean
}

export function RewardReveal({
  active,
  message = 'Você conseguiu!',
  subtitle,
  previewMode = false,
}: Props) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (active) setDismissed(false)
  }, [active])

  useEffect(() => {
    if (!active || previewMode || dismissed) return
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([40, 30, 60])
    }
  }, [active, previewMode, dismissed])

  if (!active || dismissed) return null

  if (previewMode) {
    return (
      <div
        className="w-full text-center py-2 px-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-700 font-semibold animate-fade-in"
        role="status"
        aria-live="polite"
      >
        {message}
        {subtitle ? <span className="block text-xs font-normal text-green-600 mt-0.5">{subtitle}</span> : null}
      </div>
    )
  }

  return (
    <>
      <HeartConfetti active />
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center px-6 pointer-events-none"
        aria-live="polite"
      >
        <div className="relative bg-white/95 backdrop-blur-sm border-2 border-brand/30 rounded-2xl px-8 py-6 text-center shadow-modal animate-fade-in max-w-xs w-full pointer-events-auto">
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="absolute top-2 left-2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
            aria-label="Fechar"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="text-4xl mb-2 animate-bounce pt-2" aria-hidden>
            🎉
          </div>
          <p className="text-lg font-bold text-brand">{message}</p>
          {subtitle ? (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          ) : null}
        </div>
      </div>
    </>
  )
}
