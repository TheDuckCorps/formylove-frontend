import { CROP_ASPECT_RATIO } from '@/shared/constants/cropAspect'

interface Props {
  src: string
  alt?: string
  className?: string
  imgClassName?: string
}

/** Renders a square cropped image exactly as seen in CropModal */
export function CroppedImagePreview({
  src,
  alt = '',
  className = '',
  imgClassName = '',
}: Props) {
  return (
    <div
      className={[
        'relative w-full overflow-hidden rounded-xl bg-gray-100',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ aspectRatio: `${CROP_ASPECT_RATIO} / 1` }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className={['w-full h-full object-cover block', imgClassName].filter(Boolean).join(' ')}
      />
    </div>
  )
}
