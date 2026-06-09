import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { useToast } from '@/shared/ui/ToastProvider'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { ROUTES } from '@/shared/constants/routes'
import { PLANS } from '@/core/entities/Site'
import { usePaymentViewModel } from '../viewModels/usePaymentViewModel'

const planTypeValues = ['BASIC', 'INTERMEDIATE', 'PREMIUM'] as const

const locationStateSchema = z.object({
  qrCode: z.string().optional(),
  qrCodeImage: z.string().optional(),
  siteId: z.string().optional(),
  siteSlug: z.string().optional(),
  qrTemplate: z.string().optional(),
  planType: z.enum(planTypeValues).optional(),
  email: z.string().optional(),
  amount: z.number().optional(),
  expiresIn: z.number().optional(),
})

type LocationState = z.infer<typeof locationStateSchema>

function formatCurrency(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function PaymentView() {
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const parsed = locationStateSchema.safeParse(location.state)
  if (!parsed.success) {
    navigate(ROUTES.HOME, { replace: true })
    return null
  }
  const state: LocationState = parsed.data

  const { qrCode: initialQrCode, qrCodeImage: initialQrCodeImage, siteId, siteSlug, planType = 'BASIC', email, amount, expiresIn = 3000 } = state
  const plan = PLANS.find((p) => p.type === planType) ?? PLANS[0]
  const displayAmount = amount ?? plan.price

  const {
    qrCode,
    qrCodeImage,
    isExpired,
    isRefreshing,
    isWarning,
    formattedTime,
    error,
    refreshQrCode,
    isPaid,
    isCheckingPayment,
    checkMessage,
    checkPaymentNow,
  } = usePaymentViewModel({
    initialQrCode: initialQrCode ?? '',
    initialQrCodeImage,
    siteId: siteId ?? '',
    email,
    expiresIn,
  })

  useEffect(() => {
    if (isPaid) {
      navigate(ROUTES.CRIAR_SUCESSO, {
        state: { slug: siteSlug, email },
        replace: true,
      })
    }
  }, [isPaid, siteSlug, email, navigate])

  if (!initialQrCode) {
    return (
      <div className="page-wrapper">
        <Header />
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Nenhuma cobrança encontrada.</p>
            <Button onClick={() => navigate(ROUTES.CRIAR)}>Recomeçar</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  function handleCopyPix() {
    navigator.clipboard.writeText(qrCode)
      .then(() => showToast('Código PIX copiado!', 'success'))
      .catch(() => {})
  }

  return (
    <div className="page-wrapper">
      <Header />

      <main className="flex-1 max-w-lg mx-auto w-full px-6 py-10">
        {/* Status badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 border border-amber-200 px-4 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            Aguardando pagamento
          </span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">
          Finalize seu presente
        </h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Pague via PIX para ativar seu site imediatamente
        </p>

        {/* Plan + price */}
        <div className="bg-brand/5 border border-brand/20 rounded-2xl p-4 mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Plano {plan.label}</p>
            <p className="text-sm text-gray-600 mt-0.5">{plan.description}</p>
          </div>
          <p className="text-2xl font-bold text-brand">{formatCurrency(displayAmount)}</p>
        </div>

        {/* QR Code */}
        <div className="flex flex-col items-center gap-4 bg-white border border-gray-200 rounded-2xl p-6 mb-4 shadow-sm">
          <div className="relative">
            {qrCodeImage ? (
              <img
                src={typeof qrCodeImage === 'string' && qrCodeImage.startsWith('data:image/')
                  ? qrCodeImage
                  : `data:image/png;base64,${qrCodeImage}`}
                alt="QR Code PIX"
                className={[
                  'w-52 h-52 rounded-xl transition-opacity',
                  isExpired ? 'opacity-30' : '',
                ].join(' ')}
              />
            ) : (
              <div className="w-52 h-52 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                QR Code indisponível
              </div>
            )}

            {isExpired && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl">
                <p className="text-sm font-semibold text-gray-700 text-center px-2">QR Code expirado</p>
                <button
                  onClick={refreshQrCode}
                  disabled={isRefreshing}
                  className="bg-brand text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-brand-light disabled:opacity-60 transition-colors"
                >
                  {isRefreshing ? 'Gerando...' : 'Gerar novo código'}
                </button>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">
            Escaneie com o app do seu banco
          </p>

          {/* Countdown */}
          <div className={[
            'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            isExpired
              ? 'bg-red-50 text-red-600 border border-red-200'
              : isWarning
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-gray-50 text-gray-500 border border-gray-200',
          ].join(' ')}>
            <span className={[
              'w-1.5 h-1.5 rounded-full',
              isExpired ? 'bg-red-400' : isWarning ? 'bg-amber-400 animate-pulse' : 'bg-gray-400',
            ].join(' ')} />
            {isExpired ? 'QR Code expirado' : `Válido por ${formattedTime}`}
          </div>

          {!isExpired && (
            <button
              onClick={refreshQrCode}
              disabled={isRefreshing}
              className="text-xs text-gray-400 hover:text-brand disabled:opacity-50 transition-colors underline underline-offset-2"
            >
              {isRefreshing ? 'Gerando novo código...' : 'Gerar novo QR Code'}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-xs text-center px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* PIX code copy */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-2 font-medium">Ou copie o código PIX:</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={qrCode}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-600 font-mono truncate focus:outline-none"
            />
            <Button size="sm" variant="outline" onClick={handleCopyPix}>
              Copiar
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-8">
          <p className="text-xs font-semibold text-blue-700 mb-2">Como pagar:</p>
          <ol className="text-xs text-blue-600 space-y-1 list-decimal list-inside">
            <li>Abra o app do seu banco</li>
            <li>Acesse a opção de pagamento via PIX</li>
            <li>Escaneie o QR Code ou cole o código</li>
            <li>Confirme o pagamento de {formatCurrency(displayAmount)}</li>
          </ol>
        </div>

        <p className="text-xs text-gray-400 text-center mb-6">
          Após a confirmação do pagamento, você receberá o link do site
          {email ? ` no email ${email}` : ''} automaticamente.
        </p>


        {/* "Já paguei" — manual payment check */}
        <Button
          fullWidth
          onClick={checkPaymentNow}
          disabled={isCheckingPayment}
        >
          {isCheckingPayment ? 'Verificando pagamento...' : 'Já paguei'}
        </Button>

        {checkMessage && (
          <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs text-center px-4 py-3 rounded-xl">
            {checkMessage}
          </div>
        )}

        <p className="text-[11px] text-gray-400 text-center mt-3 mb-4">
          Verificamos seu pagamento automaticamente a cada poucos segundos.
        </p>

        <Button variant="ghost" size="sm" fullWidth onClick={() => navigate(ROUTES.CRIAR)}>
          Cancelar e recomeçar
        </Button>
      </main>

      <Footer />
    </div>
  )
}
