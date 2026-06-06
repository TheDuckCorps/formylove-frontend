import { Link } from 'react-router-dom'
import { Logo } from '../common/Logo'

interface EditorHeaderProps {
  title: string
  currentIndex: number
  totalPages: number
  onPrev?: () => void
  onNext?: () => void
}

const navBtnClass =
  'text-gray-800 font-semibold text-sm flex items-center gap-1 hover:text-brand transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded'

export function EditorHeader({
  title,
  onPrev,
  onNext,
}: EditorHeaderProps) {
  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-center relative">
        <Link to="/" className="flex-shrink-0">
          <Logo size="sm" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between gap-3 pb-3">
          <button type="button" onClick={() => onPrev?.()} className={navBtnClass}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </button>

          <h1 className="text-xl font-bold text-gray-800 text-center flex-1 px-2 truncate">
            {title}
          </h1>

          <button type="button" onClick={() => onNext?.()} className={navBtnClass}>
            Próximo
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
