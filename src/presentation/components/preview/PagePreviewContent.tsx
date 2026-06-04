import type { AnyPageData, PageType } from '@/core/entities/Page'
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
import { SpinWheelDisplay } from '../pages/SpinWheelDisplay'

export function PagePreviewContent({ type, data }: { type: PageType; data: AnyPageData }) {
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
