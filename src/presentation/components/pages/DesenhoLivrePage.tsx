import { Suspense, lazy, useCallback, useMemo, useRef } from 'react'
import '@excalidraw/excalidraw/index.css'
import type { DesenhoLivreData } from '@/core/entities/Page'
import { FieldError } from '../common/FieldError'
import type {
  AppState,
  BinaryFiles,
  ExcalidrawInitialDataState,
} from '@excalidraw/excalidraw/types'
import type { OrderedExcalidrawElement } from '@excalidraw/excalidraw/element/types'

const ExcalidrawEditor = lazy(() =>
  import('@excalidraw/excalidraw').then((mod) => ({ default: mod.Excalidraw })),
)

interface Props {
  data: DesenhoLivreData
  onChange: (data: Partial<DesenhoLivreData>) => void
  fieldErrors?: Record<string, string>
}

function parseInitialData(
  excalidrawData: string | null | undefined,
): ExcalidrawInitialDataState | null {
  if (!excalidrawData) return null
  try {
    const parsed = JSON.parse(excalidrawData) as {
      elements?: ExcalidrawInitialDataState['elements']
      appState?: ExcalidrawInitialDataState['appState']
      files?: ExcalidrawInitialDataState['files']
    }
    return {
      elements: parsed.elements ?? [],
      appState: parsed.appState,
      files: parsed.files,
    }
  } catch {
    return null
  }
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

function buildEditorInitialData(
  parsed: ExcalidrawInitialDataState | null,
): ExcalidrawInitialDataState {
  return {
    elements: parsed?.elements ?? [],
    files: parsed?.files,
    appState: {
      ...parsed?.appState,
      activeTool: {
        ...(parsed?.appState?.activeTool ?? { lastActiveTool: null, locked: false }),
        type: 'freedraw',
        customType: null,
        locked: false,
      },
    },
  }
}

export function DesenhoLivrePage({ data, onChange, fieldErrors = {} }: Props) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange

  const parsedInitial = useMemo(
    () => parseInitialData(data.excalidrawData),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remounted per page via key in EditorView
    [],
  )

  const editorInitialData = useMemo(
    () => buildEditorInitialData(parsedInitial),
    [parsedInitial],
  )

  const handleChange = useCallback(
    (elements: readonly OrderedExcalidrawElement[], appState: AppState, files: BinaryFiles) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(async () => {
        const { serializeAsJSON, exportToBlob, getNonDeletedElements } = await import(
          '@excalidraw/excalidraw'
        )

        const excalidrawData = serializeAsJSON(elements, appState, files, 'local')
        const nonDeleted = getNonDeletedElements(elements)

        if (nonDeleted.length === 0) {
          onChangeRef.current({ excalidrawData, drawingDataUrl: null })
          return
        }

        try {
          const blob = await exportToBlob({
            elements: nonDeleted,
            appState: {
              ...appState,
              exportBackground: true,
              viewBackgroundColor: appState.viewBackgroundColor ?? '#ffffff',
            },
            files,
            mimeType: 'image/png',
          })
          const drawingDataUrl = await blobToDataUrl(blob)
          onChangeRef.current({ excalidrawData, drawingDataUrl })
        } catch {
          onChangeRef.current({ excalidrawData })
        }
      }, 400)
    },
    [],
  )

  return (
    <div className="flex flex-col gap-2">
      <div
        className={[
          'desenho-livre-excalidraw h-[420px] w-full border-2 rounded-xl overflow-hidden bg-white relative',
          fieldErrors.drawingDataUrl ? 'border-red-400' : 'border-gray-200',
        ].join(' ')}
      >
        <Suspense
          fallback={
            <div className="h-full flex items-center justify-center text-sm text-gray-400">
              Carregando editor de desenho...
            </div>
          }
        >
          <ExcalidrawEditor
            initialData={editorInitialData}
            onChange={handleChange}
            UIOptions={{
              canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                export: false,
                toggleTheme: false,
              },
              tools: {
                image: false,
              },
            }}
          />
        </Suspense>
      </div>
      <FieldError message={fieldErrors.drawingDataUrl} />
    </div>
  )
}
