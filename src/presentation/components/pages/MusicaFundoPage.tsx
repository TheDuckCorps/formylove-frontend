import type { MusicaFundoData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: MusicaFundoData
  onChange: (data: Partial<MusicaFundoData>) => void
}

export function MusicaFundoPage({ data, onChange }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Insira abaixo a URL da música do YouTube"
        placeholder="https://www.youtube.com/shorts/VXiC8DXSgQl"
        value={data.youtubeUrl}
        onChange={(e) => onChange({ youtubeUrl: e.target.value })}
      />

      <p className="text-xs text-gray-400">
        No momento, a música de fundo funciona apenas com links do YouTube.
      </p>
    </div>
  )
}
