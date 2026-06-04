const STEPS = ['Páginas', 'Editar', 'Capa', 'Plano', 'Pagamento']

interface Props {
  currentStep: number  // 1-based
}

export function StepIndicator({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center py-3 px-4 overflow-x-auto">
      {STEPS.map((label, idx) => {
        const step = idx + 1
        const completed = step < currentStep
        const active = step === currentStep

        return (
          <div key={label} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
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
            </div>

            {idx < STEPS.length - 1 && (
              <div
                className={[
                  'h-px w-5 sm:w-8 mx-1 mb-4 sm:mb-3 transition-all flex-shrink-0',
                  step < currentStep ? 'bg-brand' : 'bg-gray-200',
                ].join(' ')}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
