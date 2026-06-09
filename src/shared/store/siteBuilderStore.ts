import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { PageItem, PageType, AnyPageData } from '@/core/entities/Page'
import { PAGE_TYPES_META, getPageTypeMaxInstances } from '@/core/entities/Page'
import { validateAllPages } from '@/core/validation/pageSchemas'
import type { PlanType } from '@/core/entities/Site'
import type { PageValidationResult } from '@/core/validation/pageSchemas'

const MAX_FREE_PAGES = 50  // users pick freely; plan is chosen at the end

export const BUILDER_STORAGE_KEY = 'heartlink-builder'

interface SiteBuilderState {
  email: string
  isEmailVerified: boolean

  planType: PlanType | null

  selectedPages: PageItem[]
  currentPageIndex: number
  validationResults: PageValidationResult[]

  qrTemplate: string
  qrCodeDetailed: boolean

  maxPages: number
}

interface SiteBuilderActions {
  setEmail: (email: string) => void
  setEmailVerified: (verified: boolean) => void
  setPlan: (plan: PlanType) => void

  addPage: (type: PageType) => void
  removePage: (id: string) => void
  reorderPages: (fromIndex: number, toIndex: number) => void
  updatePageData: (id: string, data: Partial<AnyPageData>) => void
  setCurrentPageIndex: (idx: number) => void

  setQrTemplate: (template: string, detailed: boolean) => void
  setValidationResults: (results: PageValidationResult[]) => void
  clearValidationResults: () => void

  reset: () => void
}

export const MAX_PAGES_PER_PLAN: Record<PlanType, number> = {
  BASIC: 10,
  INTERMEDIATE: 25,
  PREMIUM: 50,
}

const initialState: SiteBuilderState = {
  email: '',
  isEmailVerified: false,
  planType: null,
  selectedPages: [],
  currentPageIndex: 0,
  validationResults: [],
  qrTemplate: 'template-2',
  qrCodeDetailed: false,
  maxPages: MAX_FREE_PAGES,
}

export const useSiteBuilderStore = create<SiteBuilderState & SiteBuilderActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setEmail: (email) => set({ email }),
      setEmailVerified: (isEmailVerified) => set({ isEmailVerified }),

      setPlan: (planType) => set({ planType, maxPages: MAX_PAGES_PER_PLAN[planType] }),

      addPage: (type) => {
        const { selectedPages, maxPages } = get()
        if (selectedPages.length >= maxPages) return
        const typeMax = getPageTypeMaxInstances(type)
        if (typeMax !== undefined) {
          const typeCount = selectedPages.filter((p) => p.type === type).length
          if (typeCount >= typeMax) return
        }
        const meta = PAGE_TYPES_META.find((m) => m.type === type)!
        const newPage: PageItem = {
          id: nanoid(),
          type,
          order: selectedPages.length,
          data: { ...meta.defaultData },
        }
        set({ selectedPages: [...selectedPages, newPage] })
      },

      removePage: (id) => {
        const pages = get().selectedPages.filter((p) => p.id !== id)
        set({ selectedPages: pages.map((p, i) => ({ ...p, order: i })) })
      },

      reorderPages: (fromIndex, toIndex) => {
        const pages = [...get().selectedPages]
        const [moved] = pages.splice(fromIndex, 1)
        pages.splice(toIndex, 0, moved)
        set({ selectedPages: pages.map((p, i) => ({ ...p, order: i })) })
      },

      updatePageData: (id, data) => {
        set({
          selectedPages: get().selectedPages.map((p) =>
            p.id === id ? { ...p, data: { ...p.data, ...data } } : p,
          ),
        })
        if (get().validationResults.length > 0) {
          set({ validationResults: validateAllPages(get().selectedPages) })
        }
      },

      setCurrentPageIndex: (currentPageIndex) => set({ currentPageIndex }),

      setQrTemplate: (qrTemplate, qrCodeDetailed) => set({ qrTemplate, qrCodeDetailed }),

      setValidationResults: (validationResults) => set({ validationResults }),
      clearValidationResults: () => set({ validationResults: [] }),

      reset: () => set(initialState),
    }),
    {
      name: BUILDER_STORAGE_KEY,
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
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { validationResults, ...persisted } = state
        return persisted
      },
    },
  ),
)
