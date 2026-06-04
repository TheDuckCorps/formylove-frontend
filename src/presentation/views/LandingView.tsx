import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS } from '@/core/entities/Site'
import type { PlanType } from '@/core/entities/Site'

const TYPEWRITER_PHRASES = ['Seu Amor', 'Sua Família', 'Seu Amigo', 'Alguém Especial']

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

const HOW_IT_WORKS = [
  { number: '01', title: 'Escolha suas páginas', desc: 'Selecione as páginas interativas que deseja incluir no seu presente personalizado.', icon: '📄' },
  { number: '02', title: 'Personalize seu site', desc: 'Adicione textos, fotos, músicas e muito mais para tornar único.', icon: '✏️' },
  { number: '03', title: 'Faça o pagamento', desc: 'Pagamento simples e seguro via Pix. Rápido e sem complicações.', icon: '💳' },
  { number: '04', title: 'Receba seu link e QR Code', desc: 'Receba no e-mail o link e o QR Code para compartilhar.', icon: '🔗' },
]

const PLAN_FEATURES: Record<PlanType, string[]> = {
  BASIC: [
    'Até 5 páginas interativas',
    'Site ativo por 3 dias',
    'Link + QR Code por e-mail',
    'Design básico do QR Code',
    'QR Code premium +R$2,00',
  ],
  INTERMEDIATE: [
    'Até 7 páginas interativas',
    'Site ativo por 7 dias',
    'Link + QR Code por e-mail',
    'Design básico do QR Code',
    'QR Code premium +R$2,00',
  ],
  PREMIUM: [
    'Até 15 páginas interativas',
    'Site ativo por 30 dias',
    'Link + QR Code por e-mail',
    'Design premium do QR Code incluso',
    'Acesso a todos os templates',
  ],
}

const PLAN_HIGHLIGHT: Record<PlanType, string | null> = {
  BASIC: null,
  INTERMEDIATE: 'Mais popular',
  PREMIUM: 'Mais completo',
}

const FAQ = [
  { q: 'O que posso enviar?', a: 'Você pode criar páginas com desenhos à mão, quizzes, raspadinhas, medidor de amor, música de fundo, vídeos e muito mais. Tudo personalizado para quem você ama!' },
  { q: 'Por quanto tempo minha página fica disponível?', a: 'Depende do plano escolhido: Básico (3 dias), Intermediário (7 dias) ou Premium (30 dias).' },
  { q: 'Posso editar meu presente depois de finalizar?', a: 'Após o pagamento confirmado, o conteúdo não pode ser alterado. Por isso, revise bem antes de finalizar.' },
  { q: 'Como faço para compartilhar meu presente?', a: 'Após a ativação, você receberá por e-mail o link direto e o QR Code. Basta enviar para quem você ama!' },
  { q: 'É necessário ter conta para criar?', a: 'Não! Apenas informe seu e-mail. Você receberá um código de confirmação e pronto — sem senhas.' },
]

export function LandingView() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const typedText = useTypewriter(TYPEWRITER_PHRASES)

  return (
    <div className="page-wrapper">
      <Header />

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-6 pt-14 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
          <span className="text-brand">Surpreenda</span> com uma página tão{' '}
          <br className="hidden md:block" />
          única quanto{' '}
          <span className="text-brand italic">{typedText}</span>
          <span className="animate-blink ml-0.5">|</span>
        </h1>
        <p className="text-gray-500 text-sm max-w-xl mx-auto mb-6">
          Crie um site interativo personalizado para quem você ama. Escolha as
          páginas, personalize cada detalhe e compartilhe via link ou QR Code.
          Simples, rápido e inesquecível.
        </p>
        <Button size="lg" onClick={() => navigate(ROUTES.CRIAR)}>
          Criar meu presente agora
        </Button>

        {/* Phone mockups */}
        <div className="mt-14 flex justify-center items-end gap-4">
          {[
            { scale: 'scale-90 opacity-70', z: 'z-0' },
            { scale: 'scale-105 shadow-2xl', z: 'z-10' },
            { scale: 'scale-90 opacity-70', z: 'z-0' },
          ].map((s, i) => (
            <div
              key={i}
              className={`${s.scale} ${s.z} w-32 md:w-44 h-64 md:h-80 rounded-3xl bg-gradient-to-b from-purple-800 to-purple-500 border-4 border-white shadow-card flex items-end justify-center pb-4 transition-transform`}
            >
              <div className="w-1/3 h-1 rounded-full bg-white opacity-60" />
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Descubra como criar o{' '}
          <span className="text-brand">presente perfeito</span> para quem você ama
        </h2>
        <p className="text-center text-sm text-gray-500 mb-10">
          Siga os passos abaixo e monte seu site personalizado em minutos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.number} className="flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-brand-50 flex items-center justify-center text-2xl">
                {step.icon}
              </div>
              <span className="text-xs font-bold text-brand">{step.number}</span>
              <h3 className="font-semibold text-gray-800 text-sm">{step.title}</h3>
              <p className="text-xs text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button onClick={() => navigate(ROUTES.CRIAR)}>Criar agora</Button>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Planos e preços
        </h2>
        <p className="text-center text-sm text-gray-500 mb-12">
          Escolha o plano que combina com a ocasião. Pagamento único via PIX.
        </p>

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
                    ? 'border-brand bg-brand/5 shadow-card'
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
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto w-full px-6 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Perguntas Frequentes
        </h2>
        <div className="divide-y divide-gray-100">
          {FAQ.map((item, i) => (
            <div key={i} className="py-4">
              <button
                className="w-full flex justify-between items-center text-left gap-4"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="text-sm font-medium text-gray-700">{item.q}</span>
                <span className={`text-brand font-bold text-lg transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {openFaq === i && (
                <p className="mt-3 text-sm text-gray-500 animate-fade-in pr-8">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
