import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { httpClient } from '@/infrastructure/api/httpClient'
import { Logo } from '../components/common/Logo'
import { SpinWheelDisplay } from '../components/pages/SpinWheelDisplay'
import { ROUTES } from '@/shared/constants/routes'

// ── Types ────────────────────────────────────────────────────────────────────

interface BackendPage {
  id: string
  type: string
  order: number
  content: Record<string, unknown>
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url)
    let id: string | null = null
    if (u.hostname === 'youtu.be') id = u.pathname.slice(1).split('?')[0]
    else if (u.hostname.includes('youtube.com')) id = u.searchParams.get('v')
    return id ? `https://www.youtube.com/embed/${id}` : null
  } catch {
    return null
  }
}

// ── Page renderers ────────────────────────────────────────────────────────────

function TapToContinuePage({ content, onNext }: { content: Record<string, unknown>; onNext: () => void }) {
  const message = (content.message as string) ?? ''
  return (
    <div className="flex flex-col items-center justify-center gap-12 text-center w-full max-w-sm min-h-[50vh] px-4">
      <p className="text-xl font-semibold text-gray-800 leading-relaxed">{message}</p>
      <button
        onClick={onNext}
        className="flex flex-col items-center gap-3 text-brand hover:opacity-70 transition-opacity"
      >
        <span className="text-sm font-semibold">Toque para continuar</span>
        <svg className="w-7 h-7 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}

function MysteryWordPage({ content }: { content: Record<string, unknown> }) {
  const word = (content.word as string) ?? ''
  const hint = (content.hint as string) ?? ''
  const [filled, setFilled] = useState(0)
  const total = 10
  const revealed = Math.ceil((filled / total) * word.length)
  const isComplete = filled === total

  return (
    <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm">
      <div>
        <h2 className="text-lg font-bold text-brand mb-2">💝 Medidor de Amor</h2>
        <p className="text-gray-700 text-base leading-relaxed">{hint}</p>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setFilled(i + 1)}
            className="text-3xl transition-transform active:scale-125 select-none"
          >
            {i < filled ? '❤️' : '🤍'}
          </button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap justify-center min-h-[2.5rem]">
        {word.split('').map((char, i) => (
          <span
            key={i}
            className={[
              'text-2xl font-bold border-b-2 min-w-[1.5rem] text-center transition-all duration-300',
              i < revealed ? 'text-brand border-brand' : 'text-gray-200 border-gray-200',
            ].join(' ')}
          >
            {i < revealed ? (char === ' ' ? ' ' : char) : ''}
          </span>
        ))}
      </div>

      {isComplete && (
        <div className="animate-fade-in bg-brand/10 border border-brand/30 rounded-2xl px-6 py-4">
          <p className="text-brand font-bold">🎉 Você sabe o quanto é amado!</p>
        </div>
      )}
    </div>
  )
}

function SecretWordPage({ content }: { content: Record<string, unknown> }) {
  const [revealed, setRevealed] = useState(false)
  let hint = ''
  let secret = ''
  try {
    const parsed = JSON.parse((content.encryptedMessage as string) ?? '{}')
    hint = parsed.hint ?? ''
    secret = parsed.secret ?? ''
  } catch {
    secret = (content.encryptedMessage as string) ?? ''
  }

  return (
    <div className="flex flex-col items-center gap-5 text-center w-full max-w-sm">
      <h2 className="text-lg font-bold text-brand">🔐 Palavra Secreta</h2>

      {hint && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 w-full">
          <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wider mb-1">Dica</p>
          <p className="text-base text-gray-800">{hint}</p>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 w-full">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Palavra secreta</p>
        <p
          className={[
            'text-2xl font-bold text-brand transition-all duration-500 select-none',
            revealed ? '' : 'blur-sm',
          ].join(' ')}
        >
          {secret || '—'}
        </p>
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)} className="btn-brand">
          Revelar palavra secreta 🔓
        </button>
      ) : (
        <p className="text-brand font-semibold animate-fade-in">🎉 Segredo revelado!</p>
      )}
    </div>
  )
}

interface QuizQuestion {
  text: string
  answer: string
  options: string[]
}

