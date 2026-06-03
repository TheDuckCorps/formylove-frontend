import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META } from '@/core/entities/Page'

export function useEditorViewModel() {
  const {
    selectedPages,
    currentPageIndex,
    setCurrentPageIndex,
    updatePageData,
    removePage,
    reorderPages,
  } = useSiteBuilderStore()

  const currentPage = selectedPages[currentPageIndex] ?? null
  const totalPages = selectedPages.length
  const isFirst = currentPageIndex === 0
  const isLast = currentPageIndex === totalPages - 1

  function getCurrentMeta() {
    if (!currentPage) return null
    return PAGE_TYPES_META.find((m) => m.type === currentPage.type) ?? null
  }

  function getPageTitle(index: number) {
    const page = selectedPages[index]
    if (!page) return ''
    const meta = PAGE_TYPES_META.find((m) => m.type === page.type)
    return `${index + 1}. ${meta?.label ?? page.type}`
  }

  function goNext() {
    if (!isLast) setCurrentPageIndex(currentPageIndex + 1)
  }

  function goPrev() {
    if (!isFirst) setCurrentPageIndex(currentPageIndex - 1)
  }

  return {
    selectedPages,
    currentPage,
    currentPageIndex,
    totalPages,
    isFirst,
    isLast,
    getCurrentMeta,
    getPageTitle,
    goNext,
    goPrev,
    updatePageData,
    removePage,
    reorderPages,
  }
}
