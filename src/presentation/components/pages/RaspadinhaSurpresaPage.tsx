import { useRef, useState } from 'react'
import type { RaspadinhaSurpresaData } from '@/core/entities/Page'
import { Input } from '../common/Input'
import { FieldError } from '../common/FieldError'

interface Props {
  data: RaspadinhaSurpresaData
  onChange: (data: Partial<RaspadinhaSurpresaData>) => void
  fieldErrors?: Record<string, string>
}

export function RaspadinhaSurpresaPage({ data, onChange, fieldErrors = {} }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  function loadFile(file: File) {
    const reader = new FileReader()
    reader.onload = (ev) => onChange({ imageUrl: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) loadFile(file)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }

  return (
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
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          className={[
            'upload-zone h-72 md:h-96 cursor-pointer',
            isDragging ? 'border-brand bg-brand/5 scale-[1.01]' : '',
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
              <span className="text-sm">
                {isDragging ? 'Solte a imagem aqui' : 'Clique ou arraste a imagem da raspadinha'}
              </span>
            </>
          )}
        </div>
        <FieldError message={fieldErrors.imageUrl} />
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
    </div>
  )
}