function QuizPage({ content }: { content: Record<string, unknown> }) {
  const questions = (content.questions as QuizQuestion[]) ?? []
  const [questionIdx, setQuestionIdx] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)

  if (questions.length === 0) return null

  const question = questions[questionIdx]
  const isCorrect = selected === question.answer
  const hasMore = questionIdx < questions.length - 1

  function handleSelect(opt: string) {
    if (showResult) return
    setSelected(opt)
    setShowResult(true)
  }

  function handleNext() {
    setQuestionIdx(i => i + 1)
    setSelected(null)
    setShowResult(false)
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="text-center">
        <h2 className="text-lg font-bold text-brand mb-1">🧠 Quiz Afetivo</h2>
        {questions.length > 1 && (
          <p className="text-xs text-gray-400">{questionIdx + 1} de {questions.length}</p>
        )}
      </div>

      <div className="bg-brand/5 rounded-2xl p-5">
        <p className="text-base font-semibold text-gray-800 text-center leading-relaxed">
          {question.text}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {question.options.map((opt) => {
          const isSelected = selected === opt
          const isRight = opt === question.answer && showResult
          const isWrong = isSelected && !isRight && showResult
          return (
            <button
              key={opt}
              onClick={() => handleSelect(opt)}
              disabled={showResult}
              className={[
                'w-full py-3 px-5 rounded-xl border-2 text-sm font-medium transition-all text-left',
                isRight
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : isWrong
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : isSelected
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand/30',
              ].join(' ')}
            >
              {opt}
              {isRight && ' ✓'}
              {isWrong && ' ✗'}
            </button>
          )
        })}
      </div>

      {showResult && (
        <div
          className={[
            'rounded-xl p-3 text-sm font-medium text-center animate-fade-in',
            isCorrect ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600',
          ].join(' ')}
        >
          {isCorrect ? '🎉 Correto!' : `😅 A resposta certa era: "${question.answer}"`}
        </div>
      )}

      {showResult && hasMore && (
        <button
          onClick={handleNext}
          className="text-brand font-semibold text-sm text-center hover:underline"
        >
          Próxima pergunta →
        </button>
      )}
    </div>
  )
}

function ScratchCardPage({ content }: { content: Record<string, unknown> }) {
  const imageUrl = ((content.images as string[]) ?? [])[0] ?? ''
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isDrawing = useRef(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || revealed) return
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    grad.addColorStop(0, '#d1d5db')
    grad.addColorStop(1, '#9ca3af')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = 'rgba(255,255,255,0.75)'
    ctx.font = 'bold 18px Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('🎟️  Raspe aqui!', canvas.width / 2, canvas.height / 2)
  }, [revealed])

  function getPos(clientX: number, clientY: number) {
    const canvas = canvasRef.current!
    const rect = canvas.getBoundingClientRect()
    return {
      x: (clientX - rect.left) * (canvas.width / rect.width),
      y: (clientY - rect.top) * (canvas.height / rect.height),
    }
  }

  function scratch(x: number, y: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath()
    ctx.arc(x, y, 22, 0, Math.PI * 2)
    ctx.fill()
    // Throttled progress check
    if (Math.random() < 0.12) {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let transparent = 0
      for (let i = 3; i < data.length; i += 4) if (data[i] < 128) transparent++
      if (transparent / (canvas.width * canvas.height) > 0.5) setRevealed(true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
      <h2 className="text-lg font-bold text-brand text-center">🎟️ Raspadinha</h2>
      <p className="text-sm text-gray-500 text-center">Raspe com o dedo para revelar a surpresa!</p>

      <div
        className="relative rounded-2xl overflow-hidden shadow-card"
        style={{ width: 280, height: 200 }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Surpresa"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-brand/10 flex items-center justify-center text-6xl">
            🎁
          </div>
        )}

        {!revealed && (
          <canvas
            ref={canvasRef}
            width={280}
            height={200}
            className="absolute inset-0 cursor-pointer"
            style={{ touchAction: 'none' }}
            onMouseDown={(e) => {
              isDrawing.current = true
              const p = getPos(e.clientX, e.clientY)
              scratch(p.x, p.y)
            }}
            onMouseMove={(e) => {
              if (!isDrawing.current) return
              const p = getPos(e.clientX, e.clientY)
              scratch(p.x, p.y)
            }}
            onMouseUp={() => { isDrawing.current = false }}
            onMouseLeave={() => { isDrawing.current = false }}
            onTouchStart={(e) => {
              isDrawing.current = true
              const t = e.touches[0]
              const p = getPos(t.clientX, t.clientY)
              scratch(p.x, p.y)
            }}
            onTouchMove={(e) => {
              if (!isDrawing.current) return
              const t = e.touches[0]
              const p = getPos(t.clientX, t.clientY)
              scratch(p.x, p.y)
            }}
            onTouchEnd={() => { isDrawing.current = false }}
          />
        )}

        {revealed && (
          <div className="absolute inset-0 flex items-end justify-center pb-3 bg-black/10">
            <span className="bg-white/90 text-brand font-bold text-sm px-3 py-1 rounded-full shadow animate-fade-in">
              🎉 Surpresa revelada!
            </span>
          </div>
        )}
      </div>

      {!revealed && (
        <button
          onClick={() => setRevealed(true)}
          className="text-xs text-gray-400 hover:text-brand transition"
        >
          Revelar tudo →
        </button>
      )}
    </div>
  )
}

