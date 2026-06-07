import { useEffect, useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { SpinWheelDisplay } from '../components/display/SpinWheelDisplay'
import { MedidorAmorDisplay } from '../components/display/MedidorAmorDisplay'
import { ToqueContinuarDisplay } from '../components/display/ToqueContinuarDisplay'
import { MusicaFundoDisplay } from '../components/display/MusicaFundoDisplay'
import { PalavraSecretaDisplay } from '../components/display/PalavraSecretaDisplay'
import { QuizAfetivoDisplay } from '../components/display/QuizAfetivoDisplay'
import { RaspadinhaSurpresaDisplay } from '../components/display/RaspadinhaSurpresaDisplay'
import { MensagemMultimidiaDisplay } from '../components/display/MensagemMultimidiaDisplay'
import { useGetSiteBySlug } from '@/infrastructure/queries/siteQueries'
import { ROUTES } from '@/shared/constants/routes'
import { getFriendlyMessage } from '@/shared/errors/getFriendlyMessage'

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
  requiresCompletion?: boolean
}

const COMPLETION_PAGE_TYPES = new Set([
  'LOVE_METER',
  'MYSTERY_WORD',
  'SECRET_WORD',
  'QUIZ',
  'GALLERY',
  'SPIN_WHEEL',
])

function PageCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 w-full max-w-md lg:max-w-2xl mx-auto">
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

