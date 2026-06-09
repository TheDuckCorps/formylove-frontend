import { useState, useRef } from 'react'
import type { MedidorAmorData } from '@/core/entities/Page'
import { Input } from '../common/Input'
import { FieldError } from '../common/FieldError'
import { CropModal } from '../common/CropModal'

interface Props {
  data: MedidorAmorData
  onChange: (data: Partial<MedidorAmorData>) => void
  fieldErrors?: Record<string, string>
}

const MAX_Q = 150

export function MedidorAmorPage({ data, onChange, fieldErrors = {} }: Props) {
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
          label="Digite a frase ou pergunta do medidor"
          placeholder="Ex: Você sabe o quanto eu te amo?"
          value={data.question}
          maxLength={MAX_Q}
          charCount={data.question.length}
          maxChars={MAX_Q}
          error={fieldErrors.question}
          onChange={(e) => onChange({ question: e.target.value })}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagem principal
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            className={[
              'upload-zone h-56 md:h-80 cursor-pointer',
              fieldErrors.imageUrl ? 'border-red-400 ring-1 ring-red-200' : '',
            ].join(' ')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          >
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt="Imagem principal"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <>
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span>Clique para carregar a imagem principal</span>
              </>
            )}
          </div>
          <FieldError message={fieldErrors.imageUrl} />
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
        </div>
      </div>
    </>
  )
}
