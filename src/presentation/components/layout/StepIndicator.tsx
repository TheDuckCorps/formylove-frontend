import { useNavigate, useLocation } from 'react-router-dom'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { CREATION_STEPS, canNavigateToCreationStep } from '@/shared/constants/creationSteps'

interface Props {
  currentStep: number
}

export function StepIndicator({ currentStep }: Props) {
  const navigate = useNavigate()
  const location = useLocation()
  const selectedPagesCount = useSiteBuilderStore((s) => s.selectedPages.length)
  const planType = useSiteBuilderStore((s) => s.planType)

  function goToStep(step: number, route: string) {
    if (!canNavigateToCreationStep(step, selectedPagesCount, planType)) return
    if (location.pathname === route) return
    navigate(route)
  }

  return (
    <nav
      className="flex items-center justify-center py-3 px-4 overflow-x-auto"
      aria-label="Etapas do presente"
    >
      {CREATION_STEPS.map(({ step, label, route }, idx) => {
        const completed = step < currentStep
        const active = step === currentStep
        const accessible = canNavigateToCreationStep(step, selectedPagesCount, planType)
        const connectorCompleted = step < currentStep

        return (
          <div key={label} className="flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => goToStep(step, route)}
              disabled={!accessible}
              className={[
                'flex flex-col items-center gap-1 rounded-lg p-1 transition-colors',
                accessible ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-50',
              ].join(' ')}
              aria-current={active ? 'step' : undefined}
              aria-label={`${label}${active ? ', etapa atual' : completed ? ', concluída' : ''}`}
            >
              <div
                className={[
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  completed
                    ? 'bg-brand text-white'
                    : active
                      ? 'bg-brand text-white shadow-[0_0_0_3px_rgba(198,42,135,0.2)]'
                      : 'bg-gray-100 text-gray-400',
                ].join(' ')}
              >
                {completed ? (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span
                className={[
                  'text-[10px] font-medium hidden sm:block',
                  active ? 'text-brand' : completed ? 'text-brand/70' : 'text-gray-400',
                ].join(' ')}
              >
                {label}
              </span>
            </button>

            {idx < CREATION_STEPS.length - 1 && (
              <button
                type="button"
                onClick={() => {
                  const next = CREATION_STEPS[idx + 1]
                  goToStep(next.step, next.route)
                }}
                disabled={!canNavigateToCreationStep(CREATION_STEPS[idx + 1].step, selectedPagesCount, planType)}
                className={[
                  'mx-0.5 mb-4 sm:mb-3 py-2 flex items-center flex-shrink-0 transition-opacity',
                  canNavigateToCreationStep(CREATION_STEPS[idx + 1].step, selectedPagesCount, planType)
                    ? 'cursor-pointer hover:opacity-80'
                    : 'cursor-not-allowed opacity-50',
                ].join(' ')}
                aria-label={`Ir para ${CREATION_STEPS[idx + 1].label}`}
              >
                <span
                  className={[
                    'h-px w-5 sm:w-8 block',
                    connectorCompleted ? 'bg-brand' : 'bg-gray-200',
                  ].join(' ')}
                />
              </button>
            )}
          </div>
        )
      })}
    </nav>
  )
}
