import type { PageItem } from './Page'

export type PlanType = 'BASIC' | 'INTERMEDIATE' | 'PREMIUM'
export type SiteStatus = 'ACTIVE' | 'BLOCKED' | 'EXPIRED' | 'PENDING_PAYMENT'

export interface SiteGlobalSettings {
  primaryColor: string
  backgroundUrl: string | null
  musicUrl: string | null
  transition: string | null
  qrTemplate?: string | null
}

export interface Plan {
  type: PlanType
  label: string
  price: number
  durationDays: number
  maxPages: number
  description: string
}

export const PLANS: Plan[] = [
  {
    type: 'BASIC',
    label: 'Básico',
    price: 1490,
    durationDays: 7,
    maxPages: 5,
    description: 'Até 5 páginas · válido por 7 dias',
  },
  {
    type: 'INTERMEDIATE',
    label: 'Intermediário',
    price: 2490,
    durationDays: 30,
    maxPages: 7,
    description: 'Até 7 páginas · válido por 30 dias',
  },
  {
    type: 'PREMIUM',
    label: 'Premium',
    price: 2990,
    durationDays: 365,
    maxPages: 15,
    description: 'Até 15 páginas · válido por 1 ano',
  },
]

export interface Site {
  id: string
  ownerEmail: string
  slug: string
  planType: PlanType
  status: SiteStatus
  pages: PageItem[]
  qrTemplate: string
  expirationDate: string
  createdAt: string
  updatedAt: string
  globalSettings?: SiteGlobalSettings
}
