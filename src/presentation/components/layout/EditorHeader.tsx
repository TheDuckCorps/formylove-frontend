import { Link } from 'react-router-dom'
import { Logo } from '../common/Logo'

interface EditorHeaderProps {
  title: string
  currentIndex: number
  totalPages: number
  onPrev?: () => void
  onNext?: () => void
  onChangePages?: () => void
}

const navBtnClass =
  'text-gray-800 font-semibold text-sm flex items-center gap-1 hover:text-brand transition-colors shrink-0'

export function EditorHeader({
  title,
  onPrev,
  onNext,
  onChangePages,
}: EditorHeaderProps) {
  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-center relative">
        <Link to="/" className="flex-shrink-0">
          <Logo size="sm" />
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:hidden">
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

      {onChangePages && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-3 flex justify-center">
          <button
            type="button"
            onClick={onChangePages}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-gradient px-4 py-2 rounded-xl hover:opacity-90 transition"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Alterar páginas
          </button>
        </div>
      )}
    </header>
  )
}
