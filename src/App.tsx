import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

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
import { PainelView } from '@/presentation/views/PainelView'
import { PainelVerificarView } from '@/presentation/views/PainelVerificarView'
import { PainelSitesView } from '@/presentation/views/PainelSitesView'

// Layout
import { CreationFlowLayout } from '@/presentation/layouts/CreationFlowLayout'

function SuccessView() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient">
      <div className="text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-700">Presente enviado!</h2>
        <p className="text-sm text-gray-400 mt-2">Em breve</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
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
        <Route path={ROUTES.PAINEL} element={<PainelView />} />
        <Route path={ROUTES.PAINEL_VERIFICAR} element={<PainelVerificarView />} />
        <Route path={ROUTES.PAINEL_SITES} element={<PainelSitesView />} />

        {/* ── Public site view ─────────────────────────────── */}
        <Route path={ROUTES.SITE_PUBLICO} element={<SitePublicoView />} />

        {/* ── Legal ────────────────────────────────────────── */}
        <Route path={ROUTES.POLITICA} element={<PrivacidadeView />} />
        <Route path={ROUTES.TERMOS} element={<TermosUsoView />} />

        {/* ── Fallback ─────────────────────────────────────── */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
