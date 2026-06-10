import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BASE_COLORS,
  findColorSelection,
} from '@/shared/constants/colorPalette'

interface Props {
  value: string
  onChange: (hex: string) => void
  label?: string
  popoverClassName?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  anchorRef?: RefObject<HTMLElement | null>
  closeBoundaryRef?: RefObject<HTMLElement | null>
  showTrigger?: boolean
  /** Overrides responsive placement (e.g. `above-right` in mobile bottom sheet) */
  placement?: PopoverPlacement
}

type PopoverPlacement = 'left' | 'right' | 'below-right' | 'above-right'

function Swatch({
  color,
  selected,
  onClick,
  size,
}: {
  color: string
  selected: boolean
  onClick: () => void
  size: 'color' | 'shade'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        size === 'color' ? 'h-8 w-8' : 'h-5 w-5',
        'rounded-md transition-transform shrink-0',
        selected
          ? 'ring-[1.5px] ring-blue-600 ring-offset-1 scale-105'
          : 'hover:scale-105 hover:ring-1 hover:ring-gray-300 hover:ring-offset-1',
      ].join(' ')}
      style={{ backgroundColor: color }}
      aria-pressed={selected}
    />
  )
}

export function PaletteIcon() {
  return (
    <svg
      className="w-6 h-6 text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 640"
      fill="currentColor"
      aria-hidden
    >
      <path d="M576 320C576 320.9 576 321.8 576 322.7C575.6 359.2 542.4 384 505.9 384L408 384C381.5 384 360 405.5 360 432C360 435.4 360.4 438.7 361 441.9C363.1 452.1 367.5 461.9 371.8 471.8C377.9 485.6 383.9 499.3 383.9 513.8C383.9 545.6 362.3 574.5 330.5 575.8C327 575.9 323.5 576 319.9 576C178.5 576 63.9 461.4 63.9 320C63.9 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320zM192 352C192 334.3 177.7 320 160 320C142.3 320 128 334.3 128 352C128 369.7 142.3 384 160 384C177.7 384 192 369.7 192 352zM192 256C209.7 256 224 241.7 224 224C224 206.3 209.7 192 192 192C174.3 192 160 206.3 160 224C160 241.7 174.3 256 192 256zM352 160C352 142.3 337.7 128 320 128C302.3 128 288 142.3 288 160C288 177.7 302.3 192 320 192C337.7 192 352 177.7 352 160zM448 256C465.7 256 480 241.7 480 224C480 206.3 465.7 192 448 192C430.3 192 416 206.3 416 224C416 241.7 430.3 256 448 256z" />
    </svg>
  )
}

function PopoverArrow({
  placement,
  offsetX,
}: {
  placement: PopoverPlacement
  offsetX?: number
}) {
  if (placement === 'below-right') {
    return (
      <span
        className="absolute pointer-events-none left-[10px]"
        style={{ top: -6 }}
        aria-hidden
      >
        <span className="block w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-gray-300/80" />
        <span className="absolute left-[1px] top-[1px] w-0 h-0 border-x-[5px] border-x-transparent border-b-[5px] border-b-white" />
      </span>
    )
  }

  if (placement === 'above-right') {
    return (
      <span
        className="absolute pointer-events-none -translate-x-1/2"
        style={{ bottom: -6, left: offsetX ?? '50%' }}
        aria-hidden
      >
        <span className="block w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-gray-300/80" />
        <span className="absolute left-1/2 -translate-x-1/2 bottom-[1px] w-0 h-0 border-x-[5px] border-x-transparent border-t-[5px] border-t-white" />
      </span>
    )
  }

  const arrowTopClass = 'top-[10px]'

  if (placement === 'left') {
    return (
      <span
        className={`absolute pointer-events-none ${arrowTopClass}`}
        style={{ right: -6 }}
        aria-hidden
      >
        <span className="block w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-gray-300/80" />
        <span className="absolute right-[1px] top-0 w-0 h-0 border-y-[5px] border-y-transparent border-l-[5px] border-l-white" />
      </span>
    )
  }

  return (
    <span
      className={`absolute pointer-events-none ${arrowTopClass}`}
      style={{ left: -6 }}
      aria-hidden
    >
      <span className="block w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-gray-300/80" />
      <span className="absolute left-[1px] top-0 w-0 h-0 border-y-[5px] border-y-transparent border-r-[5px] border-r-white" />
    </span>
  )
}

function getPopoverPlacement(forced?: PopoverPlacement): PopoverPlacement {
  if (forced) return forced
  if (typeof window === 'undefined') return 'right'
  return window.matchMedia('(max-width: 1023px)').matches ? 'below-right' : 'right'
}

function clampHorizontalLeft(rect: DOMRect, popoverWidth: number, gap = 8) {
  let left = rect.right + gap
  if (left + popoverWidth > window.innerWidth - gap) {
    left = Math.max(gap, window.innerWidth - popoverWidth - gap)
  }
  return left
}

function clampCenteredLeft(centerX: number, popoverWidth: number, gap = 8) {
  const half = popoverWidth / 2
  const minCenter = gap + half
  const maxCenter = window.innerWidth - gap - half
  return Math.min(Math.max(centerX, minCenter), maxCenter)
}

