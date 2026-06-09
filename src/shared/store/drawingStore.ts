import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

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
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value)
          } catch (e) {
            if (e instanceof DOMException && e.name === 'QuotaExceededError') {
              console.warn('localStorage quota exceeded — state not persisted')
            }
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
    },
  ),
)
