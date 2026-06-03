import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from '../utils/nanoid'
import type { PageItem, PageType, AnyPageData } from '@/core/entities/Page'
import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PlanType } from '@/core/entities/Site'

interface SiteBuilderState {
  // Step 1 – email (identity)
  email: string
  isEmailVerified: boolean

  // Step 2 – plan
  planType: PlanType | null

  // Step 3 – pages
  selectedPages: PageItem[]
  currentPageIndex: number

  // Step 4 – QR template
  qrTemplate: string

  // Derived
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

  setQrTemplate: (template: string) => void

  reset: () => void
}

const MAX_PAGES: Record<PlanType, number> = {
  BASIC: 5,
  INTERMEDIATE: 7,
  PREMIUM: 15,
}

const initialState: SiteBuilderState = {
  email: '',
  isEmailVerified: false,
  planType: null,
  selectedPages: [],
  currentPageIndex: 0,
  qrTemplate: 'template-2',
  maxPages: 5,
}

export const useSiteBuilderStore = create<SiteBuilderState & SiteBuilderActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setEmail: (email) => set({ email }),
      setEmailVerified: (isEmailVerified) => set({ isEmailVerified }),

      setPlan: (planType) => set({ planType, maxPages: MAX_PAGES[planType] }),

      addPage: (type) => {
        const { selectedPages, maxPages } = get()
        if (selectedPages.length >= maxPages) return
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
      },

      setCurrentPageIndex: (currentPageIndex) => set({ currentPageIndex }),

      setQrTemplate: (qrTemplate) => set({ qrTemplate }),

      reset: () => set(initialState),
    }),
    { name: 'heartlink-builder', partialize: (s) => ({ ...s }) },
  ),
)
