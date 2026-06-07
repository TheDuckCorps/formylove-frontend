import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { StepIndicator } from '../components/layout/StepIndicator'
import { QRCodeViewer } from '../components/common/QRCodeViewer'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { ROUTES } from '@/shared/constants/routes'

interface TemplateOption {
  id: string
  label: string
  style: string
  emoji?: string
  detailed: boolean
}

const TEMPLATES: TemplateOption[] = [
  { id: 'template-1', label: 'Fundo branco', style: 'bg-white border border-gray-200', detailed: false },
  { id: 'template-2', label: 'Flores coloridas', style: 'bg-[url("/templates/t2.png")] bg-cover', emoji: '🌸🎨', detailed: false },
  { id: 'template-3', label: 'Fundo claro', style: 'bg-gray-50 border border-gray-200', detailed: false },
  { id: 'template-4', label: 'Corações rosa', style: 'bg-pink-100', emoji: '💗', detailed: true },
  { id: 'template-5', label: 'Nuvens', style: 'bg-sky-100', emoji: '☁️', detailed: true },
  { id: 'template-6', label: 'Flores silvestres', style: 'bg-green-50', emoji: '🌼', detailed: true },
  { id: 'template-7', label: 'Rosa claro', style: 'bg-rose-50', emoji: '🌹', detailed: true },
  { id: 'template-8', label: 'Lilás', style: 'bg-violet-100', emoji: '💜', detailed: true },
  { id: 'template-9', label: 'Roxo', style: 'bg-purple-200', emoji: '🔮', detailed: true },
]

export function QRCodeTemplateView() {
  const navigate = useNavigate()
  const { qrTemplate, qrCodeDetailed, setQrTemplate } = useSiteBuilderStore()

  function handleSelect(t: TemplateOption) {
    setQrTemplate(t.id, t.detailed)
  }

  return (
    <div className="page-wrapper">
      <Header />
      <StepIndicator currentStep={3} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Escolha o fundo do QR Code
        </h1>
        <p className="text-sm text-gray-400 text-center mb-2">
          Este design aparece impresso ao redor do QR Code do seu presente
        </p>
        <p className="text-xs text-gray-400 text-center mb-8">
          Designs com <span className="text-brand font-semibold">★ Premium</span> são gratuitos no plano Premium. Nos demais planos, acrescentam <strong>R$2,00</strong>.
        </p>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Template grid */}
          <div className="flex-1 min-w-0 w-full">
            <div className="grid grid-cols-3 gap-4 mb-10">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition flex items-center justify-center text-3xl ${t.style} ${
                    qrTemplate === t.id
                      ? 'border-brand shadow-card scale-[1.02]'
                      : 'border-transparent hover:border-brand/40'
                  }`}
                >
                  {t.emoji && <span className="text-3xl select-none">{t.emoji}</span>}

                  {/* Premium badge */}
                  {t.detailed && (
                    <span className="absolute top-1.5 left-1.5 bg-brand/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                      ★ Premium
                    </span>
                  )}

                  {/* Selected checkmark */}
                  {qrTemplate === t.id && (
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-brand rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}

                  <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-gray-500 truncate px-1">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Detailed QR warning */}
            {qrCodeDetailed && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-3">
                <span className="text-amber-500 text-base">⭐</span>
                <p className="text-xs text-amber-700">
                  Design Premium selecionado. No plano Premium este design é <strong>gratuito</strong>. Nos outros planos, adiciona <strong>+R$2,00</strong>.
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-3">
              <Button
                size="lg"
                fullWidth
                onClick={() => navigate(ROUTES.CRIAR_PLANO)}
                disabled={!qrTemplate}
              >
                Escolher plano e finalizar →
              </Button>
              <button
                onClick={() => navigate(ROUTES.CRIAR_PREVIEW)}
                className="text-sm text-brand hover:underline"
              >
                Pré-visualizar meu presente
              </button>
            </div>
          </div>

          {/* Live preview */}
          <div className="lg:sticky lg:top-8 flex flex-row lg:flex-col items-center gap-4 lg:gap-3 w-full lg:w-56 shrink-0 bg-gray-50 lg:bg-transparent rounded-2xl lg:rounded-none p-4 lg:p-0">
            <div className="w-24 h-24 lg:w-52 lg:h-52 shrink-0 overflow-hidden rounded-2xl [&>div]:w-full [&>div]:h-full">
              <QRCodeViewer slug="meu-presente" qrTemplate={qrTemplate ?? 'template-1'} size={200} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-500 font-medium">Prévia do QR Code</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Selecione um design para ver a prévia
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
