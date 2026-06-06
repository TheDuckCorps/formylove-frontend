import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { QRCodeViewer } from '../components/common/QRCodeViewer'
import { SiteRepository } from '@/infrastructure/repositories/SiteRepository'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS } from '@/core/entities/Site'
import type { Site } from '@/core/entities/Site'

type LoadState = 'loading' | 'ready' | 'empty' | 'error'

function getPlanLabel(site: Site) {
  const type = (site as any).plan ?? site.planType
  return PLANS.find((p) => p.type === type)?.label ?? type ?? '—'
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

interface QRModalProps {
  site: Site
  onClose: () => void
}

function QRModal({ site, onClose }: QRModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-modal w-full max-w-sm p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-800">QR Code do presente</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <QRCodeViewer slug={site.slug} qrTemplate={site.globalSettings?.qrTemplate ?? site.qrTemplate} />

        <p className="text-xs text-gray-400 text-center">
          Aponte a câmera do celular para o QR Code para abrir o presente.
        </p>
      </div>
    </div>
  )
}

export function PainelSitesView() {
  const navigate = useNavigate()
  const location = useLocation()
  const email: string = (location.state as any)?.email ?? sessionStorage.getItem('hl_email') ?? ''

  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [sites, setSites] = useState<Site[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [qrSite, setQrSite] = useState<Site | null>(null)

  useEffect(() => {
    if (!email) {
      navigate(ROUTES.PAINEL, { replace: true })
      return
    }

    const repo = new SiteRepository()
    repo.listByEmail({ email })
      .then((result) => {
        const active = result.filter((s) => ((s as any).status ?? s.status) === 'ACTIVE')
        setSites(active)
        setLoadState(active.length === 0 ? 'empty' : 'ready')
      })
      .catch((err) => {
        setErrorMsg(err instanceof Error ? err.message : 'Erro ao buscar presentes')
        setLoadState('error')
      })
  }, [email, navigate])

  function handleOpenSite(slug: string) {
    navigate(ROUTES.SITE_PUBLICO.replace(':slug', slug))
  }

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
          <p className="text-sm text-gray-400 mb-8">Somente presentes ativos são exibidos.</p>

          {/* Loading */}
          {loadState === 'loading' && (
            <div className="flex justify-center py-20">
              <svg className="w-10 h-10 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            </div>
          )}

          {/* Error */}
          {loadState === 'error' && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-gray-600 mb-6">{errorMsg}</p>
              <Button onClick={() => navigate(ROUTES.PAINEL)}>Tentar novamente</Button>
            </div>
          )}

          {/* Empty */}
          {loadState === 'empty' && (
            <div className="text-center py-16 flex flex-col items-center gap-4">
              <div className="text-5xl">🎁</div>
              <p className="text-base font-semibold text-gray-800">
                Nenhum presente ativo encontrado
              </p>
              <p className="text-sm text-gray-500">
                Presentes expirados ou aguardando pagamento não são listados aqui.
              </p>
              <Button onClick={() => navigate(ROUTES.CRIAR)}>
                Criar meu presente agora
              </Button>
            </div>
          )}

          {/* Sites list */}
          {loadState === 'ready' && (
            <div className="flex flex-col gap-4">
              {sites.map((site) => {
                const expiry = formatDate((site as any).expiresAt ?? site.expirationDate)
                return (
                  <div
                    key={site.id}
                    className="bg-white rounded-2xl shadow-card border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                  >
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold border px-2 py-0.5 rounded-full text-green-600 bg-green-50 border-green-200">
                          Ativo
                        </span>
                        <span className="text-xs text-gray-400 font-mono truncate">{site.slug}</span>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Plano {getPlanLabel(site)}</p>
                      {expiry && (
                        <p className="text-xs text-gray-400 mt-0.5">Expira em {expiry}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 sm:items-end shrink-0">
                      <Button
                        size="sm"
                        onClick={() => handleOpenSite(site.slug)}
                      >
                        Visualizar site
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setQrSite(site)}
                      >
                        Visualizar QRCode do site
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </main>
      </div>

      {qrSite && <QRModal site={qrSite} onClose={() => setQrSite(null)} />}
    </>
  )
}
