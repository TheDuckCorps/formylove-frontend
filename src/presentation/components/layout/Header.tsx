import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'
import { ProfileModal } from '@/presentation/modals/ProfileModal'
import { ROUTES } from '@/shared/constants/routes'

interface HeaderProps {
  showCta?: boolean
}

export function Header({ showCta = true }: HeaderProps) {
  const navigate = useNavigate()
  const [showProfileModal, setShowProfileModal] = useState(false)

  return (
    <header className="w-full border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2 relative">
        {/* Left: CTA button */}
        {showCta ? (
          <Button
            size="sm"
            onClick={() => navigate(ROUTES.CRIAR)}
            className="whitespace-nowrap flex-shrink-0"
          >
            <span className="hidden sm:inline">Criar meu presente agora</span>
            <span className="sm:hidden">Criar</span>
          </Button>
        ) : (
          <div className="flex-shrink-0 w-8" />
        )}

        {/* Center: Logo (absolute so it's always truly centered) */}
        <Link to={ROUTES.HOME} className="absolute left-1/2 -translate-x-1/2 flex-shrink-0">
          <Logo size="sm" />
        </Link>

        {/* Right: Entrar */}
        <button
          onClick={() => setShowProfileModal(true)}
          className="flex-shrink-0 text-sm font-semibold text-brand border-2 border-brand rounded-xl px-4 py-1 hover:bg-brand hover:text-white transition-all duration-200"
          aria-label="Entrar"
        >
          Entrar
        </button>
      </div>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </header>
  )
}
