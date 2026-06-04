import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PageItem } from '@/core/entities/Page'
import { Button } from '../components/common/Button'
import { Logo } from '../components/common/Logo'
import { PagePreviewContent } from '../components/preview/PagePreviewContent'

function PagePreviewCard({ page, index, total }: { page: PageItem; index: number; total: number }) {
  const meta = PAGE_TYPES_META.find((m) => m.type === page.type)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center overflow-hidden">
            {meta?.svgIcon ? (
              <img src={meta.svgIcon} alt="" className="w-6 h-6 object-contain" draggable={false} />
            ) : null}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Página {index + 1} de {total}</p>
            <p className="text-sm font-semibold text-gray-800">{meta?.label ?? page.type}</p>
          </div>
        </div>
      </div>
      <PagePreviewContent type={page.type} data={page.data} />
    </div>
  )
}

export function PreviewView() {
  const navigate = useNavigate()
  const { selectedPages } = useSiteBuilderStore()
  const [currentIdx, setCurrentIdx] = useState(0)

  const currentPage = selectedPages[currentIdx]

  if (selectedPages.length === 0) {
    navigate(-1)
    return null
  }

  return (
    <div className="min-h-screen bg-page-gradient flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar e editar
          </button>

          <Logo size="sm" />

          <div className="w-24 text-right">
            <span className="text-xs text-gray-400">
              {currentIdx + 1} / {selectedPages.length}
            </span>
          </div>
        </div>
      </header>

      {/* Preview notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
        <p className="text-xs text-amber-700 font-medium">
          Pré-visualização — visível somente para você nesta sessão
        </p>
      </div>

      {/* Phone mockup */}
      <main className="flex-1 flex flex-col items-center justify-start py-6 px-4">
        <div className="w-full max-w-sm">
          {/* Phone frame */}
          <div className="border-[6px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-50">
            {/* Notch */}
            <div className="bg-gray-800 h-6 flex items-center justify-center">
              <div className="w-20 h-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Screen */}
            <div className="bg-gradient-to-b from-pink-50 to-white min-h-[500px] p-4 space-y-4 overflow-y-auto">
              {currentPage && (
                <PagePreviewCard
                  page={currentPage}
                  index={currentIdx}
                  total={selectedPages.length}
                />
              )}
            </div>

            {/* Home bar */}
            <div className="bg-gray-800 h-5 flex items-center justify-center">
              <div className="w-24 h-1 bg-gray-600 rounded-full" />
            </div>
          </div>

          {/* Page navigation */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              ← Anterior
            </Button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {selectedPages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={[
                    'w-2 h-2 rounded-full transition-all',
                    i === currentIdx ? 'bg-brand w-4' : 'bg-gray-300',
                  ].join(' ')}
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
