import { useState } from 'react'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PageValidationResult } from '@/core/validation/pageSchemas'

interface Props {
  validationResults?: PageValidationResult[]
}

interface StepperItemProps {
  page: ReturnType<typeof useSiteBuilderStore.getState>['selectedPages'][number]
  index: number
  currentPageIndex: number
  isActive: boolean
  isLast: boolean
  invalid: boolean
  dragIndex: number | null
  forceShowLabel?: boolean
  onSelect: (index: number) => void
  onRemove: (id: string) => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
}

function StepperItem({
  page,
  index,
  currentPageIndex,
  isActive,
  isLast,
  invalid,
  dragIndex,
  forceShowLabel = false,
  onSelect,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
}: StepperItemProps) {
  const meta = PAGE_TYPES_META.find((m) => m.type === page.type)

  const labelPanelClass = forceShowLabel
    ? 'flex-1 min-w-0 pb-4 pt-1.5 flex items-start justify-between gap-2 opacity-100 max-h-none pointer-events-auto'
    : [
        'flex-1 min-w-0 pb-4 pt-1.5 flex items-start justify-between gap-2',
        'opacity-0 max-h-0 overflow-hidden pointer-events-none',
        'group-hover/step:opacity-100 group-hover/step:max-h-20 group-hover/step:pointer-events-auto',
        'transition-all duration-200',
      ].join(' ')

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={[
        'flex gap-3 group/step cursor-grab active:cursor-grabbing',
        dragIndex === index ? 'opacity-50' : '',
      ].join(' ')}
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <button
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`${meta?.label ?? 'Presente'} ${index + 1}${invalid ? ', incompleto' : ''}`}
          aria-current={isActive ? 'step' : undefined}
          className={[
            'relative w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
            isActive
              ? 'border-brand bg-white shadow-md scale-105 ring-2 ring-brand/20'
              : invalid
                ? 'border-red-300 bg-red-50'
                : 'border-gray-200 bg-gray-50 hover:border-brand/50',
          ].join(' ')}
        >
          {meta?.svgIcon ? (
            <img
              src={meta.svgIcon}
              alt=""
              className="w-6 h-6 object-contain pointer-events-none"
              draggable={false}
            />
          ) : (
            <span className="text-xs font-bold text-gray-500">{index + 1}</span>
          )}
          {invalid && (
            <span
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 border border-white"
              aria-hidden
            />
          )}
        </button>
        {!isLast && (
          <div
            className={[
              'w-0.5 flex-1 min-h-[24px] my-1',
              index < currentPageIndex ? 'bg-brand' : 'bg-gray-200',
            ].join(' ')}
            aria-hidden
          />
        )}
      </div>

      <div className={labelPanelClass}>
        <button
          type="button"
          onClick={() => onSelect(index)}
          className="text-left min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
        >
          <p
            className={[
              'text-sm font-semibold truncate',
              isActive ? 'text-brand' : 'text-gray-800',
            ].join(' ')}
          >
            {meta?.label}
          </p>
          <p className="text-xs text-gray-400">Presente {index + 1}</p>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onRemove(page.id)
          }}
          aria-label={`Excluir ${meta?.label}`}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export function PageStepper({ validationResults = [] }: Props) {
  const {
    selectedPages,
    currentPageIndex,
    setCurrentPageIndex,
    removePage,
    reorderPages,
  } = useSiteBuilderStore()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  function isPageInvalid(pageId: string) {
    return validationResults.some((r) => r.pageId === pageId && !r.isValid)
  }

  function handleSelect(index: number) {
    setCurrentPageIndex(index)
    setMobileOpen(false)
    window.scrollTo(0, 0)
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

  function renderStepperItems(forceShowLabel: boolean) {
    return selectedPages.map((page, i) => (
      <StepperItem
        key={page.id}
        page={page}
        index={i}
        currentPageIndex={currentPageIndex}
        isActive={i === currentPageIndex}
        isLast={i === selectedPages.length - 1}
        invalid={isPageInvalid(page.id)}
        dragIndex={dragIndex}
        forceShowLabel={forceShowLabel}
        onSelect={handleSelect}
        onRemove={removePage}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={() => setDragIndex(null)}
      />
    ))
  }

  return (
    <>
      <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24">
        <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-4">
          Seus presentes
        </p>
        <nav aria-label="Navegação entre presentes" className="flex flex-col">
          {renderStepperItems(false)}
          {selectedPages.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhum presente ainda.</p>
          )}
        </nav>
      </aside>

      <div className="lg:hidden fixed bottom-20 left-4 z-30">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir lista de presentes"
          className="w-12 h-12 rounded-full bg-brand text-white shadow-lg flex items-center justify-center hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-modal max-h-[70vh] overflow-y-auto p-6 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">Seus presentes</h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav aria-label="Navegação entre presentes" className="flex flex-col">
              {renderStepperItems(true)}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
