import { useState } from 'react'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META } from '@/core/entities/Page'

interface Props {
  onClose: () => void
}

export function EditarPaginasModal({ onClose }: Props) {
  const { selectedPages, removePage, reorderPages } = useSiteBuilderStore()
  const [dragIndex, setDragIndex] = useState<number | null>(null)

  function getMeta(type: string) {
    return PAGE_TYPES_META.find((m) => m.type === type)
  }

  function handleDragStart(index: number) {
    setDragIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    reorderPages(dragIndex, index)
    setDragIndex(index)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-10 px-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-lg max-h-[80vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Edite suas páginas</h2>
          <p className="text-xs text-gray-500 text-center mb-5">
            Clique e arraste para{' '}
            <span className="text-brand font-medium">editar a posição</span> de suas páginas ou
            clique no ícone de X para{' '}
            <span className="text-brand font-medium">excluí-las</span>
          </p>

          <div className="flex flex-col gap-2">
            {selectedPages.map((page, i) => {
              const meta = getMeta(page.type)
              return (
                <div
                  key={page.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={(e) => handleDragOver(e, i)}
                  onDragEnd={() => setDragIndex(null)}
                  className={`flex items-center gap-3 bg-brand-gradient text-white rounded-full px-4 py-2.5 cursor-grab active:cursor-grabbing transition ${dragIndex === i ? 'opacity-50' : ''}`}
                >
                  {/* Drag handle */}
                  <svg className="w-4 h-4 opacity-70 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16"/>
                  </svg>

                  <span className="text-base">{meta?.icon}</span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{meta?.label}</p>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removePage(page.id)}
                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center flex-shrink-0 transition"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>

          {selectedPages.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">
              Nenhuma página selecionada.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
