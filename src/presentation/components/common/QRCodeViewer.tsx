import { getQrTemplateImagePath } from '@/shared/constants/qrTemplates'
import { ImageWithLoader } from './ImageWithLoader'

interface Props {
  slug: string
  qrTemplate?: string
  size?: number
}

/** Preview uses the static template artwork from /public/qr-codes (QR + center icon baked in). */
export function QRCodeViewer({ qrTemplate }: Props) {
  const imagePath = getQrTemplateImagePath(qrTemplate ?? 'template-1')

  return (
    <ImageWithLoader
      key={imagePath}
      src={imagePath}
      alt="Prévia do QR Code"
      wrapperClassName="rounded-2xl overflow-hidden shadow-lg w-full h-full"
      className="w-full h-full object-cover"
      loaderTone="mockup"
      draggable={false}
    />
  )
}
