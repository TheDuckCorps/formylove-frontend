import { useRef } from 'react'
import type { RaspadinhaSurpresaData } from '@/core/entities/Page'

interface Props {
  data: RaspadinhaSurpresaData
  onChange: (data: Partial<RaspadinhaSurpresaData>) => void
}

export function RaspadinhaSurpresaPage({ data, onChange }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange({ imageUrl: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        onClick={() => fileRef.current?.click()}
        className="upload-zone h-72 cursor-pointer"
      >
        {data.imageUrl ? (
          <img
            src={data.imageUrl}
            alt="Raspadinha"
            className="w-full h-full object-cover rounded-xl"
          />
        ) : (
          <>
            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span className="text-sm">Clique para carregar a imagem da raspadinha</span>
          </>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
    </div>
  )
}
