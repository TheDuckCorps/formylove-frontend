import { useQuery, useMutation } from '@tanstack/react-query'
import { SiteRepository } from '../repositories/SiteRepository'
import type { ISiteRepository } from '@/core/repositories/ISiteRepository'

const repo = new SiteRepository()

export const siteKeys = {
  bySlug: (slug: string) => ['sites', 'slug', slug] as const,
  byEmail: (email: string) => ['sites', 'email', email] as const,
}

export function useGetSiteBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: siteKeys.bySlug(slug ?? ''),
    queryFn: () => repo.getBySlug({ slug: slug! }),
    enabled: !!slug,
    retry: false,
    staleTime: Infinity,
  })
}

export function useListSitesByEmail(email: string) {
  return useQuery({
    queryKey: siteKeys.byEmail(email),
    queryFn: () => repo.listByEmail({ email }),
    enabled: !!email,
    retry: false,
    staleTime: 0,
  })
}

export function useListSitesByEmailMutation() {
  return useMutation({
    mutationFn: ({ email }: ISiteRepository.ListByEmailInput) => repo.listByEmail({ email }),
  })
}

export function useCreateSite() {
  return useMutation({
    mutationFn: (input: ISiteRepository.CreateInput) => repo.create(input),
  })
}
