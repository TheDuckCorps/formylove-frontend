import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { SpinWheelDisplay } from '../components/pages/SpinWheelDisplay'
import { MedidorAmorDisplay } from '../components/display/MedidorAmorDisplay'
import { ToqueContinuarDisplay } from '../components/display/ToqueContinuarDisplay'
import { MusicaFundoDisplay } from '../components/display/MusicaFundoDisplay'
import { PalavraSecretaDisplay } from '../components/display/PalavraSecretaDisplay'
import { QuizAfetivoDisplay } from '../components/display/QuizAfetivoDisplay'
import { RaspadinhaSurpresaDisplay } from '../components/display/RaspadinhaSurpresaDisplay'
import { MensagemMultimidiaDisplay } from '../components/display/MensagemMultimidiaDisplay'
import { SiteRepository } from '@/infrastructure/repositories/SiteRepository'
import { ROUTES } from '@/shared/constants/routes'

type LoadState = 'loading' | 'ready' | 'not-found' | 'error'

interface BackendPage {
  id: string
  type: string
  order: number
  content: Record<string, unknown>
}

interface BackendSite {
  id: string
  slug: string
  status: string
  plan?: string
  planType?: string
  pages?: BackendPage[]
}

interface RenderResult {
  node: React.ReactNode
  showNextButton?: boolean
}

function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 w-full max-w-sm mx-auto">
      {children}
    </div>
  )
}

function parseSecretContent(content: Record<string, unknown>) {
  const encryptedMessage = content.encryptedMessage as string | undefined
  if (!encryptedMessage) {
    return {
      hint: (content.hint as string) ?? '',
      secret: (content.word as string) ?? '',
    }
  }

  try {
    const parsed = JSON.parse(encryptedMessage) as { hint?: string; secret?: string }
    return {
      hint: parsed.hint ?? '',
      secret: parsed.secret ?? '',
    }
  } catch {
    return {
      hint: '',
      secret: '',
    }
  }
}

function renderPage(page: BackendPage, onNext: () => void): RenderResult {
  switch (page.type) {
    case 'SPIN_WHEEL': {
      const options = (page.content.options as string[]) ?? []
      return {
        node: (
          <PageCard>
            <SpinWheelDisplay options={options} />
          </PageCard>
        ),
      }
    }

    case 'TAP_TO_CONTINUE':
      return {
        node: (
          <PageCard>
            <ToqueContinuarDisplay phrase={(page.content.message as string) ?? ''} onContinue={onNext} />
          </PageCard>
        ),
        showNextButton: false,
      }

    case 'LOVE_METER':
      return {
        node: (
          <PageCard>
            <MedidorAmorDisplay
              question={(page.content.question as string) ?? 'O quanto você me ama?'}
              imageUrl={(page.content.imageDataUrl as string) ?? null}
            />
          </PageCard>
        ),
      }

    case 'MYSTERY_WORD':
    case 'SECRET_WORD': {
      const { hint, secret } = parseSecretContent(page.content)
      return {
        node: (
          <PageCard>
            <PalavraSecretaDisplay hint={hint} secret={secret} />
          </PageCard>
        ),
      }
    }

    case 'QUIZ': {
      const questions = (page.content.questions as Array<{
        text?: string
        options?: string[]
        answer?: string
      }>) ?? []
      const first = questions[0]
      const answers = (first?.options ?? []).map((opt, index) => ({
        id: `${page.id}-${index}`,
        text: opt,
        isCorrect: opt === first?.answer,
      }))
      return {
        node: (
          <PageCard>
            <QuizAfetivoDisplay
              question={first?.text ?? 'Pergunta'}
              answers={answers}
              onComplete={onNext}
            />
          </PageCard>
        ),
        showNextButton: false,
      }
    }

    case 'GALLERY':
      return {
        node: (
          <PageCard>
            <RaspadinhaSurpresaDisplay
              imageUrl={
                ((page.content.imageDataUrl as string) ??
                  (Array.isArray(page.content.images)
                    ? (page.content.images[0] as string)
                    : null))
              }
              title={(page.content.title as string) ?? ''}
            />
          </PageCard>
        ),
      }

    case 'MULTIMEDIA_MESSAGE':
      return {
        node: (
          <PageCard>
            <MensagemMultimidiaDisplay
              youtubeUrl={(page.content.mediaUrl as string) ?? ''}
              autoPlayDelayMs={3000}
            />
          </PageCard>
        ),
      }

    case 'FREE_DRAWING':
      return {
        node: (
          <PageCard>
            {(page.content.prompt as string) ? (
              <img
                src={page.content.prompt as string}
                alt="Desenho livre"
                className="w-full rounded-xl object-contain max-h-80"
              />
            ) : (
              <p className="text-sm text-gray-400 text-center">Nenhum desenho definido.</p>
            )}
          </PageCard>
        ),
      }

    default:
      return {
        node: (
          <PageCard>
            <p className="text-xs text-gray-400 text-center uppercase tracking-wide">{page.type}</p>
            <pre className="text-xs text-gray-500 mt-2 whitespace-pre-wrap break-all">
              {JSON.stringify(page.content, null, 2)}
            </pre>
          </PageCard>
        ),
      }
  }
}

