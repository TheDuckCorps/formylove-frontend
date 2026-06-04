import { useEffect, useRef, useState } from 'react'

interface Props {
  imageUrl: string | null
  title?: string
}

export function RaspadinhaSurpresaDisplay({ imageUrl, title }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#9CA3AF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [imageUrl])

  function getPos(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return {
        x: ((e.touches[0]?.clientX ?? 0) - rect.left) * (canvas.width / rect.width),
        y: ((e.touches[0]?.clientY ?? 0) - rect.top) * (canvas.height / rect.height),
      }
    }
    return {
      x: (e.clientX - rect.left) * (canvas.width / rect.width),
      y: (e.clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function scratch(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isScratching || revealed) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const { x, y } = getPos(e)
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    ctx.fill()
    checkReveal()
  }

  function checkReveal() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data
    let transparentCount = 0
    for (let i = 3; i < imageData.length; i += 4 * 20) {
      if (imageData[i] < 30) transparentCount += 1
    }
    const sampled = imageData.length / (4 * 20)
    if (sampled > 0 && transparentCount / sampled > 0.7) {
      setRevealed(true)
    }
  }

  return (
    <div className="space-y-3">
      {title ? (
        <p className="text-center text-sm font-semibold text-gray-800">{title}</p>
      ) : null}

      <div className="relative w-full h-56 rounded-xl overflow-hidden border border-gray-200 bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt="Surpresa" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sem imagem definida
          </div>
        )}

        {!revealed && (
          <canvas
            ref={canvasRef}
            width={600}
            height={360}
            className="absolute inset-0 w-full h-full touch-none"
            onMouseDown={() => setIsScratching(true)}
            onMouseUp={() => setIsScratching(false)}
            onMouseLeave={() => setIsScratching(false)}
            onMouseMove={scratch}
            onTouchStart={() => setIsScratching(true)}
            onTouchEnd={() => setIsScratching(false)}
            onTouchMove={scratch}
          />
        )}
      </div>
    </div>
  )
}
