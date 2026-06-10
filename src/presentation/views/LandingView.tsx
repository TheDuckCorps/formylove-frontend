import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { FlowPageShell } from '../components/layout/FlowPageShell'
import { Button } from '../components/common/Button'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS } from '@/core/entities/Site'
import type { PlanType } from '@/core/entities/Site'

const TYPEWRITER_PHRASES = ['Seu Amor', 'Sua Família', 'Seu Amigo', 'Alguém Especial']

const CARD_RADIAL_BG =
  'radial-gradient(circle 38% at 50% 50%, rgba(252,228,243,0.38) 0%, transparent 100%), #ffffff'

function useTypewriter(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing')

  useEffect(() => {
    const current = phrases[phraseIndex]

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('waiting'), 1800)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'waiting') {
      const t = setTimeout(() => setPhase('deleting'), 400)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
        return () => clearTimeout(t)
      } else {
        setPhraseIndex((i) => (i + 1) % phrases.length)
        setPhase('typing')
      }
    }
  }, [displayed, phase, phraseIndex, phrases])

  return displayed
}

type HeartPosition = {
  top?: string
  bottom?: string
  left?: string
  right?: string
  size: number
  opacity: number
  rotate: number
}

const HERO_HEARTS: readonly HeartPosition[] = [
  { top: '4%', left: '2%', size: 32, opacity: 0.3, rotate: -15 },
  { top: '6%', right: '3%', size: 22, opacity: 0.28, rotate: 20 },
  { bottom: '6%', left: '5%', size: 26, opacity: 0.25, rotate: 8 },
  { bottom: '10%', right: '4%', size: 18, opacity: 0.32, rotate: -10 },
  { top: '45%', left: '0%', size: 14, opacity: 0.2, rotate: 5 },
]

const HOW_HEARTS: readonly HeartPosition[] = [
  { top: '5%', left: '1%', size: 30, opacity: 0.22, rotate: -8 },
  { top: '8%', right: '2%', size: 20, opacity: 0.2, rotate: 15 },
  { bottom: '8%', left: '2%', size: 24, opacity: 0.18, rotate: 10 },
  { bottom: '5%', right: '1%', size: 28, opacity: 0.22, rotate: -18 },
  { top: '50%', right: '0%', size: 16, opacity: 0.15, rotate: 6 },
]

