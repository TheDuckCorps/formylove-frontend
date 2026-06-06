import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditorHeader } from '../components/layout/EditorHeader'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { StepIndicator } from '../components/layout/StepIndicator'
import { EditarPaginasModal } from '../modals/EditarPaginasModal'
import { LivePreviewPanel } from '../components/preview/LivePreviewPanel'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { ROUTES } from '@/shared/constants/routes'

import { DesenhoLivrePage } from '../components/pages/DesenhoLivrePage'
import { MedidorAmorPage } from '../components/pages/MedidorAmorPage'
import { ToqueContinuarPage } from '../components/pages/ToqueContinuarPage'
import { MusicaFundoPage } from '../components/pages/MusicaFundoPage'
import { PalavraSecretaPage } from '../components/pages/PalavraSecretaPage'
import { QuizAfetivoPage } from '../components/pages/QuizAfetivoPage'
import { RaspadinhaSurpresaPage } from '../components/pages/RaspadinhaSurpresaPage'
import { RoletaEscolhasPage } from '../components/pages/RoletaEscolhasPage'
import { MensagemMultimidiaPage } from '../components/pages/MensagemMultimidiaPage'

import type {
  PageType,
  AnyPageData,
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

function PageEditorSwitch({
  type,
  data,
  onChange,
}: {
  type: PageType
  data: AnyPageData
  onChange: (d: Partial<AnyPageData>) => void
}) {
  switch (type) {
    case 'DESENHO_LIVRE':
      return <DesenhoLivrePage data={data as DesenhoLivreData} onChange={onChange} />
    case 'MEDIDOR_AMOR':
      return <MedidorAmorPage data={data as MedidorAmorData} onChange={onChange} />
    case 'TOQUE_CONTINUAR':
      return <ToqueContinuarPage data={data as ToqueContinuarData} onChange={onChange} />
    case 'MUSICA_FUNDO':
      return <MusicaFundoPage data={data as MusicaFundoData} onChange={onChange} />
    case 'PALAVRA_SECRETA':
      return <PalavraSecretaPage data={data as PalavraSecretaData} onChange={onChange} />
    case 'QUIZ_AFETIVO':
      return <QuizAfetivoPage data={data as QuizAfetivoData} onChange={onChange} />
    case 'RASPADINHA_SURPRESA':
      return <RaspadinhaSurpresaPage data={data as RaspadinhaSurpresaData} onChange={onChange} />
    case 'ROLETA_ESCOLHAS':
      return <RoletaEscolhasPage data={data as RoletaEscolhasData} onChange={onChange} />
    case 'MENSAGEM_MULTIMIDIA':
      return <MensagemMultimidiaPage data={data as MensagemMultimidiaData} onChange={onChange} />
    default:
      return <div className="text-gray-400 text-sm text-center py-10">Editor não disponível.</div>
  }
}

export function EditorView() {
  const navigate = useNavigate()
  const { selectedPages, currentPageIndex, setCurrentPageIndex, updatePageData } =
    useSiteBuilderStore()

  const [showEditModal, setShowEditModal] = useState(false)

  const currentPage = selectedPages[currentPageIndex]

  if (!currentPage) {
    navigate(ROUTES.CRIAR)
    return null
  }

  const pageLabel = `${currentPageIndex + 1}. ${currentPage.type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())}`

  function handleNext() {
    if (currentPageIndex < selectedPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1)
      window.scrollTo(0, 0)
    } else {
      navigate(ROUTES.CRIAR_QRCODE)
    }
  }

  function handlePrev() {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1)
      window.scrollTo(0, 0)
    } else {
      navigate(ROUTES.CRIAR)
    }
  }

  const isLastPage = currentPageIndex === selectedPages.length - 1

  return (
    <div className="editor-wrapper">
      <EditorHeader
        title={pageLabel}
        currentIndex={currentPageIndex}
        totalPages={selectedPages.length}
        onPrev={handlePrev}
        onNext={handleNext}
        onChangePages={() => setShowEditModal(true)}
      />

      <StepIndicator currentStep={2} />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8 lg:grid lg:grid-cols-[1fr_400px] lg:gap-10 lg:items-start">
        <div>
          <PageEditorSwitch
            key={currentPage.id}
            type={currentPage.type}
            data={currentPage.data}
            onChange={(d) => updatePageData(currentPage.id, d)}
          />

          <div className="mt-10 hidden lg:flex items-center gap-3">
            <Button size="lg" fullWidth variant="outline" onClick={handlePrev}>
              ← Página anterior
            </Button>
            <Button size="lg" fullWidth onClick={handleNext}>
              {isLastPage ? 'Ir para capa do QR Code →' : 'Próxima página →'}
            </Button>
          </div>
        </div>

        <div className="hidden lg:block sticky top-20">
          <p className="text-xs text-brand font-semibold text-center mb-3 uppercase tracking-wide">
            Visualização ao vivo
          </p>
          <LivePreviewPanel
            page={currentPage}
            pageIndex={currentPageIndex}
            totalPages={selectedPages.length}
          />
        </div>
      </main>

      <button
        type="button"
        onClick={() => navigate(ROUTES.CRIAR_PREVIEW)}
        className="lg:hidden fixed bottom-24 right-4 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-brand text-white shadow-lg text-sm font-semibold hover:opacity-90 transition"
        aria-label="Pré-visualizar presente"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        Pré-visualizar
      </button>

      <Footer />

      {showEditModal && (
        <EditarPaginasModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  )
}
