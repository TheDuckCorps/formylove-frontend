import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { Button } from '../common/Button'
import { ProfileModal } from '@/presentation/modals/ProfileModal'
import { ROUTES } from '@/shared/constants/routes'

interface HeaderProps {
  showCta?: boolean
  seamless?: boolean
}

export function Header({ showCta = true, seamless = false }: HeaderProps) {
  const navigate = useNavigate()
  const [showProfileModal, setShowProfileModal] = useState(false)

  return (
    <>
      <header
        className={[
          'w-full sticky top-0 z-40 overflow-hidden',
          seamless ? 'border-b border-transparent bg-transparent' : 'border-b border-gray-100 bg-white/90 backdrop-blur-sm',
        ].join(' ')}
      >
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

          {/* Right: Meus links */}
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex-shrink-0 text-sm font-semibold text-brand border-2 border-brand rounded-xl px-3 sm:px-4 py-1 hover:bg-brand hover:text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            aria-label="Acessar meus links por e-mail"
            title="Acessar meus links por e-mail"
          >
            Meus links
          </button>
        </div>
      </header>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  )
}