function FloatingHearts({ hearts }: { hearts: readonly HeartPosition[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {hearts.map((heart, i) => (
        <img
          key={i}
          src="/heart.svg"
          alt=""
          className="absolute"
          style={{
            top: heart.top,
            bottom: heart.bottom,
            left: heart.left,
            right: heart.right,
            width: heart.size,
            height: heart.size,
            opacity: heart.opacity,
            transform: `rotate(${heart.rotate}deg)`,
          }}
        />
      ))}
    </div>
  )
}

interface PhoneMockupProps {
  className?: string
  mediaClassName?: string
  videoSrc?: string
  /** Scale factor for video content (e.g. 1.08 = slight zoom in) */
  videoZoom?: number
}

function PhoneMockup({
  className = '',
  mediaClassName = '',
  videoSrc,
  videoZoom = 1,
}: PhoneMockupProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoReady, setVideoReady] = useState(!videoSrc)

  useEffect(() => {
    setVideoReady(!videoSrc)
  }, [videoSrc])

  return (
    <div
      className={[
        'relative aspect-[1/2] w-32 sm:w-[176px] md:w-[192px] lg:w-[208px] rounded-3xl border-4 border-white shadow-card overflow-hidden flex-shrink-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.15rem]">
        {videoSrc ? (
          <>
            <div
              className={[
                'absolute inset-0 w-full h-full bg-gradient-to-b from-purple-800 to-purple-500 transition-opacity duration-300',
                videoReady ? 'opacity-0' : 'opacity-100',
              ].join(' ')}
              aria-hidden
            />
            {!videoReady && (
              <div
                className="absolute inset-0 z-[1] flex items-center justify-center bg-gradient-to-b from-purple-800/95 to-purple-500/95"
                aria-hidden
              >
                <svg
                  className="w-8 h-8 animate-spin text-white/90"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-90"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
            <video
              ref={videoRef}
              src={videoSrc}
              className={[
                'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
                videoReady ? 'opacity-100' : 'opacity-0',
              ].join(' ')}
              style={
                videoZoom !== 1
                  ? { transform: `scale(${videoZoom})`, transformOrigin: 'center' }
                  : undefined
              }
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onCanPlay={() => setVideoReady(true)}
              onLoadedData={() => setVideoReady(true)}
              aria-label="Demonstração do produto For My Love"
            />
          </>
        ) : (
          <div
            className={[
              'absolute inset-0 w-full h-full bg-gradient-to-b from-purple-800 to-purple-500',
              mediaClassName,
            ]
              .filter(Boolean)
              .join(' ')}
          />
        )}
      </div>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 h-1 rounded-full bg-white/60 z-10" />
    </div>
  )
}

const HOW_IT_WORKS: Array<{
  number: string
  title: string
  desc: string
  icon: React.ReactNode
}> = [
  {
    number: '1',
    title: 'Escolha suas páginas',
    desc: 'Selecione as páginas que tocam seu coração, com opções ilimitadas para expressar seus sentimentos.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="8" width="36" height="48" rx="4" fill="#E9D5FF" />
        <rect x="20" y="18" width="24" height="3" rx="1.5" fill="#A855F7" />
        <rect x="20" y="25" width="18" height="3" rx="1.5" fill="#C084FC" />
        <rect x="20" y="32" width="22" height="3" rx="1.5" fill="#C084FC" />
        <circle cx="44" cy="46" r="9" fill="#7C3AED" />
        <path d="M40 46l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'Personalize do seu jeito',
    desc: 'Dê vida à sua mensagem com textos, imagens e detalhes que tornam seu presente único.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="32" r="18" fill="#FBCFE8" />
        <path d="M24 36l8-16 8 16" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M26.5 31h11" stroke="#DB2777" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M42 20l4-4M44 22l-6 6" stroke="#DB2777" strokeWidth="2" strokeLinecap="round" />
        <circle cx="46" cy="18" r="2.5" fill="#EC4899" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'Faça o pagamento',
    desc: 'Invista um valor único de acordo com o tempo que seu presente especial ficará disponível.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="18" width="44" height="30" rx="5" fill="#BBF7D0" />
        <rect x="10" y="26" width="44" height="8" fill="#4ADE80" />
        <rect x="16" y="36" width="12" height="4" rx="2" fill="#16A34A" />
        <circle cx="46" cy="38" r="4" fill="#15803D" />
        <circle cx="52" cy="38" r="4" fill="#4ADE80" />
      </svg>
    ),
  },
  {
    number: '4',
    title: 'Receba seu link e QR Code',
    desc: 'Seu link e QR Code chegam direto ao seu email para compartilhar com quem você ama.',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="14" width="16" height="16" rx="2" fill="#FDE68A" />
        <rect x="18" y="18" width="8" height="8" rx="1" fill="#D97706" />
        <rect x="34" y="14" width="16" height="16" rx="2" fill="#FDE68A" />
        <rect x="38" y="18" width="8" height="8" rx="1" fill="#D97706" />
        <rect x="14" y="34" width="16" height="16" rx="2" fill="#FDE68A" />
        <rect x="18" y="38" width="8" height="8" rx="1" fill="#D97706" />
        <rect x="34" y="34" width="4" height="4" rx="1" fill="#D97706" />
        <rect x="46" y="34" width="4" height="4" rx="1" fill="#D97706" />
        <rect x="34" y="46" width="4" height="4" rx="1" fill="#D97706" />
        <rect x="46" y="46" width="4" height="4" rx="1" fill="#D97706" />
      </svg>
    ),
  },
]

const PLAN_FEATURES: Record<PlanType, string[]> = {
  BASIC: [
    'Até 10 páginas interativas',
    'Site ativo por 7 dias',
    'Link + QR Code por e-mail',
    'Todos os designs de QR Code inclusos',
  ],
  INTERMEDIATE: [
    'Até 25 páginas interativas',
    'Site ativo por 30 dias',
    'Link + QR Code por e-mail',
    'Todos os designs de QR Code inclusos',
  ],
  PREMIUM: [
    'Até 50 páginas interativas',
    'Site ativo por 1 ano',
    'Link + QR Code por e-mail',
    'Todos os designs de QR Code inclusos',
    'Acesso a todos os templates',
  ],
}

const PLAN_HIGHLIGHT: Record<PlanType, string | null> = {
  BASIC: null,
  INTERMEDIATE: 'Melhor custo-benefício',
  PREMIUM: 'Mais Popular',
}

const FAQ = [
  { q: 'O que posso enviar?', a: 'Você pode criar páginas com desenhos à mão, quizzes, raspadinhas, medidor de amor, música de fundo, vídeos e muito mais. Tudo personalizado para quem você ama!' },
  { q: 'Por quanto tempo minha página fica disponível?', a: 'Depende do plano escolhido: Básico (7 dias), Intermediário (30 dias) ou Premium (1 ano).' },
  { q: 'Posso editar meu presente depois de finalizar?', a: 'Após o pagamento confirmado, o conteúdo não pode ser alterado. Por isso, revise bem antes de finalizar.' },
  { q: 'Como faço para compartilhar meu presente?', a: 'Após a ativação, você receberá por e-mail o link direto e o QR Code. Basta enviar para quem você ama!' },
  { q: 'É necessário ter conta para criar?', a: 'Não! Apenas informe seu e-mail. Você receberá um código de confirmação e pronto — sem senhas.' },
]

export function LandingView() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const typedText = useTypewriter(TYPEWRITER_PHRASES)

  return (
    <FlowPageShell>
      <Header seamless />

      <main>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative z-10 w-full px-6 pt-8 sm:pt-10 lg:pt-16 pb-8 sm:pb-10 lg:pb-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-14 lg:gap-16 items-center">
          {/* Left: copy + CTA */}
          <div className="text-left order-1 min-w-0 lg:max-w-xl flex flex-col gap-5 sm:gap-6">
            <h1 className="text-5xl font-extrabold text-gray-800 leading-tight">
              <span className="text-brand">Surpreenda</span> com uma página{' '}
              <br className="hidden md:block" />
              tão única quanto
              <span className="block min-h-[1.2em]">
                <span className="text-brand italic">{typedText}</span>
                <span className="animate-blink ml-0.5 text-brand">|</span>
              </span>
            </h1>
            <p className="text-gray-500 text-sm md:text-base max-w-lg leading-relaxed">
              Crie uma{' '}
              <span className="text-brand font-semibold">experiência única e interativa</span> com raspadinhas,
              quizzes, músicas e muito mais —{' '}
              <span className="text-brand font-semibold">simples de criar</span>,{' '}
              <span className="text-brand font-semibold">inesquecível de receber</span>.
            </p>
            <Button size="lg" onClick={() => navigate(ROUTES.CRIAR)}>
              Criar meu presente agora
            </Button>
          </div>

          {/* Right: mockups + hearts */}
          <div className="relative order-2 min-w-0 w-full flex justify-center lg:justify-end pt-4 lg:pt-0">
            <div className="relative inline-flex max-w-full justify-center items-center min-h-[280px] min-[375px]:min-h-[320px] sm:min-h-[360px] md:min-h-[390px] lg:min-h-[400px] px-1 overflow-visible">
              <FloatingHearts hearts={HERO_HEARTS} />
              <PhoneMockup
                className="relative z-0 scale-[1] sm:scale-[0.84] opacity-75 -mr-4 min-[375px]:-mr-6 sm:-mr-10 lg:-mr-12 self-center"
                videoSrc="/medidor-de-amor.webm"
              />
              <PhoneMockup
                className="relative z-20 scale-[1.3] sm:scale-[1.14] md:scale-[1.16] lg:scale-[1.1] shadow-2xl self-center"
                videoSrc="/main-video.webm"
                videoZoom={1.3}
              />
              <PhoneMockup
                className="relative z-0 scale-[1] sm:scale-[0.84] opacity-75 -ml-4 min-[375px]:-ml-6 sm:-ml-10 lg:-ml-12 self-center"
                videoSrc="/medidor-de-amor-david.webm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="relative z-10 w-full px-6 pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-16 lg:pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <FloatingHearts hearts={HOW_HEARTS} />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-gray-800">
              Descubra como criar o{' '}
              <span className="text-brand">presente perfeito</span>{' '}
              para quem você ama
            </h2>
            <p className="text-center text-sm text-gray-500">
              Siga estes <span className="font-semibold text-brand">4 passos simples</span> e surpreenda aquela pessoa
              especial com uma lembrança única que ficará para sempre no coração
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.number}
                className="relative w-full flex flex-col items-center text-center rounded-2xl border-2 border-brand-100 p-6 pt-10 gap-4 shadow-sm hover:shadow-card transition-shadow"
                style={{ background: CARD_RADIAL_BG }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-[3px] border-brand flex items-center justify-center bg-white">
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                    <span className="text-white text-sm font-extrabold leading-none">{step.number}</span>
                  </div>
                </div>

                <div className="w-full max-w-[328px] min-h-[104px] rounded-2xl bg-white flex items-center justify-center p-4 shadow-sm border border-brand-50">
                  <div className="w-full h-full min-h-[80px] max-h-[104px] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>

                <h3 className="font-bold text-gray-800 text-base leading-snug">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => navigate(ROUTES.CRIAR)}>Criar agora</Button>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section className="relative z-10 w-full px-6 pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-16 lg:pb-16">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Planos e preços
            </h2>
            <p className="text-center text-sm text-gray-500">
              Escolha o plano que combina com a ocasião. Pagamento único via PIX.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PLANS.map((plan) => {
            const highlight = PLAN_HIGHLIGHT[plan.type]
            const features = PLAN_FEATURES[plan.type]
            const isPremium = plan.type === 'PREMIUM'

            return (
              <div
                key={plan.type}
                className={[
                  'relative flex flex-col rounded-2xl border-2 p-6 transition-all',
                  isPremium
                    ? 'border-brand bg-brand/5 shadow-card sm:scale-105 z-10'
                    : 'border-gray-200 bg-white',
                ].join(' ')}
              >
                {highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {highlight}
                  </span>
                )}

                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-800">{plan.label}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-brand">
                    {(plan.price / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">/ único</span>
                </div>

                <ul className="space-y-2 mb-8 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${f.includes('+R$') ? 'text-gray-300' : 'text-green-500'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={f.includes('+R$') ? 'text-gray-400' : ''}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isPremium ? 'brand' : 'outline'}
                  fullWidth
                  onClick={() => navigate(`${ROUTES.CRIAR}?plano=${plan.type}`)}
                >
                  Começar com {plan.label}
                </Button>
              </div>
            )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="relative z-10 w-full px-6 pt-8 pb-8 sm:pt-10 sm:pb-10 lg:pt-16 lg:pb-16">
        <div className="max-w-5xl mx-auto flex flex-col gap-8 sm:gap-10 md:gap-12 lg:gap-14">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 text-center">
            Perguntas Frequentes
          </h2>

          <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-12 items-start">
            {/* Animated illustration — desktop only, larger */}
            <div className="hidden md:flex md:w-96 lg:w-128 flex-shrink-0 justify-center md:sticky md:top-20">
              <img
                src="/questions-animate.svg"
                alt="Perguntas frequentes"
                className="w-full max-w-none select-none pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Accordion questions */}
            <div className="flex-1 w-full divide-y divide-gray-200">
              {FAQ.map((item, i) => (
                <div key={i} className="py-5">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 text-left group min-h-[2rem]"
                    aria-expanded={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-brand transition-colors flex-1">
                      {item.q}
                    </span>
                    <span
                      className="flex-shrink-0 w-7 h-7 rounded-full border-2 border-brand text-brand inline-flex items-center justify-center"
                      aria-hidden
                    >
                      {openFaq === i ? (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          aria-hidden
                        >
                          <path d="M18 6 6 18M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          aria-hidden
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 text-sm text-gray-500 animate-fade-in leading-relaxed pr-12">
                      {item.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      </main>
      <Footer seamless />
    </FlowPageShell>
  )
}
