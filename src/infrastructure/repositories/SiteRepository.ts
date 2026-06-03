import { httpClient } from '../api/httpClient'
import type { ISiteRepository } from '@/core/repositories/ISiteRepository'
import type { Site } from '@/core/entities/Site'

export class SiteRepository implements ISiteRepository {
  async create(input: ISiteRepository.CreateInput): Promise<ISiteRepository.CreateOutput> {
    const { data } = await httpClient.post<ISiteRepository.CreateOutput>(
      '/api/v1/sites',
      input,
    )
    return data
  }

  async getBySlug({ slug }: ISiteRepository.GetBySlugInput): Promise<Site> {
    const { data } = await httpClient.get<Site>(`/api/v1/sites/${slug}`)
    return data
  }

  async listByEmail({ email }: ISiteRepository.ListByEmailInput): Promise<Site[]> {
    const { data } = await httpClient.get<Site[]>('/api/v1/sites', {
      params: { email },
    })
    return data
  }
}
