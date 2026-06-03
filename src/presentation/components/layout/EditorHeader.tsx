import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../common/Logo'

interface EditorHeaderProps {
  title: string
  currentIndex: number      // 0-based
  totalPages: number
  onPrev?: () => void
  onNext?: () => void
  onChangePages?: () => void
}

export function EditorHeader({
  title,
  currentIndex,
  totalPages,
  onPrev,
  onNext,
  onChangePages,
}: EditorHeaderProps) {
  const navigate = useNavigate()
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < totalPages - 1

  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
      {/* Top bar */}
      <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => (hasPrev ? onPrev?.() : navigate(-1))}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Anterior
        </button>

        {/* Logo – centro */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <Logo size="sm" />
        </Link>

        <button
          onClick={() => hasNext && onNext?.()}
          className={`flex items-center gap-1 text-sm transition ${hasNext ? 'text-gray-500 hover:text-brand' : 'text-gray-300 cursor-default'}`}
        >
          Próximo
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      {/* Title row */}
      <div className="max-w-3xl mx-auto px-6 pb-3">
        <h1 className="text-xl font-bold text-center text-gray-800">{title}</h1>
      </div>

      {/* Change pages button */}
      {onChangePages && (
        <div className="max-w-3xl mx-auto px-6 pb-3">
          <button
            onClick={onChangePages}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-gradient px-3 py-1.5 rounded-full hover:opacity-90 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round"/>
            </svg>
            Alterar Páginas
          </button>
        </div>
      )}
    </header>
  )
}
