import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { useListSitesByEmail } from '@/infrastructure/queries/siteQueries'
import { ROUTES } from '@/shared/constants/routes'
import { getFriendlyMessage } from '@/shared/errors/getFriendlyMessage'

export function PainelSitesView() {
  const navigate = useNavigate()
  const location = useLocation()
  const email: string = (location.state as any)?.email ?? sessionStorage.getItem('hl_email') ?? ''

  const { data, isLoading, error } = useListSitesByEmail(email)

  useEffect(() => {
    if (!email) navigate(ROUTES.PAINEL, { replace: true })
  }, [email, navigate])

  const hasSites = data?.hasSites

  return (
    <>
      <div className="min-h-screen bg-page-gradient">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-40">
          <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link to={ROUTES.HOME}>
              <Logo size="sm" />
            </Link>
            <span className="text-xs text-gray-400 truncate max-w-[180px]">{email}</span>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Meus presentes</h1>
          <p className="text-sm text-gray-400 mb-8">Os seus presentes serão enviados para o seu e-mail.</p>

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col items-center gap-4 py-20">
              <svg className="w-10 h-10 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm text-gray-400">Enviando seus presentes por e-mail...</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-6">{getFriendlyMessage(error, 'Não foi possível carregar seus presentes.')}</p>
              <Button onClick={() => navigate(ROUTES.PAINEL)}>Tentar novamente</Button>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && hasSites === false && (
            <div className="flex flex-col items-center gap-5 py-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-700">Nenhum site encontrado</p>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Não encontramos sites associados a<br />
                  <strong className="text-gray-600">{email}</strong>.
                </p>
              </div>
              <Button onClick={() => navigate(ROUTES.PAINEL)}>
                Voltar ao início
              </Button>
            </div>
          )}

          {/* Sent */}
          {!isLoading && !error && hasSites === true && (
            <div className="flex flex-col items-center gap-5 py-16 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">E-mail enviado!</p>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  Enviamos a lista de presentes para<br />
                  <strong className="text-gray-700">{email}</strong>.<br />
                  Verifique sua caixa de entrada.
                </p>
              </div>
              <Button onClick={() => navigate(ROUTES.PAINEL)}>
                Voltar ao início
              </Button>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
