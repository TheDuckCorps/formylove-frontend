import type { ToqueContinuarData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: ToqueContinuarData
  onChange: (data: Partial<ToqueContinuarData>) => void
  fieldErrors?: Record<string, string>
}

const MAX = 120

export function ToqueContinuarPage({ data, onChange, fieldErrors = {} }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Digite a frase acima do botão de avanço"
        placeholder="Ex: Mais do que qualquer um poderia contar"
        value={data.phrase}
        maxLength={MAX}
        charCount={data.phrase.length}
        maxChars={MAX}
        error={fieldErrors.phrase}
        onChange={(e) => onChange({ phrase: e.target.value })}
      />
    </div>
  )
}
