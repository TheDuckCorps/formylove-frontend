import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { StepIndicator } from '../components/layout/StepIndicator'
import { EmailModal } from '../modals/EmailModal'
import { useSiteBuilderStore, MAX_PAGES_PER_PLAN } from '@/shared/store/siteBuilderStore'
import { SiteRepository } from '@/infrastructure/repositories/SiteRepository'
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS } from '@/core/entities/Site'
import type { PlanType } from '@/core/entities/Site'

const PLAN_FEATURES: Record<PlanType, string[]> = {
  BASIC: [
    'Até 5 páginas interativas',
    'Válido por 7 dias',
    'Link + QR Code para compartilhar',
    'QR Code com design premium (+R$2)',
  ],
  INTERMEDIATE: [
    'Até 7 páginas interativas',
    'Válido por 30 dias',
    'Link + QR Code para compartilhar',
    'QR Code com design premium (+R$2)',
  ],
  PREMIUM: [
    'Até 15 páginas interativas',
    'Válido por 1 ano',
    'Link + QR Code para compartilhar',
    'Design premium do QR Code incluso',
  ],
}

const PLAN_BADGE: Record<PlanType, string | null> = {
  BASIC: null,
  INTERMEDIATE: 'Melhor custo-benefício',
  PREMIUM: 'Mais Popular',
}

