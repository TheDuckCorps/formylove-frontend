import type { PageValidationResult } from '@/core/validation/pageSchemas'
import { Button } from '../components/common/Button'

interface Props {
  results: PageValidationResult[]
  onFix: (pageIndex: number) => void
  onClose: () => void
}

export function ValidationSummaryModal({ results, onFix, onClose }: Props) {
  const invalid = results.filter((r) => !r.isValid)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="validation-title"
    >
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-6 animate-fade-in">
        <div className="flex justify-center mb-4">
          <span className="text-4xl" aria-hidden>
            📝
          </span>
        </div>

        <h2 id="validation-title" className="text-xl font-bold text-gray-800 text-center mb-2">
          Quase lá!
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Complete os campos abaixo para gerar seu link. Você pode continuar editando à vontade.
        </p>

        <ul className="space-y-3 mb-6 max-h-60 overflow-y-auto" role="list">
          {invalid.map((item) => (
            <li
              key={item.pageId}
              className="bg-red-50 border border-red-100 rounded-xl p-3"
            >
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {item.pageLabel}
              </p>
              <ul className="space-y-0.5">
                {Object.values(item.fieldErrors).map((msg, i) => (
                  <li key={i} className="text-xs text-red-600 flex items-start gap-1">
                    <span aria-hidden>→</span>
                    {msg}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => onFix(item.pageIndex)}
                className="mt-2 text-xs font-semibold text-brand hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
              >
                Ir corrigir →
              </button>
            </li>
          ))}
        </ul>

        <Button fullWidth variant="outline" onClick={onClose}>
          Continuar editando
        </Button>
      </div>
    </div>
  )
}
