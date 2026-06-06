import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { QRCodeViewer } from '../components/common/QRCodeViewer'
import { SiteRepository } from '@/infrastructure/repositories/SiteRepository'
import { PLANS } from '@/core/entities/Site'
import type { Site } from '@/core/entities/Site'
import { ROUTES } from '@/shared/constants/routes'
import { getFriendlyMessage } from '@/shared/errors/getFriendlyMessage'

interface Props {
  onClose: () => void
}

type ViewState = 'form' | 'loading' | 'results' | 'empty' | 'error' | 'qrcode'

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  ACTIVE:          { label: 'Ativo',                color: 'text-green-600 bg-green-50 border-green-200' },
  PENDING_PAYMENT: { label: 'Aguardando pagamento', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  DRAFT:           { label: 'Rascunho',             color: 'text-gray-500 bg-gray-50 border-gray-200' },
  EXPIRED:         { label: 'Expirado',             color: 'text-red-500 bg-red-50 border-red-200' },
  BLOCKED:         { label: 'Bloqueado',            color: 'text-red-600 bg-red-50 border-red-200' },
}

function getPlan(site: Site) {
  const type = (site as any).plan ?? site.planType
  return PLANS.find((p) => p.type === type)?.label ?? type ?? '—'
}

function getStatus(site: Site) {
  const s = (site as any).status ?? 'DRAFT'
  return STATUS_LABEL[s] ?? { label: s, color: 'text-gray-500 bg-gray-50 border-gray-200' }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function ProfileModal({ onClose }: Props) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [view, setView] = useState<ViewState>('form')
  const [sites, setSites] = useState<Site[]>([])
  const [errorMsg, setErrorMsg] = useState('')
  const [qrSite, setQrSite] = useState<Site | null>(null)

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
    setView('loading')
    try {
      const repo = new SiteRepository()
      const result = await repo.listByEmail({ email })
      const active = result.filter((s) => ((s as any).status ?? s.status) === 'ACTIVE')
      setSites(active)
      setView(active.length === 0 ? 'empty' : 'results')
    } catch (err) {
      setErrorMsg(getFriendlyMessage(err, 'Não foi possível buscar seus presentes. Tente novamente.'))
      setView('error')
    }
  }

  function handleCreateNew() {
    onClose()
    navigate(ROUTES.CRIAR)
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
          Informe seu e-mail para ver os presentes que você criou.
        </p>

        {/* Form */}
        {(view === 'form' || view === 'error') && (
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <Input
              placeholder="seu@email.com"
              type="email"
              value={email}
              error={emailError}
              onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
            />
            {view === 'error' && (
              <p className="text-sm text-red-500 text-center">{errorMsg}</p>
            )}
            <Button type="submit" fullWidth>
              Buscar meus presentes
            </Button>
          </form>
        )}

        {/* Loading */}
        {view === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <svg className="w-8 h-8 animate-spin text-brand" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <p className="text-sm text-gray-500">Buscando seus presentes...</p>
          </div>
        )}

        {/* Empty state */}
        {view === 'empty' && (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <div className="text-5xl">🎁</div>
            <p className="text-base font-semibold text-gray-800">
              Você ainda não deu um presente incrível para alguém que ama?
            </p>
            <p className="text-sm text-gray-500">
              Crie agora e surpreenda com uma página única e inesquecível!
            </p>
            <Button fullWidth onClick={handleCreateNew}>
              Criar meu presente agora
            </Button>
            <button
              onClick={() => setView('form')}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Tentar outro e-mail
            </button>
          </div>
        )}

        {/* Results */}
        {view === 'results' && (
          <div className="flex flex-col gap-3 overflow-y-auto flex-1">
            <p className="text-xs text-gray-400 mb-1">
              {sites.length} presente{sites.length !== 1 ? 's' : ''} ativo{sites.length !== 1 ? 's' : ''} para <strong className="text-gray-600">{email}</strong>
            </p>
            {sites.map((site) => {
              const expiry = formatDate((site as any).expiresAt ?? site.expirationDate)
              const status = getStatus(site)
              return (
                <div key={site.id} className="border border-gray-100 rounded-xl p-4 flex flex-col gap-3 hover:border-brand/30 transition">
                  <div
                    className="flex items-start justify-between gap-3 cursor-pointer"
                    onClick={() => { onClose(); navigate(`/site/${site.slug}`) }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-mono truncate">{site.slug}</p>
                      <p className="text-sm font-semibold text-gray-700 mt-0.5">Plano {getPlan(site)}</p>
                      {expiry && (
                        <p className="text-xs text-gray-400 mt-0.5">Expira em {expiry}</p>
                      )}
                    </div>
                    <span className={['text-[11px] font-semibold border px-2 py-0.5 rounded-full whitespace-nowrap', status.color].join(' ')}>
                      {status.label}
                    </span>
                  </div>
                  <button
                    onClick={() => { setQrSite(site); setView('qrcode') }}
                    className="text-xs font-semibold text-brand border border-brand/30 rounded-lg py-1.5 hover:bg-brand/5 transition"
                  >
                    Visualizar QRCode do site
                  </button>
                </div>
              )
            })}
            <button
              onClick={() => { setView('form'); setSites([]) }}
              className="text-xs text-gray-400 hover:text-gray-600 text-center mt-1"
            >
              Buscar outro e-mail
            </button>
          </div>
        )}

        {/* QR Code view */}
        {view === 'qrcode' && qrSite && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setView('results')}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition self-start"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <QRCodeViewer slug={qrSite.slug} qrTemplate={qrSite.globalSettings?.qrTemplate ?? qrSite.qrTemplate} />
            <p className="text-xs text-gray-400 text-center">
              Aponte a câmera do celular para abrir o presente.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
