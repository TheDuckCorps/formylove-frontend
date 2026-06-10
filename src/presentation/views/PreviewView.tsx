import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { SiteThemeProvider, useSiteTheme } from '@/shared/context/SiteThemeContext'
import { Button } from '../components/common/Button'
import { Logo } from '../components/common/Logo'
import { LivePreviewPanel } from '../components/preview/LivePreviewPanel'

function PreviewViewContent() {
  const navigate = useNavigate()
  const theme = useSiteTheme()
  const { selectedPages } = useSiteBuilderStore()
  const [currentIdx, setCurrentIdx] = useState(0)

  const currentPage = selectedPages[currentIdx]

  if (selectedPages.length === 0) {
    navigate(-1)
    return null
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: theme.pageGradient }}>
      <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 transition hover:text-[var(--site-primary)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar e editar
          </button>

          <Logo size="sm" color={theme.primary} />

          <div className="w-24 text-right">
            <span className="text-xs text-gray-400">
              {currentIdx + 1} / {selectedPages.length}
            </span>
          </div>
        </div>
      </header>

      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
        <p className="text-xs text-amber-700 font-medium">
          Pré-visualização — visível somente para você nesta sessão
        </p>
      </div>

      <main className="flex-1 flex flex-col items-center justify-start py-6 px-4">
        <div className="w-full max-w-sm">
          {currentPage && (
            <LivePreviewPanel
              page={currentPage}
              pageIndex={currentIdx}
              totalPages={selectedPages.length}
            />
          )}

          <div className="flex items-center justify-between mt-6 gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              ← Anterior
            </Button>

            <div className="flex gap-1.5">
              {selectedPages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={[
                    'h-2 rounded-full transition-all',
                    i === currentIdx ? 'w-4' : 'w-2 bg-gray-300',
                  ].join(' ')}
                  style={i === currentIdx ? { backgroundColor: theme.primary } : undefined}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === selectedPages.length - 1}
              onClick={() => setCurrentIdx((i) => i + 1)}
            >
              Próxima →
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button fullWidth size="lg" onClick={() => navigate(-1)}>
              Voltar e continuar editando
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export function PreviewView() {
  const siteColor = useSiteBuilderStore((s) => s.siteColor)

  return (
    <SiteThemeProvider color={siteColor}>
      <PreviewViewContent />
    </SiteThemeProvider>
  )
}
