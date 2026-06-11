import { useEffect, useState, type ImgHTMLAttributes } from 'react'
import { MediaLoaderOverlay } from './MediaLoaderOverlay'

interface Props extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onLoad' | 'onError'> {
  wrapperClassName?: string
  loaderTone?: 'mockup' | 'light'
}

export function ImageWithLoader({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  loaderTone = 'light',
  ...imgProps
}: Props) {
  const [ready, setReady] = useState(() => !src)

  useEffect(() => {
    setReady(!src)
  }, [src])

  return (
    <div className={['relative overflow-hidden', wrapperClassName].filter(Boolean).join(' ')}>
      {!ready && <MediaLoaderOverlay tone={loaderTone} />}
      <img
        {...imgProps}
        src={src}
        alt={alt}
        onLoad={() => setReady(true)}
        onError={() => setReady(true)}
        className={[
          className,
          'transition-opacity duration-300',
          ready ? 'opacity-100' : 'opacity-0',
        ]
          .filter(Boolean)
          .join(' ')}
      />
    </div>
  )
}
