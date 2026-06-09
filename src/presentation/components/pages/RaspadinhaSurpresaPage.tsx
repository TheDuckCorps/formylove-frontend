import { useState, useRef } from 'react'
import type { RaspadinhaSurpresaData } from '@/core/entities/Page'
import { Input } from '../common/Input'
import { FieldError } from '../common/FieldError'
import { CropModal } from '../common/CropModal'

interface Props {
  data: RaspadinhaSurpresaData
  onChange: (data: Partial<RaspadinhaSurpresaData>) => void
  fieldErrors?: Record<string, string>
}

export function RaspadinhaSurpresaPage({ data, onChange, fieldErrors = {} }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [pendingCropSrc, setPendingCropSrc] = useState<string | null>(null)

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPendingCropSrc(ev.target?.result as string)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <>
      {pendingCropSrc && (
        <CropModal
          imageSrc={pendingCropSrc}
          onConfirm={(croppedUrl) => {
            onChange({ imageUrl: croppedUrl })
            setPendingCropSrc(null)
          }}
          onCancel={() => setPendingCropSrc(null)}
        />
      )}

      <div className="flex flex-col gap-5">
        <Input
          label="Título (opcional)"
          placeholder="Ex: Uma surpresa pra você"
          value={data.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value })}
        />

        <div>
          <div
            onClick={() => fileRef.current?.click()}
            className={[
              'upload-zone h-72 md:h-96 cursor-pointer',
              fieldErrors.imageUrl ? 'border-red-400 ring-1 ring-red-200' : '',
            ].join(' ')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
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
          <FieldError message={fieldErrors.imageUrl} />
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </div>
    </>
  )
}
