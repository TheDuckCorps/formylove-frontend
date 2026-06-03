import { useRef } from 'react'
import type { MensagemMultimidiaData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: MensagemMultimidiaData
  onChange: (data: Partial<MensagemMultimidiaData>) => void
}

export function MensagemMultimidiaPage({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleVideo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    onChange({ videoUrl: URL.createObjectURL(file) })
  }

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="Insira abaixo a URL do vídeo do youtube"
        placeholder="https://www.youtube.com/shorts/VXiC8DXSgQl"
        value={data.youtubeUrl}
        onChange={(e) => onChange({ youtubeUrl: e.target.value })}
      />

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">ou</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <div
        onClick={() => fileRef.current?.click()}
        className="upload-zone h-56 cursor-pointer"
      >
        {data.videoUrl ? (
          <video src={data.videoUrl} controls className="w-full h-full rounded-xl object-cover" />
        ) : (
          <>
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm">Clique para carregar o vídeo do seu celular</span>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="video/*" className="hidden" onChange={handleVideo} />
    </div>
  )
}
