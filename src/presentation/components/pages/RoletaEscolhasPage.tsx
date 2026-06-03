import type { RoletaEscolhasData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: RoletaEscolhasData
  onChange: (data: Partial<RoletaEscolhasData>) => void
}

const MAX_PHRASE = 100

export function RoletaEscolhasPage({ data, onChange }: Props) {
  function updateOption(index: number, value: string) {
    const updated = [...data.options]
    updated[index] = value
    onChange({ options: updated })
  }

  function addOption() {
    if (data.options.length >= 8) return
    onChange({ options: [...data.options, ''] })
  }

  function removeOption(index: number) {
    if (data.options.length <= 2) return
    onChange({ options: data.options.filter((_, i) => i !== index) })
  }

  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Digite a frase que ficará acima da roleta"
        placeholder="Onde vamos hoje?"
        value={data.phrase}
        maxLength={MAX_PHRASE}
        charCount={data.phrase.length}
        maxChars={MAX_PHRASE}
        onChange={(e) => onChange({ phrase: e.target.value })}
      />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Escolha as opções da roleta</p>
        <div className="flex flex-col gap-2">
          {data.options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                className="input-base flex-1 text-sm py-2"
                placeholder={`OPÇÃO ${i + 1}`}
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeOption(i)}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-400 flex-shrink-0 transition"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>

        {data.options.length < 8 && (
          <button
            type="button"
            onClick={addOption}
            className="mt-3 w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center hover:opacity-90 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
