import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'
import { ROUTES } from '@/shared/constants/routes'

interface HeaderProps {
  showCta?: boolean
}

export function Header({ showCta = true }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
        {/* CTA */}
        {showCta && (
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.CRIAR)}
          >
            Criar meu presente agora
          </Button>
        )}

        {/* Logo – centro */}
        <Link to={ROUTES.HOME} className="absolute left-1/2 -translate-x-1/2">
          <Logo size="sm" />
        </Link>

        {/* Right: flag + user */}
        <div className="flex items-center gap-3 ml-auto">
          <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition">
            <span>🇧🇷</span>
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={() => navigate(ROUTES.PAINEL)}
            className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition"
            aria-label="Minha conta"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
