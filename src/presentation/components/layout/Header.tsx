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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 sm:gap-2">
          <div className="flex justify-start min-w-0">
            {showCta ? (
              <Button
                size="sm"
                onClick={() => navigate(ROUTES.CRIAR)}
                className="whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">Criar meu presente agora</span>
                <span className="sm:hidden">Criar agora</span>
              </Button>
            ) : (
              <div className="w-8 flex-shrink-0" aria-hidden />
            )}
          </div>

          <Link to={ROUTES.HOME} className="justify-self-center flex-shrink-0">
            <Logo size="sm" />
          </Link>

          <div className="flex justify-end min-w-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProfileModal(true)}
              className="flex-shrink-0 whitespace-nowrap"
              aria-label="Acessar meus links por e-mail"
              title="Acessar meus links por e-mail"
            >
              Meus links
            </Button>
          </div>
        </div>
      </header>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </>
  )
}
