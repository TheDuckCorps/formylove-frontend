import type { MensagemMultimidiaData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: MensagemMultimidiaData
  onChange: (data: Partial<MensagemMultimidiaData>) => void
  fieldErrors?: Record<string, string>
}

export function MensagemMultimidiaPage({ data, onChange, fieldErrors = {} }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Insira abaixo a URL do vídeo do YouTube"
        placeholder="https://www.youtube.com/shorts/VXiC8DXSgQl"
        value={data.youtubeUrl}
        error={fieldErrors.youtubeUrl}
        onChange={(e) => onChange({ youtubeUrl: e.target.value })}
      />

      <p className="text-xs text-gray-400">
        No momento, vídeos funcionam apenas com links do YouTube.
      </p>
    </div>
  )
}
