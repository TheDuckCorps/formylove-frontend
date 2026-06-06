import type { PlanType } from '@/core/entities/Site'
import { ROUTES } from './routes'

export const CREATION_STEPS = [
  { step: 1, label: 'Páginas', route: ROUTES.CRIAR },
  { step: 2, label: 'Editar', route: ROUTES.CRIAR_EDITOR },
  { step: 3, label: 'Capa', route: ROUTES.CRIAR_QRCODE },
  { step: 4, label: 'Plano', route: ROUTES.CRIAR_PLANO },
  { step: 5, label: 'Pagamento', route: ROUTES.CRIAR_PAGAMENTO },
] as const

export function canNavigateToCreationStep(
  targetStep: number,
  selectedPagesCount: number,
  planType: PlanType | null,
): boolean {
  if (targetStep < 1 || targetStep > CREATION_STEPS.length) return false
  if (targetStep === 1) return true
  if (selectedPagesCount === 0) return false
  if (targetStep === 5) return planType !== null
  return true
}
