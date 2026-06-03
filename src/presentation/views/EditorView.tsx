import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditorHeader } from '../components/layout/EditorHeader'
import { Footer } from '../components/layout/Footer'
import { Button } from '../components/common/Button'
import { EditarPaginasModal } from '../modals/EditarPaginasModal'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { ROUTES } from '@/shared/constants/routes'

// Page editor components
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        <PageEditorSwitch
          type={currentPage.type}
          data={currentPage.data}
          onChange={(d) => updatePageData(currentPage.id, d)}
        />

        <div className="mt-10 flex flex-col items-center gap-3">
          <Button size="lg" fullWidth onClick={handleNext}>
            Continuar
          </Button>
          <button
            onClick={() => navigate(ROUTES.CRIAR_QRCODE)}
            className="text-sm text-brand hover:underline"
          >
            Pré-visualizar resultado
          </button>
        </div>
      </main>

      <Footer />

      {showEditModal && (
        <EditarPaginasModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  )
}