function renderPage(
  page: BackendPage,
  onNext: () => void,
  onPageComplete: () => void,
): RenderResult {
  switch (page.type) {
    case 'SPIN_WHEEL': {
      const options = (page.content.options as string[]) ?? []
      return {
        node: (
          <PageCard>
            <SpinWheelDisplay
              options={options}
              phrase={(page.content.phrase as string) ?? undefined}
              onComplete={onPageComplete}
            />
          </PageCard>
        ),
        requiresCompletion: true,
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
              onComplete={onPageComplete}
            />
          </PageCard>
        ),
        requiresCompletion: true,
      }

    case 'MYSTERY_WORD':
    case 'SECRET_WORD': {
      const { hint, secret } = parseSecretContent(page.content)
      return {
        node: (
          <PageCard>
            <PalavraSecretaDisplay hint={hint} secret={secret} onComplete={onPageComplete} />
          </PageCard>
        ),
        requiresCompletion: true,
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
              onComplete={onPageComplete}
            />
          </PageCard>
        ),
        showNextButton: false,
        requiresCompletion: true,
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
              onComplete={onPageComplete}
            />
          </PageCard>
        ),
        requiresCompletion: true,
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
                className="w-full rounded-xl object-contain max-h-96"
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
  const [currentIdx, setCurrentIdx] = useState(0)
  const [completedPageIds, setCompletedPageIds] = useState<Set<string>>(new Set())
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const directionRef = useRef(1)

  const { data: siteData, isLoading, error } = useGetSiteBySlug(slug)
  const site = siteData as unknown as BackendSite | undefined

  const loadState: LoadState = !slug
    ? 'not-found'
    : isLoading
    ? 'loading'
    : error
    ? (/não encontramos|não encontrad|404/i.test(getFriendlyMessage(error)) ? 'not-found' : 'error')
    : 'ready'

  const errorMessage = error ? getFriendlyMessage(error) : null

  const pages = [...(site?.pages ?? [])].sort((a, b) => a.order - b.order)
  const musicPages = pages.filter((p) => p.type === 'BACKGROUND_MUSIC')
  const storyPages = pages.filter((p) => p.type !== 'BACKGROUND_MUSIC')
  const storyCount = storyPages.length

  const handleNext = useCallback(() => {
    directionRef.current = 1
    setCurrentIdx((i) => Math.min(i + 1, storyCount - 1))
  }, [storyCount])

  const handlePrev = useCallback(() => {
    directionRef.current = -1
    setCurrentIdx((i) => Math.max(i - 1, 0))
  }, [])

  const markPageComplete = useCallback((pageId: string) => {
    setCompletedPageIds((prev) => {
      if (prev.has(pageId)) return prev
      const next = new Set(prev)
      next.add(pageId)
      return next
    })
  }, [])

  const currentPage = storyPages[currentIdx]
  const isFirst = currentIdx === 0
  const isLast = currentIdx === storyCount - 1


  if (loadState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient">
        <div className="relative flex items-center justify-center">
          {/* Ripple rings */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute rounded-full border-2 border-brand"
              initial={{ opacity: 0.6, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2.4 }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                delay: i * 0.5,
                ease: 'easeOut',
              }}
              style={{ width: 48, height: 48 }}
            />
          ))}
          {/* Heartbeat */}
          <motion.svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-12 h-12 text-brand relative z-10 drop-shadow-md"
            animate={{
              scale: [1, 1.25, 1, 1.15, 1],
            }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: 'easeInOut',
              times: [0, 0.2, 0.4, 0.6, 1],
            }}
          >
            <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
          </motion.svg>
        </div>
      </div>
    )
  }

  if (loadState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient px-6">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Ops, algo deu errado</h2>
          <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
          <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
        </div>
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

  const sitePlan = (site.planType ?? site.plan) as string | undefined
  const showLeadCta =
    isLast && (sitePlan === 'BASIC' || sitePlan === 'INTERMEDIATE')

  const isCurrentComplete = currentPage
    ? completedPageIds.has(currentPage.id)
    : false

  return (
    <div className="min-h-screen bg-page-gradient flex flex-col">
      {musicPages[0] ? (
        <MusicaFundoDisplay
          youtubeUrl={(musicPages[0].content.trackUrl as string) ?? ''}
        />
      ) : null}

      <div className="flex justify-center pt-5 pb-2 relative z-10 bg-page-gradient/80">
        <Logo size="sm" />
      </div>

      {storyCount > 1 && (
        <div className="flex justify-center gap-1.5 pb-2 relative z-10">
          {storyPages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { directionRef.current = i > currentIdx ? 1 : -1; setCurrentIdx(i) }}
              aria-label={`Ir para página ${i + 1}`}
              className={[
                'h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
                i === currentIdx ? 'w-6 bg-brand' : 'w-1.5 bg-gray-300 hover:bg-gray-400',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto overflow-x-hidden">
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
          <AnimatePresence mode="wait" custom={directionRef.current}>
          <motion.div
            key={currentPage.id}
            custom={directionRef.current}
            variants={{
              enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (dir: number) => ({ x: dir > 0 ? '-60%' : '60%', opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
            className="w-full flex flex-col items-center gap-6"
          >
            {(() => {
              const onPageComplete = () => markPageComplete(currentPage.id)
              const render = renderPage(currentPage, handleNext, onPageComplete)
              const needsCompletion = render.requiresCompletion ?? COMPLETION_PAGE_TYPES.has(currentPage.type)
              const canShowNext =
                render.showNextButton !== false &&
                !isLast &&
                (!needsCompletion || isCurrentComplete)

              return (
                <>
                  {render.node}
                  {canShowNext && (
                    <div className="flex justify-center">
                      <Button onClick={handleNext}>
                        Próxima página →
                      </Button>
                    </div>
                  )}
                  {showLeadCta && (
                    <button
                      type="button"
                      onClick={() => navigate(ROUTES.HOME)}
                      className="text-xs text-brand underline hover:text-brand/80 transition mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
                    >
                      Crie um presente inesquecível como este no For My Love →
                    </button>
                  )}
                </>
              )
            })()}
          </motion.div>
          </AnimatePresence>
        )}
      </main>

      {storyCount > 1 && (
        <div className="fixed left-3 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={isFirst}
            aria-label="Página anterior"
            className="w-9 h-9 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isLast}
            aria-label="Próxima página"
            className="w-9 h-9 flex items-center justify-center text-gray-400 disabled:opacity-20 hover:text-brand transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      )}

      <div className="text-center py-3">
        <p className="text-xs text-gray-400">
          Criado com{' '}
          <span
            className="text-brand font-semibold cursor-pointer hover:underline"
            onClick={() => navigate(ROUTES.HOME)}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(ROUTES.HOME)}
          >
            For My Love
          </span>
        </p>
      </div>
    </div>
  )
}
