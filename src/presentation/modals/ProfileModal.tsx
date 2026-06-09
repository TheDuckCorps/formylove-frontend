import { useState } from 'react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { useListSitesByEmailMutation } from '@/infrastructure/queries/siteQueries'
import { getFriendlyMessage } from '@/shared/errors/getFriendlyMessage'

interface Props {
  onClose: () => void
}

type ViewState = 'form' | 'sent' | 'empty' | 'cooldown'

export function ProfileModal({ onClose }: Props) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [view, setView] = useState<ViewState>('form')
  const [cooldownMessage, setCooldownMessage] = useState('')

  const listSites = useListSitesByEmailMutation()

  function validate(val: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!validate(email)) {
      setEmailError('Por favor insira um e-mail válido')
      return
    }
    setEmailError('')
    listSites.mutate({ email }, {
      onSuccess: ({ hasSites }) => setView(hasSites ? 'sent' : 'empty'),
      onError: (error: any) => {
        if (error?.response?.status === 429) {
          const msg: string =
            error.response.data?.message ??
            'Um e-mail já foi enviado recentemente. Tente novamente em 2 minuto(s).'
          setCooldownMessage(msg)
          setView('cooldown')
        }
      },
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-modal w-full max-w-md p-8 animate-fade-in relative max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-brand hover:text-brand transition"
          aria-label="Fechar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-16 h-16 bg-brand/10 rounded-2xl flex items-center justify-center">
            <svg className="w-9 h-9 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800 text-center mb-1">Meus presentes</h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Informe seu e-mail para receber seus presentes.
        </p>

        {/* Form */}
        {view === 'form' && (
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <Input
              placeholder="seu@email.com"
              type="email"
              value={email}
              error={emailError}
              onChange={(e) => { setEmail(e.target.value); setEmailError(''); listSites.reset() }}
            />
            {listSites.isError && (
              <p className="text-sm text-red-500 text-center">
                {getFriendlyMessage(listSites.error, 'Não foi possível buscar seus presentes. Tente novamente.')}
              </p>
            )}
            <Button type="submit" fullWidth disabled={listSites.isPending}>
              {listSites.isPending ? 'Buscando...' : 'Buscar meus presentes'}
            </Button>
          </form>
        )}

        {/* Loading */}
        {listSites.isPending && (
          <div className="flex flex-col items-center gap-4 py-8">
            <svg className="w-8 h-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm text-gray-500">Buscando seus presentes...</p>
          </div>
        )}

        {/* Email sent */}
        {view === 'sent' && (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-800">E-mail enviado!</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enviamos a lista de presentes para<br />
              <strong className="text-gray-700">{email}</strong>.<br />
              Verifique sua caixa de entrada.
            </p>
            <button
              onClick={() => { setView('form'); listSites.reset() }}
              className="text-xs text-gray-400 hover:text-gray-600 mt-2"
            >
              Usar outro e-mail
            </button>
          </div>
        )}

        {/* No sites found */}
        {view === 'empty' && (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-700">Nenhum presente encontrado</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              Não encontramos presentes associados a<br />
              <strong className="text-gray-600">{email}</strong>.
            </p>
            <button
              onClick={() => { setView('form'); listSites.reset() }}
              className="text-xs text-gray-400 hover:text-gray-600 mt-2"
            >
              Tentar outro e-mail
            </button>
          </div>
        )}

        {/* Cooldown — too many requests */}
        {view === 'cooldown' && (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-base font-semibold text-gray-800">Aguarde um momento</p>
            <p className="text-sm text-gray-500 leading-relaxed">{cooldownMessage}</p>
            <button
              onClick={() => { setView('form'); listSites.reset() }}
              className="text-xs text-gray-400 hover:text-gray-600 mt-2"
            >
              Tentar novamente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
