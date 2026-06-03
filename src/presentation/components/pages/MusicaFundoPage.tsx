import { useRef } from 'react'
import type { MusicaFundoData } from '@/core/entities/Page'
import { Input } from '../common/Input'

interface Props {
  data: MusicaFundoData
  onChange: (data: Partial<MusicaFundoData>) => void
}

export function MusicaFundoPage({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleAudio(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    onChange({ audioUrl: url })
  }

  return (
    <div className="flex flex-col gap-6">
      <Input
        label="Insira abaixo a URL da música do youtube"
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
        className="upload-zone h-52"
      >
        {data.audioUrl ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
            <span className="text-sm text-brand font-medium">Áudio carregado ✓</span>
            <audio src={data.audioUrl} controls className="mt-1" />
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>Clique para carregar a música de fundo do seu celular</span>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={handleAudio} />
    </div>
  )
}
