import { Link } from 'react-router-dom'
import { Logo } from '../common/Logo'
import { ROUTES } from '@/shared/constants/routes'

export function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        background: 'linear-gradient(to bottom, rgba(252,228,243,0.55) 0%, #ffffff 60%)',
      }}
    >
      {/* Tagline band */}
      <div className="py-10 text-center px-4">
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
      <div className="border-t border-gray-100 py-3 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
          <Logo size="sm" />

          <a href="mailto:contato@formylove.com.br" className="hover:text-brand transition">
            contato@formylove.com.br
          </a>

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
