import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { useCreateSite, useGetSiteBySlug } from '@/infrastructure/queries/siteQueries'

export function useSiteViewModel(slug?: string) {
  const store = useSiteBuilderStore()
  const createSite = useCreateSite()
  const siteQuery = useGetSiteBySlug(slug)

  async function submitSite(email: string) {
    return createSite.mutateAsync({
      ownerEmail: email,
      planType: store.planType ?? 'BASIC',
      pages: store.selectedPages,
      qrTemplate: store.qrTemplate,
    })
  }

  return {
    isLoading: createSite.isPending || siteQuery.isLoading,
    error: createSite.error?.message ?? siteQuery.error?.message ?? null,
    createdSite: createSite.data ?? siteQuery.data ?? null,
    ...store,
    submitSite,
  }
}
