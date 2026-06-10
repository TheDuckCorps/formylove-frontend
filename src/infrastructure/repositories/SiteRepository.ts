import { httpClient } from '../api/httpClient'
import type { ISiteRepository } from '@/core/repositories/ISiteRepository'
import type { Site } from '@/core/entities/Site'
import type { PageType, AnyPageData } from '@/core/entities/Page'
import type {
  DesenhoLivreData,
  MedidorAmorData,
  ToqueContinuarData,
  MusicaFundoData,
  PalavraSecretaData,
  QuizAfetivoData,
  RaspadinhaSurpresaData,
  RoletaEscolhasData,
  MensagemMultimidiaData,
} from '@/core/entities/Page'

// Maps frontend page types to backend TemplateType enum values
const PAGE_TYPE_TO_BACKEND: Record<PageType, string> = {
  DESENHO_LIVRE: 'FREE_DRAWING',
  MEDIDOR_AMOR: 'LOVE_METER',
  TOQUE_CONTINUAR: 'TAP_TO_CONTINUE',
  MUSICA_FUNDO: 'BACKGROUND_MUSIC',
  PALAVRA_SECRETA: 'SECRET_WORD',
  QUIZ_AFETIVO: 'QUIZ',
  RASPADINHA_SURPRESA: 'GALLERY',
  ROLETA_ESCOLHAS: 'SPIN_WHEEL',
  MENSAGEM_MULTIMIDIA: 'MULTIMEDIA_MESSAGE',
}

function isValidUrl(s: string): boolean {
  try {
    new URL(s)
    return true
  } catch {
    return false
  }
}

function transformContent(type: PageType, data: AnyPageData): Record<string, unknown> {
  switch (type) {
    case 'DESENHO_LIVRE':
      return { prompt: (data as DesenhoLivreData).drawingDataUrl ?? null }

    case 'MEDIDOR_AMOR': {
      const d = data as MedidorAmorData
      return {
        question: d.question || 'O quanto você me ama?',
        imageDataUrl: d.imageUrl ?? null,
      }
    }

    case 'TOQUE_CONTINUAR':
      return { message: (data as ToqueContinuarData).phrase || ' ' }

    case 'MUSICA_FUNDO': {
      const d = data as MusicaFundoData
      const trackUrl = d.youtubeUrl || ''
      return {
        trackUrl: isValidUrl(trackUrl) ? trackUrl : 'https://www.youtube.com',
        title: 'Música de fundo',
      }
    }

    case 'PALAVRA_SECRETA': {
      const d = data as PalavraSecretaData
      return { encryptedMessage: JSON.stringify({ hint: d.hint, secret: d.secret }) }
    }

    case 'QUIZ_AFETIVO': {
      const d = data as QuizAfetivoData
      const correctAnswer =
        d.answers.find((a) => a.isCorrect)?.text || d.answers[0]?.text || 'Resposta certa'
      const options = d.answers.map((a) => a.text || 'Opção').filter(Boolean)
      while (options.length < 2) options.push(`Opção ${options.length + 1}`)
      return {
        questions: [
          { text: d.question || 'Pergunta', answer: correctAnswer, options },
        ],
      }
    }

    case 'RASPADINHA_SURPRESA': {
      const d = data as RaspadinhaSurpresaData
      return {
        imageDataUrl: d.imageUrl ?? null,
        title: d.title || '',
      }
    }

    case 'ROLETA_ESCOLHAS': {
      const d = data as RoletaEscolhasData
      const validOptions = d.options.filter((o) => o.trim().length > 0)
      while (validOptions.length < 2) validOptions.push(`Opção ${validOptions.length + 1}`)
      return {
        phrase: d.phrase || '',
        options: validOptions,
        colors: d.colors?.length ? d.colors : undefined,
      }
    }

    case 'MENSAGEM_MULTIMIDIA': {
      const d = data as MensagemMultimidiaData
      return {
        text: 'Mensagem em vídeo',
        mediaUrl: isValidUrl(d.youtubeUrl) ? d.youtubeUrl : 'https://www.youtube.com',
        mediaType: 'video',
      }
    }

    default:
      return {}
  }
}

interface RawGetSiteBySlugResponse {
  site?: {
    id: string
    slug: string
    status: string
    plan?: string
    globalSettings?: {
      primaryColor?: string
      backgroundUrl?: string | null
      musicUrl?: string | null
      transition?: string | null
      qrTemplate?: string | null
    }
    [key: string]: unknown
  }
  pages?: Array<{
    id: string
    type: string
    order: number
    content: Record<string, unknown>
  }>
}

function normalizeGetBySlugResponse(data: RawGetSiteBySlugResponse | Site): Site {
  if (!data || typeof data !== 'object' || !('site' in data) || !data.site) {
    return data as Site
  }

  return {
    ...(data.site as unknown as Site),
    planType: (data.site.plan ?? (data.site as { planType?: string }).planType) as Site['planType'],
    pages: (data.pages ?? []) as unknown as Site['pages'],
    globalSettings: data.site.globalSettings as Site['globalSettings'],
  }
}

export class SiteRepository implements ISiteRepository {
  async listTemplates(): Promise<ISiteRepository.BackendTemplate[]> {
    const { data } = await httpClient.get<ISiteRepository.BackendTemplate[]>('/api/v1/templates')
    return data
  }

  async create(input: ISiteRepository.CreateInput): Promise<ISiteRepository.CreateOutput> {
    const pages = input.pages.map((page) => ({
      type: PAGE_TYPE_TO_BACKEND[page.type],
      order: page.order,
      content: transformContent(page.type, page.data),
    }))

    const { data } = await httpClient.post<Site>('/api/v1/sites', {
      userEmail: input.ownerEmail,
      plan: input.planType,
      globalSettings: {
        primaryColor: input.siteColor ?? '#C62A87',
        backgroundUrl: null,
        musicUrl: null,
        transition: null,
        qrTemplate: input.qrTemplate ?? null,
      },
      pages,
    })

    return data
  }

  async getBySlug({ slug }: ISiteRepository.GetBySlugInput): Promise<Site> {
    const { data } = await httpClient.get<RawGetSiteBySlugResponse | Site>(`/api/v1/sites/${slug}`)
    return normalizeGetBySlugResponse(data)
  }

  async listByEmail({ email }: ISiteRepository.ListByEmailInput): Promise<ISiteRepository.ListByEmailOutput> {
    const { data } = await httpClient.get<ISiteRepository.ListByEmailOutput>('/api/v1/sites', {
      params: { email },
    })
    return data
  }
}
