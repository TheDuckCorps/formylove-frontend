import { useEffect, useState, useCallback } from 'react'
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

  const pages = [...(site?.pages ?? [])].sort((a, b) => a.order - b.order)
  const musicPages = pages.filter((p) => p.type === 'BACKGROUND_MUSIC')
  const storyPages = pages.filter((p) => p.type !== 'BACKGROUND_MUSIC')
  const storyCount = storyPages.length

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => Math.min(i + 1, storyCount - 1))
  }, [storyCount])

  const handlePrev = useCallback(() => {
    setCurrentIdx((i) => Math.max(i - 1, 0))
  }, [])

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

  if (pages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🎁</div>
          <h2 className="text-xl font-bold text-gray-700">Este presente está vazio</h2>
          <p className="text-sm text-gray-400 mt-2">Nenhuma página configurada ainda.</p>
        </div>
      </div>
    )
  }

  const currentPage = storyPages[currentIdx]
  const isFirst = currentIdx === 0
  const isLast = currentIdx === storyCount - 1

  return (
    <div className="min-h-screen bg-page-gradient flex flex-col">
      {musicPages[0] ? (
        <MusicaFundoDisplay
          youtubeUrl={(musicPages[0].content.trackUrl as string) ?? ''}
        />
      ) : null}

      {/* Header */}
      <div className="flex justify-center pt-5 pb-2">
        <Logo size="sm" />
      </div>

      {/* Progress dots */}
      {storyCount > 1 && (
        <div className="flex justify-center gap-1.5 pb-2">
          {storyPages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentIdx(i)}
              aria-label={`Ir para página ${i + 1}`}
              className={[
                'h-1.5 rounded-full transition-all duration-300',
                i === currentIdx ? 'w-6 bg-brand' : 'w-1.5 bg-gray-300 hover:bg-gray-400',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      {/* Page content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto">
        {storyCount === 0 ? (
          <p className="text-center text-gray-400 text-sm">Este presente ainda não tem páginas.</p>
        ) : currentIdx >= storyCount ? (
          <PageCard>
            <p className="text-center text-lg font-semibold text-gray-800">Fim do presente</p>
            <p className="text-center text-sm text-gray-500 mt-2">
              Esperamos que tenha amado essa surpresa.
            </p>
          </PageCard>
        ) : (
          <div key={currentPage.id} className="w-full flex flex-col items-center gap-6 animate-fade-in">
            {(() => {
              const render = renderPage(currentPage, handleNext)
              return (
                <>
                  {render.node}
                  {render.showNextButton !== false && !isLast && (
                    <div className="flex justify-center">
                      <Button onClick={handleNext}>
                        Próxima página →
                      </Button>
                    </div>
                  )}
                </>
              )
            })()}
          </div>
        )}
      </main>

      {/* Navigation */}
      {storyCount > 1 && (
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            aria-label="Página anterior"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:border-brand hover:text-brand transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <span className="text-xs text-gray-400 font-medium tabular-nums">
            {currentIdx + 1} / {storyCount}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLast}
            aria-label="Próxima página"
            className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 hover:border-brand hover:text-brand transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Watermark */}
      <div className="text-center py-3">
        <p className="text-xs text-gray-400">
          Criado com{' '}
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
