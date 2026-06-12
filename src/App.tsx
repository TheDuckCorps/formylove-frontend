import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { ROUTES } from '@/shared/constants/routes'
import { ToastProvider } from '@/shared/ui/ToastProvider'

// Views
import { LandingView } from '@/presentation/views/LandingView'
import { EscolherPaginasView } from '@/presentation/views/EscolherPaginasView'
import { EditorView } from '@/presentation/views/EditorView'
import { QRCodeTemplateView } from '@/presentation/views/QRCodeTemplateView'
import { EscolherPlanoView } from '@/presentation/views/EscolherPlanoView'
import { PreviewView } from '@/presentation/views/PreviewView'
import { PaymentView } from '@/presentation/views/PaymentView'
import { PrivacidadeView } from '@/presentation/views/PrivacidadeView'
import { TermosUsoView } from '@/presentation/views/TermosUsoView'
import { SitePublicoView } from '@/presentation/views/SitePublicoView'


// Layout
import { CreationFlowLayout } from '@/presentation/layouts/CreationFlowLayout'

function SuccessView() {
  const location = useLocation()
  const { slug, email } = (location.state as { slug?: string, email?: string }) ?? {}
  const siteUrl = slug ? ROUTES.SITE_PUBLICO.replace(':slug', slug) : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient">
      <div className="text-center px-6">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-700">Pagamento confirmado!</h2>
        <p className="text-sm text-gray-400 mt-2">
          Seu presente está pronto{email ? ` — enviamos o link para ${email}` : ''}.
        </p>
        {siteUrl && (
          <Link
            to={siteUrl}
            className="inline-block mt-6 bg-brand text-white text-sm font-semibold px-6 py-3 rounded-full hover:bg-brand-light transition-colors"
          >
            Ver meu site 💝
          </Link>
        )}
      </div>
    </div>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Analytics />
        <Routes>
        {/* ── Public ─────────────────────────────────────── */}
        <Route path={ROUTES.HOME} element={<LandingView />} />

        {/* ── Creation flow (state is reset when leaving this layout) ─── */}
        <Route element={<CreationFlowLayout />}>
          <Route path={ROUTES.CRIAR} element={<EscolherPaginasView />} />
          <Route path={ROUTES.CRIAR_EDITOR} element={<EditorView />} />
          <Route path={ROUTES.CRIAR_QRCODE} element={<QRCodeTemplateView />} />
          <Route path={ROUTES.CRIAR_PREVIEW} element={<PreviewView />} />
          <Route path={ROUTES.CRIAR_PLANO} element={<EscolherPlanoView />} />
          <Route path={ROUTES.CRIAR_PAGAMENTO} element={<PaymentView />} />
          <Route
            path={ROUTES.CRIAR_SUCESSO}
            element={<SuccessView />}
          />
        </Route>

        {/* ── User panel ──────────────────────────────────── */}
        {/* <Route path={ROUTES.PAINEL} element={<PainelView />} />
        <Route path={ROUTES.PAINEL_VERIFICAR} element={<PainelVerificarView />} />
        <Route path={ROUTES.PAINEL_SITES} element={<PainelSitesView />} /> */}

        {/* ── Public site view ─────────────────────────────── */}
        <Route path={ROUTES.SITE_PUBLICO} element={<SitePublicoView />} />

        {/* ── Legal ────────────────────────────────────────── */}
        <Route path={ROUTES.POLITICA} element={<PrivacidadeView />} />
        <Route path={ROUTES.TERMOS} element={<TermosUsoView />} />

        {/* ── Fallback ─────────────────────────────────────── */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}
