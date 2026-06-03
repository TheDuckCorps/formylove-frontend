import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PageType } from '@/core/entities/Page'
import { ROUTES } from '@/shared/constants/routes'

export function EscolherPaginasView() {
  const navigate = useNavigate()
  const { selectedPages, addPage, removePage, maxPages, planType } = useSiteBuilderStore()
  const [showLimitWarning, setShowLimitWarning] = useState(false)

  const selectedTypes = selectedPages.map((p) => p.type)

  function handleToggle(type: PageType) {
    const existingIndex = selectedPages.findIndex((p) => p.type === type)
    if (existingIndex >= 0) {
      removePage(selectedPages[existingIndex].id)
    } else {
      if (selectedPages.length >= maxPages) {
        setShowLimitWarning(true)
        setTimeout(() => setShowLimitWarning(false), 3000)
        return
      }
      addPage(type)
    }
  }

  function handleContinuar() {
    if (selectedPages.length === 0) return
    navigate(ROUTES.CRIAR_EDITOR)
  }

  return (
    <div className="page-wrapper">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
          Escolha suas páginas
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Selecione as páginas interativas que deseja incluir no seu presente.{' '}
          {planType && (
            <span className="font-medium text-brand">
              ({selectedPages.length}/{maxPages} selecionadas)
            </span>
          )}
        </p>

        {showLimitWarning && (
          <div className="mb-4 bg-brand-50 border border-brand/30 text-brand text-sm text-center px-4 py-2 rounded-lg animate-fade-in">
            Você atingiu o limite de páginas do seu plano.
          </div>
        )}

        {/* Grid de tipos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {PAGE_TYPES_META.map((meta) => {
            const isSelected = selectedTypes.includes(meta.type)
            return (
              <button
                key={meta.type}
                onClick={() => handleToggle(meta.type)}
                className={[
                  'flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all',
                  isSelected
                    ? 'border-brand bg-brand-50'
                    : 'border-gray-200 bg-white hover:border-brand/40',
                ].join(' ')}
              >
                {/* Icon chip */}
                <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center text-xl ${isSelected ? 'bg-brand-gradient text-white' : 'bg-gray-100'}`}>
                  {meta.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-gray-800">
                      {meta.label}
                    </span>
                    {isSelected && (
                      <span className="ml-auto w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    {meta.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            fullWidth
            disabled={selectedPages.length === 0}
            onClick={handleContinuar}
          >
            Continuar ({selectedPages.length} página{selectedPages.length !== 1 ? 's' : ''})
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
