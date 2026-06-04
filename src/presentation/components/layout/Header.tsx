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
    <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Logo – left on mobile, center on desktop */}
        <Link to={ROUTES.HOME} className="flex-shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
          <Logo size="sm" />
        </Link>

        {/* Spacer so right items push to the right on desktop */}
        <div className="hidden sm:block flex-1" />

        {/* Right side: CTA + flag + account */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {showCta && (
            <Button
              size="sm"
              onClick={() => navigate(ROUTES.CRIAR)}
              className="whitespace-nowrap"
            >
              <span className="hidden sm:inline">Criar meu presente</span>
              <span className="sm:hidden">Criar</span>
            </Button>
          )}

          <button className="hidden sm:flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 transition">
            <span>🇧🇷</span>
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={() => setShowProfileModal(true)}
            className="w-8 h-8 rounded-full border-2 border-brand text-brand flex items-center justify-center hover:bg-brand/10 transition flex-shrink-0"
            aria-label="Meus presentes"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </button>
        </div>
      </div>

      {showProfileModal && (
        <ProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </header>
  )
}
