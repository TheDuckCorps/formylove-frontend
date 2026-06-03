import type { ToqueContinuarData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: ToqueContinuarData
  onChange: (data: Partial<ToqueContinuarData>) => void
}

const MAX = 120

export function ToqueContinuarPage({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Digite a frase acima do botão de avanço"
        placeholder="Ex: Mais do que qualquer um poderia contar"
        value={data.phrase}
        maxLength={MAX}
        charCount={data.phrase.length}
        maxChars={MAX}
        onChange={(e) => onChange({ phrase: e.target.value })}
      />

      {/* Live preview */}
      {data.phrase && (
        <div className="bg-brand-50 border border-brand/20 rounded-xl p-6 flex flex-col items-center gap-4 text-center">
          <p className="text-sm text-gray-700 font-medium">{data.phrase}</p>
          <button className="btn-brand text-sm px-8 py-2 pointer-events-none opacity-80">
            Continuar
          </button>
        </div>
      )}
    </div>
  )
}