function MultimediaPage({ content }: { content: Record<string, unknown> }) {
  const text = (content.text as string) ?? ''
  const mediaUrl = (content.mediaUrl as string) ?? ''
  const mediaType = (content.mediaType as string) ?? 'video'
  const embedUrl = getYouTubeEmbedUrl(mediaUrl)

  return (
    <div className="flex flex-col gap-4 w-full max-w-sm">
      <h2 className="text-lg font-bold text-brand text-center">🎬 Mensagem Especial</h2>

      {mediaType === 'video' && (
        <div
          className="rounded-2xl overflow-hidden shadow-card bg-black"
          style={{ aspectRatio: '16/9' }}
        >
          {embedUrl ? (
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <video
              src={mediaUrl}
              controls
              className="w-full h-full object-contain"
            />
          )}
        </div>
      )}

      {mediaType === 'image' && (
        <img
          src={mediaUrl}
          alt="Mensagem"
          className="w-full rounded-2xl shadow-card object-cover"
        />
      )}

      {text && (
        <p className="text-gray-700 text-base text-center leading-relaxed">{text}</p>
      )}
    </div>
  )
}

function BackgroundMusicPage({ content }: { content: Record<string, unknown> }) {
  const trackUrl = (content.trackUrl as string) ?? ''
  const title = (content.title as string) ?? 'Música especial'
  const embedUrl = getYouTubeEmbedUrl(trackUrl)

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      <div className="w-24 h-24 bg-brand/10 rounded-full flex items-center justify-center text-5xl">
        🎵
      </div>

      <div className="text-center">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">Uma música especial pra você</p>
      </div>

      {embedUrl ? (
        <div
          className="w-full rounded-2xl overflow-hidden shadow-card"
          style={{ aspectRatio: '16/9' }}
        >
          <iframe
            src={embedUrl}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      ) : trackUrl ? (
        <audio src={trackUrl} controls className="w-full" />
      ) : null}
    </div>
  )
}

function FreeDrawingPage({ content }: { content: Record<string, unknown> }) {
  const prompt = content.prompt as string | null

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <h2 className="text-lg font-bold text-brand">✏️ Desenho Especial</h2>

      {prompt ? (
        <img
          src={prompt}
          alt="Desenho"
          className="w-full rounded-2xl border border-gray-100 shadow-sm object-contain max-h-80"
        />
      ) : (
        <div className="w-full h-52 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center text-6xl">
          ✏️
        </div>
      )}
    </div>
  )
}

// ── Page dispatcher ───────────────────────────────────────────────────────────

function renderActivePage(page: BackendPage, onNext: () => void) {
  const { type, content } = page
  switch (type) {
    case 'SPIN_WHEEL':
      return <SpinWheelDisplay options={(content.options as string[]) ?? []} />
    case 'TAP_TO_CONTINUE':
      return <TapToContinuePage content={content} onNext={onNext} />
    case 'MYSTERY_WORD':
      return <MysteryWordPage content={content} />
    case 'SECRET_WORD':
      return <SecretWordPage content={content} />
    case 'QUIZ':
      return <QuizPage content={content} />
    case 'GALLERY':
      return <ScratchCardPage content={content} />
    case 'MULTIMEDIA_MESSAGE':
      return <MultimediaPage content={content} />
    case 'BACKGROUND_MUSIC':
      return <BackgroundMusicPage content={content} />
    case 'FREE_DRAWING':
      return <FreeDrawingPage content={content} />
    default:
      return null
  }
}

// ── Main view ─────────────────────────────────────────────────────────────────

export function SitePublicoView() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [pages, setPages] = useState<BackendPage[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    if (!slug) { setLoadState('error'); return }

    httpClient
      .get<{ site: Record<string, unknown>; pages: BackendPage[] }>(`/api/v1/sites/${slug}`)
      .then((res) => {
        const sorted = [...res.data.pages].sort((a, b) => a.order - b.order)
        setPages(sorted)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }, [slug])

  const handleNext = useCallback(() => {
    setCurrentIdx((i) => Math.min(i + 1, pages.length - 1))
  }, [pages.length])

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

  if (loadState === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-page-gradient px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">💔</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Presente não encontrado</h2>
          <p className="text-sm text-gray-400 mb-6">
            Este link pode ter expirado ou não existe.
          </p>
          <button onClick={() => navigate(ROUTES.HOME)} className="btn-brand">
            Criar meu presente
          </button>
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

  const currentPage = pages[currentIdx]
  const isFirst = currentIdx === 0
  const isLast = currentIdx === pages.length - 1

  return (
    <div className="min-h-screen bg-page-gradient flex flex-col">
      {/* Header */}
      <div className="flex justify-center pt-5 pb-2">
        <Logo size="sm" />
      </div>

      {/* Progress dots */}
      {pages.length > 1 && (
        <div className="flex justify-center gap-1.5 pb-2">
          {pages.map((_, i) => (
            <button
              key={i}
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
        <div key={currentPage.id} className="w-full flex justify-center animate-fade-in">
          {renderActivePage(currentPage, handleNext)}
        </div>
      </main>

      {/* Navigation */}
      {pages.length > 1 && (
        <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <button
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
            {currentIdx + 1} / {pages.length}
          </span>

          <button
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
