import type { PalavraSecretaData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: PalavraSecretaData
  onChange: (data: Partial<PalavraSecretaData>) => void
}

const MAX_SECRET = 50

export function PalavraSecretaPage({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Digite a dica para que a pessoa adivinhe a frase secreta"
        placeholder="Ex: Onde foi o nosso primeiro beijo"
        value={data.hint}
        onChange={(e) => onChange({ hint: e.target.value })}
      />

      <Input
        label="Digite a frase secreta"
        placeholder="Ex: Cinema"
        value={data.secret}
        maxLength={MAX_SECRET}
        charCount={data.secret.length}
        maxChars={MAX_SECRET}
        onChange={(e) => onChange({ secret: e.target.value })}
      />
    </div>
  )
}
