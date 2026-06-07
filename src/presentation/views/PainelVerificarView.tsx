import { useState, useRef } from 'react'
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { useSendOTP, useVerifyOTP } from '@/infrastructure/queries/authQueries'
import { ROUTES } from '@/shared/constants/routes'
import { getFriendlyMessage } from '@/shared/errors/getFriendlyMessage'

const CODE_LENGTH = 6

export function PainelVerificarView() {
  const navigate = useNavigate()
  const location = useLocation()
  const email: string = (location.state as any)?.email ?? sessionStorage.getItem('hl_email') ?? ''

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const verifyOTP = useVerifyOTP()
  const sendOTP = useSendOTP()

  if (!email) {
    return <Navigate to={ROUTES.PAINEL} replace />
  }

  function handleDigit(index: number, value: string) {
    const char = value.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = char
    setDigits(next)
    if (char && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    e.preventDefault()
    const next = Array(CODE_LENGTH).fill('')
    pasted.split('').forEach((c, i) => { next[i] = c })
    setDigits(next)
    inputRefs.current[Math.min(pasted.length, CODE_LENGTH - 1)]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join('')
    if (code.length < CODE_LENGTH) return
    verifyOTP.mutate({ email, code }, {
      onSuccess: () => navigate(ROUTES.PAINEL_SITES, { replace: true, state: { email } }),
    })
  }

  function handleResend() {
    sendOTP.mutate({ email })
  }

  const code = digits.join('')
  const isComplete = code.length === CODE_LENGTH

  return (
    <div className="min-h-screen bg-page-gradient flex flex-col items-center justify-center px-4">
      <Link to={ROUTES.HOME} className="mb-10">
        <Logo size="md" />
      </Link>

      <div className="bg-white rounded-2xl shadow-card w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center">
            <svg className="w-9 h-9 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Verifique seu e-mail</h1>
        <p className="text-sm text-gray-500 text-center mb-2">
          Enviamos um código de 6 dígitos para
        </p>
        <p className="text-sm font-semibold text-brand text-center mb-8">{email}</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
          <div className="flex gap-3" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-11 h-14 text-center text-xl font-bold border-2 rounded-xl outline-none transition-all
                  border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/20 text-gray-800"
              />
            ))}
          </div>

          {verifyOTP.isError && (
            <p className="text-sm text-red-500 text-center">
              {getFriendlyMessage(verifyOTP.error, 'Código inválido ou expirado. Tente novamente.')}
            </p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={!isComplete || verifyOTP.isPending}>
            {verifyOTP.isPending ? 'Verificando...' : 'Acessar meus presentes'}
          </Button>
        </form>

        <div className="text-center mt-6 flex flex-col gap-2">
          <button
            onClick={handleResend}
            className="text-xs text-gray-400 hover:text-brand transition"
          >
            Reenviar código
          </button>
          <Link to={ROUTES.PAINEL} className="text-xs text-gray-400 hover:text-brand transition">
            Usar outro e-mail
          </Link>
        </div>
      </div>
    </div>
  )
}
