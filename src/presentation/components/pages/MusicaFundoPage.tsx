import type { MusicaFundoData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: MusicaFundoData
  onChange: (data: Partial<MusicaFundoData>) => void
  fieldErrors?: Record<string, string>
}

export function MusicaFundoPage({ data, onChange, fieldErrors = {} }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Insira abaixo a URL da música do YouTube"
        placeholder="https://www.youtube.com/shorts/VXiC8DXSgQl"
        value={data.youtubeUrl}
        error={fieldErrors.youtubeUrl}
        onChange={(e) => onChange({ youtubeUrl: e.target.value })}
      />

      <p className="text-xs text-gray-400">
        No momento, a música de fundo funciona apenas com links do YouTube.
      </p>
    </div>
  )
}
