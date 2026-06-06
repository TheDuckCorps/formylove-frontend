// ─── Page type identifiers ────────────────────────────────────────────────────
export type PageType =
  | 'DESENHO_LIVRE'
  | 'MEDIDOR_AMOR'
  | 'TOQUE_CONTINUAR'
  | 'MUSICA_FUNDO'
  | 'PALAVRA_SECRETA'
  | 'QUIZ_AFETIVO'
  | 'RASPADINHA_SURPRESA'
  | 'ROLETA_ESCOLHAS'
  | 'MENSAGEM_MULTIMIDIA'

// ─── Per-type data shapes (saved in `pages` JSONB) ───────────────────────────
export interface DesenhoLivreData {
  drawingDataUrl: string | null
  excalidrawData?: string | null
}

export interface MedidorAmorData {
  question: string
  imageUrl: string | null
}

export interface ToqueContinuarData {
  phrase: string
}

export interface MusicaFundoData {
  youtubeUrl: string
}

export interface PalavraSecretaData {
  hint: string
  secret: string
}

export interface QuizAfetivoAnswer {
  id: string
  text: string
  isCorrect: boolean
}

export interface QuizAfetivoData {
  question: string
  answers: QuizAfetivoAnswer[]
}

export interface RaspadinhaSurpresaData {
  imageUrl: string | null
  title?: string
}

export interface RoletaEscolhasData {
  phrase: string
  options: string[]
}

export interface MensagemMultimidiaData {
  youtubeUrl: string
}

// ─── Union of all data types ──────────────────────────────────────────────────
export type AnyPageData =
  | DesenhoLivreData
  | MedidorAmorData
  | ToqueContinuarData
  | MusicaFundoData
  | PalavraSecretaData
  | QuizAfetivoData
  | RaspadinhaSurpresaData
  | RoletaEscolhasData
  | MensagemMultimidiaData

// ─── A page item as stored in the JSONB ──────────────────────────────────────
export interface PageItem {
  id: string          // local uuid for React key
  type: PageType
  order: number
  data: AnyPageData
}

// ─── Metadata about each available page type ─────────────────────────────────
export interface PageTypeMeta {
  type: PageType
  label: string
  description: string
  svgIcon: string
  defaultData: AnyPageData
  disabled?: boolean
}

export const PAGE_TYPES_META: PageTypeMeta[] = [
  {
    type: 'DESENHO_LIVRE',
    label: 'Desenho Livre',
    description: 'Faça um desenho à mão livre para expressar seu amor.',
    svgIcon: '/draw.svg',
    defaultData: { drawingDataUrl: null, excalidrawData: null } satisfies DesenhoLivreData,
  },
  {
    type: 'MEDIDOR_AMOR',
    label: 'Medidor de Amor',
    description: 'Um coração que revela uma frase secreta conforme os cliques.',
    svgIcon: '/love-meditor.svg',
    defaultData: { question: '', imageUrl: null } satisfies MedidorAmorData,
  },
  {
    type: 'TOQUE_CONTINUAR',
    label: 'Toque para Continuar',
    description: 'Uma frase acima do botão de avanço interativo.',
    svgIcon: '/click-to-continue.svg',
    defaultData: { phrase: '' } satisfies ToqueContinuarData,
  },
  {
    type: 'MUSICA_FUNDO',
    label: 'Música de Fundo',
    description: 'Adicione uma trilha sonora via YouTube ou arquivo.',
    svgIcon: '/music.svg',
    defaultData: { youtubeUrl: '' } satisfies MusicaFundoData,
  },
  {
    type: 'PALAVRA_SECRETA',
    label: 'Palavra Secreta',
    description: 'Uma dica e uma frase secreta para adivinhar.',
    svgIcon: '/secret-word.svg',
    defaultData: { hint: '', secret: '' } satisfies PalavraSecretaData,
  },
  {
    type: 'QUIZ_AFETIVO',
    label: 'Quiz Afetivo',
    description: 'Quiz personalizado com respostas e uma correta.',
    svgIcon: '/quiz.svg',
    defaultData: {
      question: '',
      answers: [
        { id: '1', text: '', isCorrect: false },
        { id: '2', text: '', isCorrect: false },
        { id: '3', text: '', isCorrect: true },
        { id: '4', text: '', isCorrect: false },
      ],
    } satisfies QuizAfetivoData,
  },
  {
    type: 'RASPADINHA_SURPRESA',
    label: 'Raspadinha Surpresa',
    description: 'Raspe para revelar uma imagem especial.',
    svgIcon: '/photo-surprise.svg',
    defaultData: { imageUrl: null, title: '' } satisfies RaspadinhaSurpresaData,
  },
  {
    type: 'ROLETA_ESCOLHAS',
    label: 'Roleta das Escolhas',
    description: 'Gire a roleta para sortear entre opções do casal.',
    svgIcon: '/lucky-choose.svg',
    defaultData: { phrase: '', options: ['', '', ''] } satisfies RoletaEscolhasData,
  },
  {
    type: 'MENSAGEM_MULTIMIDIA',
    label: 'Mensagem Multimídia',
    description: 'Envie um vídeo especial via YouTube ou arquivo.',
    svgIcon: '/videos.svg',
    defaultData: { youtubeUrl: '' } satisfies MensagemMultimidiaData,
    disabled: true,
  },
]
