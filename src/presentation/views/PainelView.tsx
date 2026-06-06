import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Logo } from '../components/common/Logo'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { AuthRepository } from '@/infrastructure/repositories/AuthRepository'
import { ROUTES } from '@/shared/constants/routes'
import { getFriendlyMessage } from '@/shared/errors/getFriendlyMessage'

type State = 'idle' | 'loading' | 'error'

export function PainelView() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [viewState, setViewState] = useState<State>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function validate(val: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate(email)) {
      setEmailError('Por favor insira um e-mail válido')
      return
    }
    setEmailError('')
    setViewState('loading')
    try {
      const repo = new AuthRepository()
      await repo.sendOTP({ email })
      sessionStorage.setItem('hl_email', email)
      navigate(ROUTES.PAINEL_VERIFICAR, { state: { email } })
    } catch (err) {
      setErrorMsg(getFriendlyMessage(err, 'Não foi possível enviar o código. Tente novamente.'))
      setViewState('error')
    }
  }

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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Acessar meus presentes</h1>
        <p className="text-sm text-gray-500 text-center mb-8">
          Informe seu e-mail e enviaremos um código de acesso.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            error={emailError}
            onChange={(e) => { setEmail(e.target.value); setEmailError(''); setViewState('idle') }}
            autoFocus
          />

          {viewState === 'error' && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <Button type="submit" fullWidth size="lg" disabled={viewState === 'loading'}>
            {viewState === 'loading' ? 'Enviando...' : 'Enviar código de acesso'}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Não tem uma conta?{' '}
          <Link to={ROUTES.CRIAR} className="text-brand font-semibold hover:underline">
            Criar meu presente agora
          </Link>
        </p>
      </div>
    </div>
  )
}
