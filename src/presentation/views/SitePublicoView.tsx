import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { SpinWheelDisplay } from '../components/pages/SpinWheelDisplay'
import { SiteRepository } from '@/infrastructure/repositories/SiteRepository'
import { ROUTES } from '@/shared/constants/routes'

type LoadState = 'loading' | 'ready' | 'not-found' | 'error'

interface BackendPage {
  id: string
  type: string
  order: number
  content: Record<string, unknown>
}

interface BackendSite {
  id: string
  slug: string
  status: string
  plan?: string
  planType?: string
  pages?: BackendPage[]
}

function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 w-full max-w-sm mx-auto">
      {children}
    </div>
  )
}

function renderPage(page: BackendPage) {
  switch (page.type) {
    case 'SPIN_WHEEL': {
      const options = (page.content.options as string[]) ?? []
      return (
        <PageCard key={page.id}>
          <SpinWheelDisplay options={options} />
        </PageCard>
      )
    }

    case 'TAP_TO_CONTINUE':
      return (
        <PageCard key={page.id}>
          <p className="text-center text-gray-800 text-base font-medium">
            {(page.content.message as string) ?? ''}
          </p>
        </PageCard>
      )

    case 'MYSTERY_WORD':
      return (
        <PageCard key={page.id}>
          <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Dica</p>
          <p className="font-semibold text-gray-700">{page.content.hint as string}</p>
          <p className="text-xs text-gray-400 mt-3 mb-1 uppercase tracking-wide">Resposta</p>
          <p className="font-bold text-brand">{page.content.word as string}</p>
        </PageCard>
      )

    default:
      return (
        <PageCard key={page.id}>
          <p className="text-xs text-gray-400 text-center uppercase tracking-wide">{page.type}</p>
          <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap break-all">
            {JSON.stringify(page.content, null, 2)}
          </pre>
        </PageCard>
      )
  }
}

export function SitePublicoView() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [site, setSite] = useState<BackendSite | null>(null)

  useEffect(() => {
    if (!slug) { setLoadState('not-found'); return }

    const repo = new SiteRepository()
    repo.getBySlug({ slug })
      .then((data) => {
        setSite(data as unknown as BackendSite)
        setLoadState('ready')
      })
      .catch(() => setLoadState('not-found'))
  }, [slug])

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient">
        <svg className="w-10 h-10 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  if (loadState === 'not-found' || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">💔</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Presente não encontrado</h2>
          <p className="text-sm text-gray-400 mb-6">
            Este link pode ter expirado ou não existe.
          </p>
          <Button onClick={() => navigate(ROUTES.HOME)}>Criar meu presente</Button>
        </div>
      </div>
    )
  }

  const pages = (site.pages ?? []).sort((a, b) => a.order - b.order)

  return (
    <div className="min-h-screen bg-page-gradient">
      {/* Header */}
      <div className="flex justify-center py-5">
        <Logo size="sm" />
      </div>

      {/* Pages */}
      <div className="max-w-lg mx-auto px-4 pb-16 flex flex-col gap-6">
        {pages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">Este presente ainda não tem páginas.</p>
        ) : (
          pages.map((page) => renderPage(page))
        )}
      </div>

      {/* Footer watermark */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-400">
          Presente criado com{' '}
          <span
            className="text-brand font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(ROUTES.HOME)}
          >
            HeartLink
          </span>
        </p>
      </div>
    </div>
  )
}
