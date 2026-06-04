import { useRef, useEffect, useState } from 'react'
import type { DesenhoLivreData } from '@/core/entities/Page'
import { useDrawingStore } from '@/shared/store/drawingStore'

interface Props {
  data: DesenhoLivreData
  onChange: (data: Partial<DesenhoLivreData>) => void
}

const COLORS = ['#C62A87', '#E91E8C', '#9E9E9E', '#000000']

export function DesenhoLivrePage({ data, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [lineWidth] = useState(3)
  const lastPos = useRef<{ x: number; y: number } | null>(null)
  const { drawingDataUrl: persistedDrawing, setDrawingDataUrl, clearDrawing } = useDrawingStore()

  // Restore drawing on mount: prefer in-page data, fall back to persisted
  useEffect(() => {
    const source = data.drawingDataUrl ?? persistedDrawing
    if (!canvasRef.current || !source) return
    const img = new Image()
    img.onload = () => canvasRef.current?.getContext('2d')?.drawImage(img, 0, 0)
    img.src = source
    if (!data.drawingDataUrl && source) {
      onChange({ drawingDataUrl: source })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function getPos(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      }
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    }
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    setIsDrawing(true)
    lastPos.current = getPos(e)
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || !canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')!
    const pos = getPos(e)
    ctx.strokeStyle = color
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(lastPos.current!.x, lastPos.current!.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    lastPos.current = pos
  }

  function endDraw() {
    setIsDrawing(false)
    lastPos.current = null
    const url = canvasRef.current?.toDataURL() ?? null
    onChange({ drawingDataUrl: url })
    setDrawingDataUrl(url)
  }

  function handleClear() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx || !canvasRef.current) return
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    onChange({ drawingDataUrl: null })
    clearDrawing()
  }

  function handleUndo() {
    // Simplified: just clear (full undo history would need extra state)
    handleClear()
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-fit mx-auto shadow-sm">
        {/* Pen icon */}
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
        </svg>

        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full border-2 transition ${color === c ? 'border-gray-700 scale-110' : 'border-transparent'}`}
            />
          ))}
        </div>

        <div className="w-px h-5 bg-gray-200" />

        {/* Upload */}
        <button className="text-gray-400 hover:text-brand transition" title="Upload imagem">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
          </svg>
        </button>

        <button onClick={handleUndo} className="text-gray-400 hover:text-brand transition" title="Desfazer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
          </svg>
        </button>

        <button className="text-gray-400 hover:text-brand transition" title="Refazer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"/>
          </svg>
        </button>

        <button onClick={handleClear} className="text-gray-400 hover:text-red-400 transition" title="Limpar">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full border-2 border-gray-200 rounded-xl bg-white cursor-crosshair touch-none"
        style={{ maxHeight: 400 }}
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={endDraw}
        onMouseLeave={endDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={endDraw}
      />
    </div>
  )
}
