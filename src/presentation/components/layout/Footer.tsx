import { Link } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { ROUTES } from '@/shared/constants/routes'

export function Footer() {
  return (
    <footer className="w-full">
      {/* Tagline band */}
      <div className="bg-white py-10 text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Simples. Emocionante. Inesquecível.
        </h2>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Acreditamos no poder das pequenas coisas. Com nossa plataforma intuitiva, você cria presentes
          que tocam o coração sem complicações, mantendo o foco no que realmente importa: a conexão
          entre você e quem você ama.
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-100 bg-white py-3 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <Logo size="sm" />

          <span className="hidden sm:block">CNPJ: ••••••••••••••</span>

          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
            </svg>
            <span>Suporte 24h: +55 (11) 94902‑0022</span>
          </div>

          <div className="flex items-center gap-3">
            <span>© 2025. Todos os direitos reservados</span>
            <Link to={ROUTES.POLITICA} className="hover:text-brand transition">Política de Privacidade</Link>
            <span>|</span>
            <Link to={ROUTES.TERMOS} className="hover:text-brand transition">Termos de Uso</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
