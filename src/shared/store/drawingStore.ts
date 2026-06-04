import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DrawingState {
  drawingDataUrl: string | null
  setDrawingDataUrl: (url: string | null) => void
  clearDrawing: () => void
}

export const useDrawingStore = create<DrawingState>()(
  persist(
    (set) => ({
      drawingDataUrl: null,
      setDrawingDataUrl: (drawingDataUrl) => set({ drawingDataUrl }),
      clearDrawing: () => set({ drawingDataUrl: null }),
    }),
    { name: 'hl-drawing' },
  ),
)
