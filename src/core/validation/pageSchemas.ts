import { z } from 'zod'
import type { PageItem, PageType } from '@/core/entities/Page'
import { PAGE_TYPES_META } from '@/core/entities/Page'

function isValidYoutubeUrl(url: string): boolean {
  if (!url.trim()) return false
  try {
    const parsed = new URL(url.trim())
    return (
      parsed.hostname.includes('youtube.com') ||
      parsed.hostname.includes('youtu.be') ||
      parsed.hostname.includes('youtube-nocookie.com')
    )
  } catch {
    return false
  }
}

const youtubeUrlSchema = z
  .string()
  .trim()
  .min(1, 'Cole o link do YouTube aqui')
  .refine(isValidYoutubeUrl, 'Esse link não parece ser do YouTube')

const desenhoLivreSchema = z.object({
  drawingDataUrl: z.string().nullable().refine((v) => !!v, 'Faça um desenho antes de continuar'),
})

const medidorAmorSchema = z.object({
  question: z.string().trim().min(1, 'Escreva a pergunta do medidor'),
  imageUrl: z.string().nullable().refine((v) => !!v, 'Adicione uma imagem'),
})

const toqueContinuarSchema = z.object({
  phrase: z.string().trim().min(1, 'Escreva a frase que aparecerá na tela'),
})

const musicaFundoSchema = z.object({
  youtubeUrl: youtubeUrlSchema,
})

const palavraSecretaSchema = z.object({
  hint: z.string().trim().min(1, 'Escreva uma dica para ajudar'),
  secret: z.string().trim().min(1, 'Escreva a palavra ou frase secreta'),
})

const quizAfetivoSchema = z
  .object({
    question: z.string().trim().min(1, 'Escreva a pergunta do quiz'),
    answers: z.array(
      z.object({
        id: z.string(),
        text: z.string().trim().min(1, 'Preencha todas as opções'),
        isCorrect: z.boolean(),
      }),
    ),
  })
  .superRefine((data, ctx) => {
    const correctCount = data.answers.filter((a) => a.isCorrect).length
    if (correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Marque exatamente uma opção como correta',
        path: ['answers'],
      })
    }
    if (data.answers.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Adicione pelo menos 2 opções',
        path: ['answers'],
      })
    }
  })

const raspadinhaSchema = z.object({
  imageUrl: z.string().nullable().refine((v) => !!v, 'Adicione a imagem da surpresa'),
  title: z.string().optional(),
})

const roletaSchema = z
  .object({
    phrase: z.string().trim().min(1, 'Escreva a frase acima da roleta'),
    options: z.array(z.string()),
  })
  .superRefine((data, ctx) => {
    const filled = data.options.filter((o) => o.trim().length > 0)
    if (filled.length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Adicione pelo menos 2 opções preenchidas',
        path: ['options'],
      })
    }
  })

const mensagemMultimidiaSchema = z.object({
  youtubeUrl: youtubeUrlSchema,
})

const SCHEMAS: Record<PageType, z.ZodType> = {
  DESENHO_LIVRE: desenhoLivreSchema,
  MEDIDOR_AMOR: medidorAmorSchema,
  TOQUE_CONTINUAR: toqueContinuarSchema,
  MUSICA_FUNDO: musicaFundoSchema,
  PALAVRA_SECRETA: palavraSecretaSchema,
  QUIZ_AFETIVO: quizAfetivoSchema,
  RASPADINHA_SURPRESA: raspadinhaSchema,
  ROLETA_ESCOLHAS: roletaSchema,
  MENSAGEM_MULTIMIDIA: mensagemMultimidiaSchema,
}

export interface PageValidationResult {
  pageId: string
  pageType: PageType
  pageLabel: string
  pageIndex: number
  isValid: boolean
  fieldErrors: Record<string, string>
}

function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path.join('.') || '_root'
    if (!out[key]) out[key] = issue.message
  }
  return out
}

export function validatePage(page: PageItem, pageIndex: number): PageValidationResult {
  const meta = PAGE_TYPES_META.find((m) => m.type === page.type)
  const schema = SCHEMAS[page.type]
  const result = schema.safeParse(page.data)
  const pageLabel = meta?.label ?? page.type

  if (result.success) {
    return {
      pageId: page.id,
      pageType: page.type,
      pageLabel,
      pageIndex,
      isValid: true,
      fieldErrors: {},
    }
  }

  return {
    pageId: page.id,
    pageType: page.type,
    pageLabel,
    pageIndex,
    isValid: false,
    fieldErrors: flattenZodErrors(result.error),
  }
}

export function validateAllPages(pages: PageItem[]): PageValidationResult[] {
  return pages.map((page, index) => validatePage(page, index))
}

export function getFirstInvalidPage(results: PageValidationResult[]): PageValidationResult | null {
  return results.find((r) => !r.isValid) ?? null
}
