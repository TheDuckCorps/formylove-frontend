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
    {
      name: 'hl-drawing',
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name)
          return value ? JSON.parse(value) : null
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, JSON.stringify(value))
          } catch (e) {
            if (e instanceof DOMException && e.name === 'QuotaExceededError') {
              console.warn('localStorage quota exceeded — state not persisted')
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
)
