import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'

interface Props {
  imageSrc: string
  onConfirm: (croppedUrl: string) => void
  onCancel: () => void
}

async function getCroppedImage(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = imageSrc
  })

  const canvas = document.createElement('canvas')
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  const ctx = canvas.getContext('2d')!

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  )

  return canvas.toDataURL('image/jpeg', 0.92)
}

export function CropModal({ imageSrc, onConfirm, onCancel }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels)
  }, [])

  async function handleConfirm() {
    if (!croppedAreaPixels) return
    const url = await getCroppedImage(imageSrc, croppedAreaPixels)
    onConfirm(url)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/90">
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-4 bg-black/80">
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="flex-1 accent-brand"
          aria-label="Zoom"
        />
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-full border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-full bg-brand text-white text-sm font-semibold shadow-md hover:bg-brand/90 transition"
        >
          Confirmar
        </button>
      </div>
    </div>
  )
}
