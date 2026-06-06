import { useEffect, useRef, useState } from 'react'
import { RewardReveal } from './RewardReveal'

interface Props {
  imageUrl: string | null
  title?: string
  onComplete?: () => void
  previewMode?: boolean
}

export function RaspadinhaSurpresaDisplay({ imageUrl, title, onComplete, previewMode = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const scratchMovesRef = useRef(0)
  const completedRef = useRef(false)
  const [isScratching, setIsScratching] = useState(false)
  const [revealed, setRevealed] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = '#9CA3AF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setRevealed(false)
    setHasStarted(false)
    lastPosRef.current = null
    scratchMovesRef.current = 0
    completedRef.current = false
  }, [imageUrl])

  useEffect(() => {
    if (revealed && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
  }, [revealed, onComplete])

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

  function drawScratchStroke(x: number, y: number) {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 36

    const last = lastPosRef.current
    if (last) {
      ctx.beginPath()
      ctx.moveTo(last.x, last.y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(x, y, 18, 0, Math.PI * 2)
    ctx.fill()

    lastPosRef.current = { x, y }
  }

  function checkReveal() {
    scratchMovesRef.current += 1
    if (scratchMovesRef.current % 8 !== 0) return

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

  function scratch(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isScratching || revealed) return
    if (!hasStarted) setHasStarted(true)
    const { x, y } = getPos(e)
    drawScratchStroke(x, y)
    checkReveal()
  }

  function startScratch() {
    setIsScratching(true)
    lastPosRef.current = null
  }

  function stopScratch() {
    setIsScratching(false)
    lastPosRef.current = null
  }

  return (
    <div className="space-y-3">
      <RewardReveal active={revealed} message="Surpresa revelada!" previewMode={previewMode} />

      {title ? (
        <p className="text-center text-base font-semibold text-gray-800">{title}</p>
      ) : null}

      <div
        className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 touch-none select-none"
        onContextMenu={(e) => e.preventDefault()}
        style={{ WebkitTouchCallout: 'none' }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            draggable={false}
            className="w-full h-full object-cover pointer-events-none select-none"
          />
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
            className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
            onMouseDown={startScratch}
            onMouseUp={stopScratch}
            onMouseLeave={stopScratch}
            onMouseMove={scratch}
            onTouchStart={startScratch}
            onTouchEnd={stopScratch}
            onTouchMove={scratch}
          />
        )}

        {!revealed && !hasStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-3">
            <span className="animate-finger-scratch text-5xl select-none drop-shadow-md">👆</span>
            <p className="text-white text-xs font-semibold bg-black/45 px-3 py-1.5 rounded-full tracking-wide">
              Raspe para revelar!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
