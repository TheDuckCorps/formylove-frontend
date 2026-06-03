import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

// Views
import { LandingView } from '@/presentation/views/LandingView'
import { EscolherPaginasView } from '@/presentation/views/EscolherPaginasView'
import { EditorView } from '@/presentation/views/EditorView'
import { QRCodeTemplateView } from '@/presentation/views/QRCodeTemplateView'
import { PrivacidadeView } from '@/presentation/views/PrivacidadeView'
import { TermosUsoView } from '@/presentation/views/TermosUsoView'

// Lazy placeholders for screens not yet implemented
function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-page-gradient">
      <div className="text-center">
        <div className="text-4xl mb-4">🚧</div>
        <h2 className="text-xl font-bold text-gray-700">{title}</h2>
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

        {/* ── Creation flow ───────────────────────────────── */}
        <Route path={ROUTES.CRIAR} element={<EscolherPaginasView />} />
        <Route path={ROUTES.CRIAR_EDITOR} element={<EditorView />} />
        <Route path={ROUTES.CRIAR_QRCODE} element={<QRCodeTemplateView />} />
        <Route
          path={ROUTES.CRIAR_PAGAMENTO}
          element={<PlaceholderView title="Pagamento via Pix" />}
        />
        <Route
          path={ROUTES.CRIAR_SUCESSO}
          element={<PlaceholderView title="Presente enviado! 🎉" />}
        />

        {/* ── User panel ──────────────────────────────────── */}
        <Route
          path={ROUTES.PAINEL}
          element={<PlaceholderView title="Acessar meus presentes" />}
        />
        <Route
          path={ROUTES.PAINEL_VERIFICAR}
          element={<PlaceholderView title="Verificar código OTP" />}
        />
        <Route
          path={ROUTES.PAINEL_SITES}
          element={<PlaceholderView title="Meus presentes" />}
        />

        {/* ── Public site view ─────────────────────────────── */}
        <Route
          path={ROUTES.SITE_PUBLICO}
          element={<PlaceholderView title="Visualizando presente..." />}
        />

        {/* ── Legal ────────────────────────────────────────── */}
        <Route path={ROUTES.POLITICA} element={<PrivacidadeView />} />
        <Route path={ROUTES.TERMOS} element={<TermosUsoView />} />

        {/* ── Fallback ─────────────────────────────────────── */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