export function SitePublicoView() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [site, setSite] = useState<BackendSite | null>(null)
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (!slug) { setLoadState('not-found'); return }

    const repo = new SiteRepository()
    repo.getBySlug({ slug })
      .then((data) => {
        setSite(data as unknown as BackendSite)
        setLoadState('ready')
        setCurrentIdx(0)
      })
      .catch(() => setLoadState('not-found'))
  }, [slug])

  if (loadState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient">
        <svg className="w-10 h-10 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
    )
  }

  if (loadState === 'not-found' || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">💔</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Presente não encontrado</h2>
          <p className="text-sm text-gray-400 mb-6">
            Este link pode ter expirado ou não existe.
          </p>
          <Button onClick={() => navigate(ROUTES.HOME)}>Criar meu presente</Button>
        </div>
      </div>
    )
  }

  const pages = (site.pages ?? []).sort((a, b) => a.order - b.order)
  const musicPages = pages.filter((p) => p.type === 'BACKGROUND_MUSIC')
  const storyPages = pages.filter((p) => p.type !== 'BACKGROUND_MUSIC')
  const currentPage = storyPages[currentIdx]

  function goNext() {
    setCurrentIdx((prev) => Math.min(prev + 1, storyPages.length - 1))
  }

  return (
    <div className="min-h-screen bg-page-gradient">
      {/* Header */}
      <div className="flex justify-center py-5">
        <Logo size="sm" />
      </div>

      {/* Pages */}
      <div className="max-w-lg mx-auto px-4 pb-16 flex flex-col gap-6">
        {musicPages[0] ? (
          <MusicaFundoDisplay
            youtubeUrl={(musicPages[0].content.trackUrl as string) ?? ''}
          />
        ) : null}

        {storyPages.length === 0 ? (
          <p className="text-center text-gray-400 text-sm mt-10">Este presente ainda não tem páginas.</p>
        ) : currentIdx >= storyPages.length ? (
          <PageCard>
            <p className="text-center text-lg font-semibold text-gray-800">Fim do presente</p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Esperamos que tenha amado essa surpresa.
            </p>
          </PageCard>
        ) : (
          <>
            <p className="text-center text-xs text-gray-400">
              Página {currentIdx + 1} de {storyPages.length}
            </p>

            {(() => {
              const render = renderPage(currentPage, goNext)
              return (
                <>
                  {render.node}
                  {render.showNextButton !== false && currentIdx < storyPages.length - 1 && (
                    <div className="flex justify-center">
                      <Button onClick={goNext}>
                        Próxima página →
                      </Button>
                    </div>
                  )}
                </>
              )
            })()}
          </>
        )}
      </div>

      {/* Footer watermark */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-400">
          Presente criado com{' '}
          <span
            className="text-brand font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(ROUTES.HOME)}
          >
            HeartLink
          </span>
        </p>
      </div>
    </div>
  )
}
