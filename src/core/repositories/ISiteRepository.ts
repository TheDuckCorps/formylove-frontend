import type { Site, PlanType } from '../entities/Site'
import type { PageItem } from '../entities/Page'

export namespace ISiteRepository {
  export interface CreateInput {
    ownerEmail: string
    planType: PlanType
    pages: PageItem[]
    qrTemplate: string
  }
  export interface CreateOutput {
    site: Site
    paymentId: string
  }
  export interface GetBySlugInput { slug: string }
  export interface ListByEmailInput { email: string }
}

export interface ISiteRepository {
  create(input: ISiteRepository.CreateInput): Promise<ISiteRepository.CreateOutput>
  getBySlug(input: ISiteRepository.GetBySlugInput): Promise<Site>
  listByEmail(input: ISiteRepository.ListByEmailInput): Promise<Site[]>
}
