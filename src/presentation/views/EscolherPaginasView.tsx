import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { StepIndicator } from '../components/layout/StepIndicator'
import { useSiteBuilderStore, MAX_PAGES_PER_PLAN } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META, getPageTypeMaxInstances } from '@/core/entities/Page'
import type { PageType } from '@/core/entities/Page'
import { PLANS } from '@/core/entities/Site'
import type { PlanType } from '@/core/entities/Site'
import { ROUTES } from '@/shared/constants/routes'

const VALID_PLANS: PlanType[] = ['BASIC', 'INTERMEDIATE', 'PREMIUM']

const CARD_RADIAL_BG =
  'radial-gradient(ellipse 50% 50% at 40% 40%, rgba(252,228,243,0.95) 0%, rgba(255,255,255,1) 75%)'
export function EscolherPaginasView() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { selectedPages, addPage, removePage, maxPages, planType, setPlan } = useSiteBuilderStore()
  const [limitMessage, setLimitMessage] = useState<string | null>(null)
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const planoParam = searchParams.get('plano') as PlanType | null
    if (planoParam && VALID_PLANS.includes(planoParam)) {
      setPlan(planoParam)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    }
  }, [])

  const planMeta = planType ? PLANS.find((p) => p.type === planType) : null

  function showWarning(message?: string) {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current)
    if (message) {
      setLimitMessage(message)
    } else if (planMeta) {
      setLimitMessage(
        `Limite do plano ${planMeta.label} atingido (máximo ${maxPages} páginas).${
          planType !== 'PREMIUM' ? ' Escolha o Plano Premium ao finalizar para adicionar mais.' : ''
        }`,
      )
    } else {
      setLimitMessage('Você atingiu o limite máximo de páginas.')
    }
    warningTimerRef.current = setTimeout(() => setLimitMessage(null), 4000)
  }

  function countFor(type: PageType) {
    return selectedPages.filter((p) => p.type === type).length
  }

  function handleAdd(type: PageType) {
    if (selectedPages.length >= maxPages) {
      showWarning()
      return
    }
    const typeMax = getPageTypeMaxInstances(type)
    if (typeMax !== undefined && countFor(type) >= typeMax) {
      return
    }
    const before = selectedPages.length
    addPage(type)
    const after = useSiteBuilderStore.getState().selectedPages.length
    if (after === before) {
      showWarning()
    }
  }

  function handleContinuar() {
    if (selectedPages.length === 0) return
    navigate(ROUTES.CRIAR_EDITOR)
  }

  return (
    <div className="page-wrapper">
      <Header />
      <StepIndicator currentStep={1} />

      {planMeta && (
        <div className="bg-brand/5 border-b border-brand/20 px-4 py-2 text-center">
          <p className="text-xs text-brand font-medium">
            Plano <strong>{planMeta.label}</strong> selecionado — até {MAX_PAGES_PER_PLAN[planType!]}{' '}
            páginas · {planMeta.description.split('·')[1]?.trim()}
          </p>
        </div>
      )}

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-2">
          Escolha suas páginas
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          Toque no card para adicionar a mesma página várias vezes.{' '}
          {planMeta ? (
            <span className="font-medium text-brand">
              ({selectedPages.length}/{maxPages} — Plano {planMeta.label})
            </span>
          ) : (
            <span className="font-medium text-brand">
              ({selectedPages.length} de até {maxPages} selecionadas)
            </span>
          )}
        </p>

        {limitMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm text-center px-4 py-3 rounded-xl animate-fade-in">
            {limitMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10 justify-items-center">
          {PAGE_TYPES_META.map((meta) => {
            const count = countFor(meta.type)
            const hasAny = count > 0
            const instances = selectedPages.filter((p) => p.type === meta.type)
            const atGlobalMax = selectedPages.length >= maxPages
            const typeMax = getPageTypeMaxInstances(meta.type)
            const atTypeMax = typeMax !== undefined && count >= typeMax
            const isDisabled = meta.disabled === true
            const canAdd = !atGlobalMax && !atTypeMax && !isDisabled

            return (
              <div
                key={meta.type}
                role="button"
                tabIndex={canAdd ? 0 : -1}
                aria-label={`Adicionar ${meta.label}`}
                aria-disabled={!canAdd}
                onClick={() => canAdd && handleAdd(meta.type)}
                onKeyDown={(e) => {
                  if (canAdd && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    handleAdd(meta.type)
                  }
                }}
                className={[
                  'relative w-full max-w-[360px] flex flex-col items-center text-center rounded-2xl border-2 p-6 pt-10 gap-4 transition-all outline-none',
                  hasAny ? 'border-brand border-brand-100 shadow-sm' : 'border-gray-200',
                  isDisabled
                    ? 'cursor-not-allowed opacity-50'
                    : canAdd
                      ? 'cursor-pointer hover:shadow-card hover:border-brand/60'
                      : 'cursor-not-allowed opacity-60',
                ].join(' ')}
                style={{ background: CARD_RADIAL_BG }}
              >
                {isDisabled && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 border border-gray-200 pointer-events-none">
                    Em breve
                  </span>
                )}
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-[3px] border-brand flex items-center justify-center bg-white pointer-events-none"
                  aria-hidden
                >
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                    <span className="text-white text-sm font-extrabold leading-none">
                      {count > 0 ? count : '+'}
                    </span>
                  </div>
                </div>

                <div className="w-full max-w-[328px] min-h-[104px] rounded-2xl bg-white flex items-center justify-center p-4 shadow-sm border border-brand-50 pointer-events-none">
                  <img
                    src={meta.svgIcon}
                    alt=""
                    className="w-full h-full min-h-[104px] max-h-[104px] object-contain"
                    width={328}
                    height={104}
                    draggable={false}
                  />
                </div>

                <h3 className="font-bold text-base text-gray-800 leading-snug pointer-events-none">{meta.label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed pointer-events-none">{meta.description}</p>
                {typeMax !== undefined && (
                  <p className="text-[10px] text-gray-400 pointer-events-none">
                    {typeMax === 1 ? 'Máx. 1 por presente' : `Máx. ${typeMax} por presente`}
                  </p>
                )}

                {instances.length > 0 && (
                  <div
                    className="flex flex-wrap justify-center gap-1.5 w-full pt-1"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  >
                    {instances.map((page, idx) => (
                      <button
                        key={page.id}
                        type="button"
                        onClick={() => removePage(page.id)}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-brand/40 text-brand hover:bg-brand hover:text-white transition-colors"
                      >
                        × {meta.label}
                        {instances.length > 1 ? ` ${idx + 1}` : ''}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="max-w-md mx-auto">
          <Button size="lg" fullWidth disabled={selectedPages.length === 0} onClick={handleContinuar}>
            Continuar ({selectedPages.length} página{selectedPages.length !== 1 ? 's' : ''})
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
