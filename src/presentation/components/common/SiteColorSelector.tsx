import { useRef, useState } from 'react'
import { ColorPicker, PaletteIcon } from './ColorPicker'

type PopoverPlacement = 'left' | 'right' | 'below-right' | 'above-right'

interface Props {
  value: string
  onChange: (hex: string) => void
  className?: string
  title?: string
  placement?: PopoverPlacement
}

export function SiteColorSelector({
  value,
  onChange,
  className = '',
  title = 'Cor do presente',
  placement,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const iconAnchorRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          'relative z-[80] w-full flex items-center justify-between gap-2 text-left',
          'cursor-pointer transition hover:opacity-90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label={title}
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-gray-800">{title}</span>

        <span
          ref={iconAnchorRef}
          className="w-8 h-8 rounded-lg border border-gray-200 bg-white shadow-sm flex items-center justify-center shrink-0 pointer-events-none"
          style={{ boxShadow: `inset 0 0 0 2px ${value}` }}
          aria-hidden
        >
          <PaletteIcon />
        </span>
      </button>

      <ColorPicker
        value={value}
        onChange={onChange}
        open={open}
        onOpenChange={setOpen}
        anchorRef={iconAnchorRef}
        closeBoundaryRef={buttonRef}
        showTrigger={false}
        popoverClassName="z-[9999]"
        placement={placement}
      />
    </>
  )
}