function formatPrice(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

interface PageLimitModalProps {
  pageCount: number
  plan: (typeof PLANS)[number]
  onAdjust: () => void
  onUpgrade: () => void
  onClose: () => void
}

function PageLimitModal({ pageCount, plan, onAdjust, onUpgrade, onClose }: PageLimitModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-8 animate-fade-in">
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-3xl">
            ⚠️
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 text-center mb-2">
          Páginas acima do limite
        </h3>
        <p className="text-sm text-gray-500 text-center mb-2">
          Você selecionou <strong className="text-gray-800">{pageCount} páginas</strong>, mas o plano{' '}
          <strong className="text-brand">{plan.label}</strong> permite até{' '}
          <strong className="text-gray-800">{MAX_PAGES_PER_PLAN[plan.type]} páginas</strong>.
        </p>
        <p className="text-sm text-gray-500 text-center mb-8">
          Para continuar, escolha uma das opções abaixo:
        </p>

        <div className="flex flex-col gap-3">
          <Button fullWidth onClick={onUpgrade}>
            Selecionar Plano Premium
            <span className="ml-1 text-xs opacity-80">(até 15 páginas)</span>
          </Button>
          <Button fullWidth variant="outline" onClick={onAdjust}>
            Ajustar minhas páginas
          </Button>
          <button
            onClick={onClose}
            className="text-sm text-gray-400 hover:text-gray-600 text-center mt-1"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}

export function EscolherPlanoView() {
  const navigate = useNavigate()
  const { setPlan, selectedPages, qrTemplate, qrCodeDetailed, planType } = useSiteBuilderStore()
  const [chosen, setChosen] = useState<PlanType | null>(planType)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showPageLimitModal, setShowPageLimitModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const pagesTooManyForPlan = chosen
    ? selectedPages.length > MAX_PAGES_PER_PLAN[chosen]
    : false

  function handleSelectPlan(plan: PlanType) {
    setChosen(plan)
    setErrorMessage(null)
  }

  function handleContinue() {
    if (!chosen) return
    if (pagesTooManyForPlan) {
      setShowPageLimitModal(true)
      return
    }
    setPlan(chosen)
    setShowEmailModal(true)
  }

  function handleUpgradeToPremium() {
    setChosen('PREMIUM')
    setShowPageLimitModal(false)
  }

  function handleAdjustPages() {
    setShowPageLimitModal(false)
    navigate(ROUTES.CRIAR)
  }

  async function handleEmailSubmit(submittedEmail: string) {
    if (!chosen) return
    setIsLoading(true)
    setErrorMessage(null)
    try {
      const siteRepo = new SiteRepository()
      const site = await siteRepo.create({
        ownerEmail: submittedEmail,
        planType: chosen,
        pages: selectedPages,
        qrTemplate,
      })

      const paymentRepo = new PaymentRepository()
      const payment = await paymentRepo.create({
        siteId: site.id,
        qrCodeDetailed,
        customerEmail: submittedEmail,
      })

      setShowEmailModal(false)
      navigate(ROUTES.CRIAR_PAGAMENTO, {
        state: {
          qrCode: payment.qrCode,
          qrCodeImage: payment.qrCodeImage,
          amount: payment.amount,
          expiresIn: payment.expiresIn,
          siteId: site.id,
          planType: chosen,
          email: submittedEmail,
        },
      })
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const chosenPlan = chosen ? PLANS.find((p) => p.type === chosen) : null

  return (
    <div className="page-wrapper">
      <Header />
      <StepIndicator currentStep={4} />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Escolha seu plano
        </h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          Você selecionou <strong>{selectedPages.length} página{selectedPages.length !== 1 ? 's' : ''}</strong>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {PLANS.map((plan) => {
            const badge = PLAN_BADGE[plan.type]
            const isSelected = chosen === plan.type
            const tooMany = selectedPages.length > MAX_PAGES_PER_PLAN[plan.type]
            const features = PLAN_FEATURES[plan.type]

            const isPremium = plan.type === 'PREMIUM'

            return (
              <button
                key={plan.type}
                onClick={() => handleSelectPlan(plan.type)}
                className={[
                  'relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all',
                  isPremium && 'sm:scale-105 z-10',
                  isPremium
                    ? isSelected
                      ? 'border-brand bg-brand/10 shadow-card'
                      : 'border-brand bg-brand/5 shadow-md hover:bg-brand/10'
                    : isSelected
                    ? 'border-brand bg-brand/5 shadow-card'
                    : tooMany
                    ? 'border-gray-200 bg-gray-50 opacity-60'
                    : 'border-gray-200 bg-white hover:border-brand/40',
                ].join(' ')}
              >
                {badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand text-white text-[10px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                    {badge}
                  </span>
                )}

                <div className="flex items-center justify-between w-full mb-3">
                  <span className="text-sm font-bold text-gray-800">{plan.label}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>

                <p className="text-2xl font-extrabold text-brand mb-1">
                  {formatPrice(plan.price)}
                </p>
                <p className="text-xs text-gray-400 mb-4">{plan.description}</p>

                <ul className="space-y-1.5 w-full">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                {tooMany && (
                  <div className="mt-3 flex items-center gap-1">
                    <svg className="w-3 h-3 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-[10px] text-red-500 font-medium">
                      Suas {selectedPages.length} páginas excedem o limite de {MAX_PAGES_PER_PLAN[plan.type]}
                    </p>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {chosen && chosen !== 'PREMIUM' && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-gray-700">
              Por apenas <strong className="text-brand">R$ 5,00 a mais</strong> que o Intermediário, tenha acesso por{' '}
              <strong className="text-brand">1 ano inteiro</strong>.
            </p>
            <button
              type="button"
              onClick={() => handleSelectPlan('PREMIUM')}
              className="mt-2 text-xs font-semibold text-brand hover:underline"
            >
              Ver plano Premium →
            </button>
          </div>
        )}

        {qrCodeDetailed && chosen && chosen !== 'PREMIUM' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-center gap-3">
            <span className="text-amber-500 text-lg">⭐</span>
            <p className="text-xs text-amber-700">
              Você escolheu um design premium de QR Code. Será cobrado <strong>+R$2,00</strong>.
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center px-4 py-3 rounded-xl">
            {errorMessage}
          </div>
        )}

        <Button
          size="lg"
          fullWidth
          disabled={!chosen}
          onClick={handleContinue}
        >
          {chosen ? `Continuar com o plano ${PLANS.find((p) => p.type === chosen)?.label}` : 'Selecione um plano'}
        </Button>
        <p className="text-xs text-gray-400 text-center mt-3">
          O pagamento é feito via PIX. Seu presente é ativado automaticamente após a confirmação.
        </p>
      </main>

      <Footer />

      {showPageLimitModal && chosenPlan && (
        <PageLimitModal
          pageCount={selectedPages.length}
          plan={chosenPlan}
          onUpgrade={handleUpgradeToPremium}
          onAdjust={handleAdjustPages}
          onClose={() => setShowPageLimitModal(false)}
        />
      )}

      {showEmailModal && chosenPlan && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          isLoading={isLoading}
          planPrice={chosenPlan.price + (qrCodeDetailed && chosen !== 'PREMIUM' ? 200 : 0)}
        />
      )}
    </div>
  )
}
