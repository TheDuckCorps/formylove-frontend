interface Props {
  tone?: 'mockup' | 'light'
  className?: string
}

export function MediaLoaderOverlay({ tone = 'mockup', className = '' }: Props) {
  const bgClass =
    tone === 'light'
      ? 'bg-gradient-to-br from-pink-50 via-white to-purple-50'
      : 'bg-gradient-to-b from-purple-800/95 to-purple-500/95'

  const spinnerClass = tone === 'light' ? 'text-brand/80' : 'text-white/90'

  return (
    <div
      className={[
        'absolute inset-0 z-[1] flex items-center justify-center',
        bgClass,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden
    >
      <svg
        className={['w-8 h-8 animate-spin', spinnerClass].join(' ')}
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  )
}
