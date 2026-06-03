import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { EmailModal } from '../modals/EmailModal'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { SiteRepository } from '@/infrastructure/repositories/SiteRepository'
import { ROUTES } from '@/shared/constants/routes'

// Template definitions – backgrounds replicate the prototype grid
const TEMPLATES = [
  { id: 'template-1', label: 'Padrão – Fundo branco', style: 'bg-white border border-gray-200' },
  { id: 'template-2', label: 'Padrão – Flores coloridas', style: 'bg-[url("/templates/t2.png")] bg-cover', emoji: '🌸🎨' },
  { id: 'template-3', label: 'Padrão – Fundo branco', style: 'bg-white border border-gray-200' },
  { id: 'template-4', label: 'Padrão – Corações rosa', style: 'bg-pink-100', emoji: '💗' },
  { id: 'template-5', label: 'Padrão – Nuvens', style: 'bg-sky-100', emoji: '☁️' },
  { id: 'template-6', label: 'Padrão – Flores silvestres', style: 'bg-green-50', emoji: '🌼' },
  { id: 'template-7', label: 'Padrão – Rosa claro', style: 'bg-rose-50', emoji: '🌹' },
  { id: 'template-8', label: 'Padrão – Lilás', style: 'bg-violet-100', emoji: '💜' },
  { id: 'template-9', label: 'Padrão – Roxo', style: 'bg-purple-200', emoji: '🔮' },
]

export function QRCodeTemplateView() {
  const navigate = useNavigate()
  const { qrTemplate, setQrTemplate, selectedPages, email, planType } = useSiteBuilderStore()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleEmailSubmit(submittedEmail: string) {
    setIsLoading(true)
    try {
      const repo = new SiteRepository()
      const result = await repo.create({
        ownerEmail: submittedEmail,
        planType: planType ?? 'BASIC',
        pages: selectedPages,
        qrTemplate,
      })
      // Redirect to payment
      navigate(`${ROUTES.CRIAR_PAGAMENTO}?siteId=${result.site.id}&paymentId=${result.paymentId}`)
    } catch {
      // TODO: toast de erro
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-wrapper">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-8">
          Escolha um template para o fundo do seu QR Code
        </h1>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setQrTemplate(t.id)}
              className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition flex items-center justify-center text-3xl ${t.style} ${
                qrTemplate === t.id
                  ? 'border-brand shadow-card scale-[1.02]'
                  : 'border-transparent hover:border-brand/40'
              }`}
            >
              {t.emoji && <span className="text-3xl select-none">{t.emoji}</span>}
              {qrTemplate === t.id && (
                <span className="absolute top-2 right-2 w-6 h-6 bg-brand rounded-full flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                </span>
              )}
              <span className="absolute bottom-1 left-0 right-0 text-center text-[10px] text-gray-500 truncate px-1">
                {t.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            size="lg"
            fullWidth
            onClick={() => setShowEmailModal(true)}
            disabled={!qrTemplate}
          >
            Obter QR Code e Link
          </Button>
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-brand hover:underline"
          >
            Pré-visualizar resultado
          </button>
        </div>
      </main>

      <Footer />

      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          onSubmit={handleEmailSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
