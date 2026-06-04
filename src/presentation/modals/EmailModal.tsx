import { useState } from 'react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/shared/constants/routes'

interface Props {
  onClose: () => void
  onSubmit: (email: string) => void
  isLoading?: boolean
  planPrice?: number
}

export function EmailModal({ onClose, onSubmit, isLoading, planPrice }: Props) {
  const { email, setEmail } = useSiteBuilderStore()
  const [localEmail, setLocalEmail] = useState(email)
  const [error, setError] = useState('')

  function validate(val: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate(localEmail)) {
      setError('Por favor insira um e-mail válido')
      return
    }
    setEmail(localEmail)
    onSubmit(localEmail)
  }

  const priceFormatted = planPrice
    ? (planPrice / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-modal w-full max-w-md p-8 animate-fade-in relative">
        {/* Close */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 left-4 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition disabled:opacity-40"
          aria-label="Fechar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Envelope icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center">
            <svg className="w-14 h-14" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="22" width="60" height="42" rx="4" stroke="#555" strokeWidth="2.5" fill="white" />
              <path d="M10 26l30 22 30-22" stroke="#555" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M40 33c0 0-8-5-8 2.5C32 41 40 47 40 47s8-6 8-11.5C48 28 40 33 40 33Z" fill="#C62A87" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
          Quase lá! Informe seu e-mail
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enviaremos o link do seu presente e o QR Code para este endereço.
        </p>

        {priceFormatted && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-600">Total a pagar via PIX</p>
            <p className="text-lg font-bold text-brand">{priceFormatted}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            placeholder="seu@email.com"
            type="email"
            value={localEmail}
            error={error}
            disabled={isLoading}
            onChange={(e) => {
              setLocalEmail(e.target.value)
              setError('')
            }}
          />

          <Button type="submit" fullWidth size="lg" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Criando seu presente...
              </span>
            ) : (
              'Criar presente e pagar'
            )}
          </Button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Ao continuar, você concorda com nossa{' '}
          <Link to={ROUTES.POLITICA} className="text-blue-500 hover:underline" onClick={onClose}>
            Política de Privacidade
          </Link>{' '}
          e{' '}
          <Link to={ROUTES.TERMOS} className="text-blue-500 hover:underline" onClick={onClose}>
            Termos de Uso
          </Link>
        </p>
      </div>
    </div>
  )
}