export function ColorPicker({
  value,
  onChange,
  label,
  popoverClassName = 'z-[9999]',
  open: controlledOpen,
  onOpenChange,
  anchorRef,
  closeBoundaryRef,
  showTrigger = true,
  placement: forcedPlacement,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<PopoverPlacement>('right')
  const [arrowOffsetX, setArrowOffsetX] = useState<number | undefined>(undefined)

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  function setOpen(next: boolean) {
    if (!isControlled) setUncontrolledOpen(next)
    onOpenChange?.(next)
  }

  const initial = useMemo(() => findColorSelection(value), [value])
  const [colorIndex, setColorIndex] = useState(initial.colorIndex)
  const [shadeIndex, setShadeIndex] = useState(initial.shadeIndex)

  useEffect(() => {
    const next = findColorSelection(value)
    setColorIndex(next.colorIndex)
    setShadeIndex(next.shadeIndex)
  }, [value])

  useLayoutEffect(() => {
    if (!open) return

    function updatePosition() {
      const anchor = anchorRef?.current ?? rootRef.current?.querySelector('button')
      if (!anchor) return

      const rect = anchor.getBoundingClientRect()
      const gap = 8
      const popoverWidth = popoverRef.current?.offsetWidth ?? 152
      const nextPlacement = getPopoverPlacement(forcedPlacement)
      setPlacement(nextPlacement)

      if (nextPlacement === 'left') {
        setPopoverPos({
          top: rect.top,
          left: rect.left - gap,
        })
      } else if (nextPlacement === 'below-right') {
        setPopoverPos({
          top: rect.bottom + gap,
          left: clampHorizontalLeft(rect, popoverWidth, gap),
        })
      } else if (nextPlacement === 'above-right') {
        const rowRect = closeBoundaryRef?.current?.getBoundingClientRect() ?? rect
        const centerX = rowRect.left + rowRect.width / 2
        const anchorCenterX = rect.left + rect.width / 2
        const left = clampCenteredLeft(centerX, popoverWidth, gap)
        setPopoverPos({
          top: rect.top - gap,
          left,
        })
        setArrowOffsetX(anchorCenterX - left)
      } else {
        setPopoverPos({
          top: rect.top,
          left: rect.right + gap,
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open, anchorRef, closeBoundaryRef, forcedPlacement])

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: Event) {
      const target = event.target as Node
      if (rootRef.current?.contains(target)) return
      if (popoverRef.current?.contains(target)) return
      if (closeBoundaryRef?.current?.contains(target)) return
      if (anchorRef?.current?.contains(target)) return
      setOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown, { passive: true })
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [open, anchorRef, closeBoundaryRef])

  const activeColor = BASE_COLORS[colorIndex]
  const shades = activeColor.shades

  function selectColor(index: number) {
    setColorIndex(index)
    const nextShade = Math.min(shadeIndex, BASE_COLORS[index].shades.length - 1)
    setShadeIndex(nextShade)
    onChange(BASE_COLORS[index].shades[nextShade])
  }

  function selectShade(index: number) {
    setShadeIndex(index)
    onChange(shades[index])
  }

  const popoverTransform =
    placement === 'left'
      ? 'translateX(-100%)'
      : placement === 'above-right'
        ? 'translate(-50%, -100%)'
        : undefined

  const popover = (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className={['fixed', popoverClassName].join(' ')}
          style={{
            top: popoverPos.top,
            left: popoverPos.left,
            transform: popoverTransform,
          }}
        >
          <motion.div
            initial={{
              x: placement === 'left' ? 6 : placement === 'below-right' ? -4 : -6,
              y: placement === 'below-right' ? -4 : placement === 'above-right' ? 4 : 0,
              scale: 0.98,
            }}
            animate={{ x: 0, y: 0, scale: 1 }}
            exit={{
              x: placement === 'left' ? 4 : placement === 'below-right' ? -2 : -4,
              y: placement === 'below-right' ? -2 : placement === 'above-right' ? 2 : 0,
              scale: 0.98,
            }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="relative rounded-xl border border-gray-300/80 bg-white p-3 shadow-lg ring-1 ring-black/5"
          >
            <div ref={popoverRef}>
              <PopoverArrow placement={placement} offsetX={arrowOffsetX} />

              <div className="flex flex-col gap-2.5">
                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-semibold text-gray-600 px-0.5">Cores</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {BASE_COLORS.map((color, index) => (
                      <Swatch
                        key={color.id}
                        color={color.hex}
                        size="color"
                        selected={colorIndex === index}
                        onClick={() => selectColor(index)}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <p className="text-[11px] font-semibold text-gray-600 px-0.5">Tons</p>
                  <div className="flex gap-1.5">
                    {shades.map((shade, index) => (
                      <Swatch
                        key={`${activeColor.id}-shade-${index}`}
                        color={shade}
                        size="shade"
                        selected={shadeIndex === index}
                        onClick={() => selectShade(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const portalNode =
    typeof document !== 'undefined' ? createPortal(popover, document.body) : null

  if (!showTrigger && !label) {
    return portalNode
  }

  return (
    <div ref={rootRef} className="inline-flex flex-col items-start gap-1.5">
      {label && (
        <p className="text-sm font-semibold text-gray-800">{label}</p>
      )}

      {showTrigger && (
        <div className="relative inline-flex p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-8 h-8 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition shrink-0"
            style={{ boxShadow: `inset 0 0 0 2px ${value}` }}
            aria-label="Escolher cor"
            aria-expanded={open}
          >
            <PaletteIcon />
          </button>
        </div>
      )}

      {portalNode}
    </div>
  )
}
