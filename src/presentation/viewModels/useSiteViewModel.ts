import { useState } from 'react'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { SiteRepository } from '@/infrastructure/repositories/SiteRepository'
import type { Site } from '@/core/entities/Site'

export function useSiteViewModel() {
  const store = useSiteBuilderStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdSite, setCreatedSite] = useState<Site | null>(null)

  const siteRepo = new SiteRepository()

  async function submitSite(email: string) {
    setIsLoading(true)
    setError(null)
    try {
      const result = await siteRepo.create({
        ownerEmail: email,
        planType: store.planType ?? 'BASIC',
        pages: store.selectedPages,
        qrTemplate: store.qrTemplate,
      })
      setCreatedSite(result.site)
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar presente'
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchSite(slug: string) {
    setIsLoading(true)
    setError(null)
    try {
      const site = await siteRepo.getBySlug({ slug })
      setCreatedSite(site)
      return site
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Presente não encontrado'
      setError(msg)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // State
    isLoading,
    error,
    createdSite,
    // Builder store
    ...store,
    // Actions
    submitSite,
    fetchSite,
  }
}
