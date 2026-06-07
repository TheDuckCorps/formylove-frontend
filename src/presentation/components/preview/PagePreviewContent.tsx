import type { AnyPageData, PageType } from '@/core/entities/Page'
import type {
  DesenhoLivreData,
  MedidorAmorData,
  ToqueContinuarData,
  MusicaFundoData,
  PalavraSecretaData,
  QuizAfetivoData,
  RaspadinhaSurpresaData,
  RoletaEscolhasData,
  MensagemMultimidiaData,
} from '@/core/entities/Page'
import { SpinWheelDisplay } from '../display/SpinWheelDisplay'
import { MedidorAmorDisplay } from '../display/MedidorAmorDisplay'
import { ToqueContinuarDisplay } from '../display/ToqueContinuarDisplay'
import { MusicaFundoDisplay } from '../display/MusicaFundoDisplay'
import { PalavraSecretaDisplay } from '../display/PalavraSecretaDisplay'
import { QuizAfetivoDisplay } from '../display/QuizAfetivoDisplay'
import { RaspadinhaSurpresaDisplay } from '../display/RaspadinhaSurpresaDisplay'
import { MensagemMultimidiaDisplay } from '../display/MensagemMultimidiaDisplay'

export function PagePreviewContent({ type, data }: { type: PageType; data: AnyPageData }) {
  const previewMode = true

  switch (type) {
    case 'DESENHO_LIVRE': {
      const d = data as DesenhoLivreData
      return d.drawingDataUrl ? (
        <img src={d.drawingDataUrl} alt="Desenho" className="w-full rounded-xl object-contain max-h-64" />
      ) : (
        <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-sm">
          Nenhum desenho ainda
        </div>
      )
    }
    case 'MEDIDOR_AMOR': {
      const d = data as MedidorAmorData
      return (
        <MedidorAmorDisplay
          question={d.question}
          imageUrl={d.imageUrl}
          previewMode={previewMode}
        />
      )
    }
    case 'TOQUE_CONTINUAR': {
      const d = data as ToqueContinuarData
      return <ToqueContinuarDisplay phrase={d.phrase} />
    }
    case 'MUSICA_FUNDO': {
      const d = data as MusicaFundoData
      return (
        <div className="flex flex-col min-h-[220px] justify-end items-center pt-6">
          <MusicaFundoDisplay youtubeUrl={d.youtubeUrl} compact />
        </div>
      )
    }
    case 'PALAVRA_SECRETA': {
      const d = data as PalavraSecretaData
      return (
        <PalavraSecretaDisplay hint={d.hint} secret={d.secret} previewMode={previewMode} />
      )
    }
    case 'QUIZ_AFETIVO': {
      const d = data as QuizAfetivoData
      return (
        <QuizAfetivoDisplay question={d.question} answers={d.answers} previewMode={previewMode} />
      )
    }
    case 'RASPADINHA_SURPRESA': {
      const d = data as RaspadinhaSurpresaData
      return (
        <RaspadinhaSurpresaDisplay
          imageUrl={d.imageUrl}
          title={d.title}
          previewMode={previewMode}
        />
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
      return (
        <SpinWheelDisplay
          phrase={d.phrase || undefined}
          options={validOptions}
          previewMode={previewMode}
        />
      )
    }
    case 'MENSAGEM_MULTIMIDIA': {
      const d = data as MensagemMultimidiaData
      return <MensagemMultimidiaDisplay youtubeUrl={d.youtubeUrl} />
    }
    default:
      return null
  }
}
