import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PageItem, AnyPageData, PageType } from '@/core/entities/Page'
import type {
  DesenhoLivreData,
  MedidorAmorData,
  ToqueContinuarData,
  MusicaFundoData,
  PalavraSecretaData,
  QuizAfetivoData,
  RoletaEscolhasData,
  MensagemMultimidiaData,
} from '@/core/entities/Page'
import { Button } from '../components/common/Button'
import { Logo } from '../components/common/Logo'
import { SpinWheelDisplay } from '../components/pages/SpinWheelDisplay'

function PagePreviewContent({ type, data }: { type: PageType; data: AnyPageData }) {
  switch (type) {
    case 'DESENHO_LIVRE': {
      const d = data as DesenhoLivreData
      return d.drawingDataUrl ? (
        <img src={d.drawingDataUrl} alt="Desenho" className="w-full rounded-xl object-contain max-h-52" />
      ) : (
        <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          Nenhum desenho ainda
        </div>
      )
    }
    case 'MEDIDOR_AMOR': {
      const d = data as MedidorAmorData
      return (
        <div className="space-y-2 text-sm text-gray-600">
          {d.question && <p><span className="font-semibold text-gray-800">Pergunta:</span> {d.question}</p>}
          {d.secret && <p><span className="font-semibold text-gray-800">Segredo:</span> {d.secret}</p>}
          {!d.question && !d.secret && <p className="text-gray-400 italic">Sem conteúdo definido</p>}
        </div>
      )
    }
    case 'TOQUE_CONTINUAR': {
      const d = data as ToqueContinuarData
      return (
        <div className="text-center">
          <p className="text-base font-medium text-gray-800 mb-4">{d.phrase || 'Sem frase definida'}</p>
          <div className="inline-flex items-center gap-2 bg-brand text-white text-sm px-4 py-2 rounded-full opacity-70">
            <span>👆</span> Toque para continuar
          </div>
        </div>
      )
    }
    case 'MUSICA_FUNDO': {
      const d = data as MusicaFundoData
      return (
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
          <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center text-lg">🎵</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">Música de fundo</p>
            <p className="text-xs text-gray-400 truncate">{d.youtubeUrl || 'URL não definida'}</p>
          </div>
        </div>
      )
    }
    case 'PALAVRA_SECRETA': {
      const d = data as PalavraSecretaData
      return (
        <div className="space-y-2">
          {d.hint && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide mb-1">Dica</p>
              <p className="text-sm text-gray-800">{d.hint}</p>
            </div>
          )}
          {d.secret && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Palavra secreta</p>
              <p className="text-sm text-gray-800 blur-sm select-none">{d.secret}</p>
            </div>
          )}
          {!d.hint && !d.secret && <p className="text-gray-400 italic text-sm">Sem conteúdo definido</p>}
        </div>
      )
    }
    case 'QUIZ_AFETIVO': {
      const d = data as QuizAfetivoData
      return (
        <div className="space-y-3">
          <p className="text-sm font-semibold text-gray-800">{d.question || 'Pergunta não definida'}</p>
          <div className="grid grid-cols-2 gap-2">
            {d.answers.map((a) => (
              <div
                key={a.id}
                className={[
                  'text-xs px-3 py-2 rounded-lg text-center border',
                  a.isCorrect
                    ? 'border-green-400 bg-green-50 text-green-700 font-semibold'
                    : 'border-gray-200 bg-white text-gray-600',
                ].join(' ')}
              >
                {a.text || 'Opção'}
              </div>
            ))}
          </div>
        </div>
      )
    }
    case 'RASPADINHA_SURPRESA': {
      return (
        <div className="h-28 bg-gray-100 rounded-xl flex items-center justify-center text-4xl">
          🎟️
        </div>
      )
    }
    case 'ROLETA_ESCOLHAS': {
      const d = data as RoletaEscolhasData
      const validOptions = d.options.filter(Boolean)
      if (validOptions.length < 2) {
        return (
          <p className="text-gray-400 italic text-sm text-center py-4">
            Adicione pelo menos 2 opções para ver a roleta.
          </p>
        )
      }
      return <SpinWheelDisplay phrase={d.phrase || undefined} options={validOptions} />
    }
    case 'MENSAGEM_MULTIMIDIA': {
      const d = data as MensagemMultimidiaData
      return (
        <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
          <div className="w-10 h-10 bg-brand/10 rounded-lg flex items-center justify-center text-lg">🎬</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">Mensagem em vídeo</p>
            <p className="text-xs text-gray-400 truncate">{d.youtubeUrl || 'URL não definida'}</p>
          </div>
        </div>
      )
    }
    default:
      return null
  }
}

function PagePreviewCard({ page, index, total }: { page: PageItem; index: number; total: number }) {
  const meta = PAGE_TYPES_META.find((m) => m.type === page.type)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-base">
            {meta?.icon ?? '📄'}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Página {index + 1} de {total}</p>
            <p className="text-sm font-semibold text-gray-800">{meta?.label ?? page.type}</p>
          </div>
        </div>
      </div>
      <PagePreviewContent type={page.type} data={page.data} />
    </div>
  )
}

export function PreviewView() {
  const navigate = useNavigate()
  const { selectedPages } = useSiteBuilderStore()
  const [currentIdx, setCurrentIdx] = useState(0)

  const currentPage = selectedPages[currentIdx]

  if (selectedPages.length === 0) {
    navigate(-1)
    return null
  }

  return (
    <div className="min-h-screen bg-page-gradient flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-100 bg-white sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar e editar
          </button>

          <Logo size="sm" />

          <div className="w-24 text-right">
            <span className="text-xs text-gray-400">
              {currentIdx + 1} / {selectedPages.length}
            </span>
          </div>
        </div>
      </header>

      {/* Preview notice */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-center">
        <p className="text-xs text-amber-700 font-medium">
          Pré-visualização — visível somente para você nesta sessão
        </p>
      </div>

      {/* Phone mockup */}
      <main className="flex-1 flex flex-col items-center justify-start py-6 px-4">
        <div className="w-full max-w-sm">
          {/* Phone frame */}
          <div className="border-[6px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl bg-gray-50">
            {/* Notch */}
            <div className="bg-gray-800 h-6 flex items-center justify-center">
              <div className="w-20 h-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Screen */}
            <div className="bg-gradient-to-b from-pink-50 to-white min-h-[500px] p-4 space-y-4 overflow-y-auto">
              {currentPage && (
                <PagePreviewCard
                  page={currentPage}
                  index={currentIdx}
                  total={selectedPages.length}
                />
              )}
            </div>

            {/* Home bar */}
            <div className="bg-gray-800 h-5 flex items-center justify-center">
              <div className="w-24 h-1 bg-gray-600 rounded-full" />
            </div>
          </div>

          {/* Page navigation */}
          <div className="flex items-center justify-between mt-6 gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === 0}
              onClick={() => setCurrentIdx((i) => i - 1)}
            >
              ← Anterior
            </Button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {selectedPages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIdx(i)}
                  className={[
                    'w-2 h-2 rounded-full transition-all',
                    i === currentIdx ? 'bg-brand w-4' : 'bg-gray-300',
                  ].join(' ')}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={currentIdx === selectedPages.length - 1}
              onClick={() => setCurrentIdx((i) => i + 1)}
            >
              Próxima →
            </Button>
          </div>

          <div className="mt-6 text-center">
            <Button fullWidth size="lg" onClick={() => navigate(-1)}>
              Voltar e continuar editando
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
