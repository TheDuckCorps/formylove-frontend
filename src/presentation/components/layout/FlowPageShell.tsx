import type { ReactNode } from 'react'
import {
  FLOW_BOTTOM_ACCENT,
  FLOW_CENTER_ACCENT,
  FLOW_PAGE_BACKGROUND,
  FLOW_TOP_ACCENT,
} from '@/shared/constants/flowPageBackground'

interface Props {
  children: ReactNode
  className?: string
}

export function FlowPageShell({ children, className = '' }: Props) {
  return (
    <div
      className={['min-h-screen flex flex-col relative overflow-hidden', className]
        .filter(Boolean)
        .join(' ')}
      style={{ background: FLOW_PAGE_BACKGROUND }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: FLOW_CENTER_ACCENT }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 top-0 h-[20rem] pointer-events-none"
        style={{ background: FLOW_TOP_ACCENT }}
        aria-hidden
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[24rem] pointer-events-none"
        style={{ background: FLOW_BOTTOM_ACCENT }}
        aria-hidden
      />
      <div className="relative z-10 flex flex-col flex-1 min-h-screen">{children}</div>
    </div>
  )
}
