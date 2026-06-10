import { cloneElement, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PageValidationResult } from '@/core/validation/pageSchemas'

interface Props {
  validationResults?: PageValidationResult[]
  hideMobileButton?: boolean
  externalMobileOpen?: React.MutableRefObject<(() => void) | null>
  sidebarContent?: ReactNode
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
  enableNativeDrag?: boolean
  mobileSheet?: boolean
  onSelect: (index: number) => void
  onRemove: (id: string) => void
  onDragStart: (index: number) => void
  onDragOver: (e: React.DragEvent, index: number) => void
  onDragEnd: () => void
  onTouchStart: (e: React.TouchEvent, index: number) => void
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
  enableNativeDrag = true,
  mobileSheet = false,
  onSelect,
  onRemove,
  onDragStart,
  onDragOver,
  onDragEnd,
  onTouchStart,
}: StepperItemProps) {
  const meta = PAGE_TYPES_META.find((m) => m.type === page.type)

  const labelPanelClass = mobileSheet
    ? 'flex-1 min-w-0 flex items-center justify-between gap-2'
    : forceShowLabel
    ? 'flex-1 min-w-0 pb-4 pt-1.5 flex items-start justify-between gap-2 opacity-100 max-h-none pointer-events-auto'
    : [
        'flex-1 min-w-0 pb-4 pt-1.5 flex items-start justify-between gap-2',
        'opacity-0 max-h-0 overflow-hidden pointer-events-none',
        'group-hover/step:opacity-100 group-hover/step:max-h-20 group-hover/step:pointer-events-auto',
        'transition-all duration-200',
      ].join(' ')

  const rowClass = mobileSheet
    ? [
        'flex gap-3 rounded-xl border-2 px-3 py-2.5 transition-all',
        dragIndex === index ? 'opacity-50' : '',
        isActive
          ? 'border-brand bg-brand/10 shadow-sm ring-1 ring-brand/20'
          : invalid
            ? 'border-red-200 bg-red-50/80'
            : 'border-gray-100 bg-white/90',
      ].join(' ')
    : [
        'flex gap-3 group/step',
        enableNativeDrag ? 'cursor-grab active:cursor-grabbing' : '',
        dragIndex === index ? 'opacity-50' : '',
      ].join(' ')

  return (
    <div
      data-stepper-index={index}
      draggable={enableNativeDrag}
      onDragStart={enableNativeDrag ? () => onDragStart(index) : undefined}
      onDragOver={enableNativeDrag ? (e) => onDragOver(e, index) : undefined}
      onDragEnd={enableNativeDrag ? onDragEnd : undefined}
      className={rowClass}
    >
      <div
        className={[
          'flex items-center justify-center flex-shrink-0',
          mobileSheet ? 'h-full self-center' : 'h-11',
        ].join(' ')}
        style={{ touchAction: 'none' }}
        onTouchStart={(e) => onTouchStart(e, index)}
      >
        <svg
          aria-hidden
          className={[
            'w-3.5 h-3.5 transition-colors',
            mobileSheet ? 'text-gray-400' : 'text-gray-300 group-hover/step:text-gray-400',
          ].join(' ')}
          viewBox="0 0 10 16" fill="currentColor"
        >
          <circle cx="2.5" cy="2" r="1.5" />
          <circle cx="7.5" cy="2" r="1.5" />
          <circle cx="2.5" cy="8" r="1.5" />
          <circle cx="7.5" cy="8" r="1.5" />
          <circle cx="2.5" cy="14" r="1.5" />
          <circle cx="7.5" cy="14" r="1.5" />
        </svg>
      </div>
      <div className={mobileSheet ? 'flex items-center flex-shrink-0' : 'flex flex-col items-center flex-shrink-0'}>
        <button
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`${meta?.label ?? 'Página'} ${index + 1}${invalid ? ', incompleto' : ''}`}
          aria-current={isActive ? 'step' : undefined}
          className={[
            'relative rounded-full border-2 flex items-center justify-center transition-all',
            mobileSheet ? 'w-12 h-12' : 'w-11 h-11',
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
              className={mobileSheet ? 'w-7 h-7 object-contain pointer-events-none' : 'w-6 h-6 object-contain pointer-events-none'}
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
        {!isLast && !mobileSheet && (
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
              mobileSheet ? 'text-base font-semibold' : 'text-sm font-semibold truncate',
              isActive ? 'text-brand' : 'text-gray-800',
            ].join(' ')}
          >
            {meta?.label}
          </p>
          <p className="text-xs text-gray-400">
            Página {index + 1}
            {isActive && mobileSheet ? ' · editando agora' : ''}
          </p>
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

function findStepperIndexFromPoint(x: number, y: number): number | null {
  const el = document.elementFromPoint(x, y)
  const row = el?.closest('[data-stepper-index]')
  if (!row) return null
  const index = Number(row.getAttribute('data-stepper-index'))
  return Number.isFinite(index) ? index : null
}

export function PageStepper({
  validationResults = [],
  hideMobileButton = false,
  externalMobileOpen,
  sidebarContent,
}: Props) {
  const {
    selectedPages,
    currentPageIndex,
    setCurrentPageIndex,
    removePage,
    reorderPages,
  } = useSiteBuilderStore()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const touchDragIndexRef = useRef<number | null>(null)
  const touchCleanupRef = useRef<(() => void) | null>(null)
  const mobileNavRef = useRef<HTMLElement>(null)

  if (externalMobileOpen) externalMobileOpen.current = () => setMobileOpen(true)

  useEffect(() => {
    return () => {
      touchCleanupRef.current?.()
      touchCleanupRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return
    requestAnimationFrame(() => {
      const el = mobileNavRef.current?.querySelector(
        `[data-stepper-index="${currentPageIndex}"]`,
      )
      el?.scrollIntoView({ block: 'nearest' })
    })
  }, [mobileOpen, currentPageIndex])

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

  function endTouchDrag() {
    touchCleanupRef.current?.()
    touchCleanupRef.current = null
    touchDragIndexRef.current = null
    setDragIndex(null)
  }

  function handleTouchStart(_e: React.TouchEvent, index: number) {
    endTouchDrag()

    touchDragIndexRef.current = index
    setDragIndex(index)

    function handleDocumentTouchMove(ev: TouchEvent) {
      if (touchDragIndexRef.current === null) return
      ev.preventDefault()

      const touch = ev.touches[0]
      if (!touch) return

      const targetIndex = findStepperIndexFromPoint(touch.clientX, touch.clientY)
      if (targetIndex === null || targetIndex === touchDragIndexRef.current) return

      reorderPages(touchDragIndexRef.current, targetIndex)
      touchDragIndexRef.current = targetIndex
      setDragIndex(targetIndex)
    }

    function handleDocumentTouchEnd() {
      endTouchDrag()
    }

    document.addEventListener('touchmove', handleDocumentTouchMove, { passive: false })
    document.addEventListener('touchend', handleDocumentTouchEnd)
    document.addEventListener('touchcancel', handleDocumentTouchEnd)

    touchCleanupRef.current = () => {
      document.removeEventListener('touchmove', handleDocumentTouchMove)
      document.removeEventListener('touchend', handleDocumentTouchEnd)
      document.removeEventListener('touchcancel', handleDocumentTouchEnd)
    }
  }

  function renderStepperItems(
    forceShowLabel: boolean,
    enableNativeDrag: boolean,
    mobileSheet = false,
  ) {
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
        enableNativeDrag={enableNativeDrag}
        mobileSheet={mobileSheet}
        onSelect={handleSelect}
        onRemove={removePage}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={() => setDragIndex(null)}
        onTouchStart={handleTouchStart}
      />
    ))
  }

  function renderMobileSidebarContent() {
    if (!sidebarContent) return null
    if (isValidElement(sidebarContent)) {
      return cloneElement(sidebarContent, { placement: 'above-right' } as Record<string, unknown>)
    }
    return sidebarContent
  }

  return (
    <>
      <aside className="hidden lg:block w-52 flex-shrink-0 sticky top-24 overflow-visible">
        <p className="text-xs font-semibold text-brand uppercase tracking-wide mb-4">
          Suas páginas
        </p>
        {sidebarContent && (
          <div className="relative z-[80] mb-6 overflow-visible">
            {sidebarContent}
          </div>
        )}
        <div className="mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Páginas do presente
          </p>
          {selectedPages.length > 1 && (
            <p className="mt-1 text-[11px] text-gray-400 flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Arraste para reordenar
            </p>
          )}
        </div>
        <nav aria-label="Navegação entre páginas" className="flex flex-col">
          {renderStepperItems(true, true)}
          {selectedPages.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Nenhuma página ainda.</p>
          )}
        </nav>
      </aside>

      {!hideMobileButton && <div className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir lista de páginas"
          className="flex items-center gap-2 bg-brand text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-lg hover:opacity-90 active:scale-95 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          Suas páginas
          {selectedPages.length > 0 && (
            <span className="bg-white/25 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center leading-none">
              {selectedPages.length}
            </span>
          )}
        </button>
      </div>}

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-black/40"
          onClick={() => setMobileOpen(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm rounded-t-2xl shadow-modal max-h-[88vh] flex flex-col animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex-shrink-0 px-5 pt-5 pb-3">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Suas páginas</h2>
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
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Páginas do presente
                </p>
                {selectedPages.length > 1 && (
                  <p className="mt-1 text-[11px] text-gray-400">Toque e segure a alça para reordenar.</p>
                )}
              </div>
            </div>
            <nav
              ref={mobileNavRef}
              aria-label="Navegação entre páginas"
              className="flex flex-col flex-1 min-h-0 overflow-y-auto px-5 gap-2 pb-4"
            >
              {renderStepperItems(true, false, true)}
            </nav>
            {sidebarContent && (
              <div className="relative z-[80] flex-shrink-0 px-5 pt-3 pb-5 border-t border-gray-100 overflow-visible">
                {renderMobileSidebarContent()}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
