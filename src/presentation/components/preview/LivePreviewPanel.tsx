import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PageItem } from '@/core/entities/Page'
import { PagePreviewContent } from './PagePreviewContent'

interface Props {
  page: PageItem
  pageIndex?: number
  totalPages?: number
}

export function LivePreviewPanel({ page, pageIndex = 0, totalPages = 1 }: Props) {
  const meta = PAGE_TYPES_META.find((m) => m.type === page.type)

  return (
    <div className="w-full max-w-[300px] mx-auto">
      <div className="border-[6px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col aspect-[9/19] bg-gray-50">
        <div className="bg-gray-800 h-6 flex-shrink-0 flex items-center justify-center">
          <div className="w-16 h-1 bg-gray-600 rounded-full" />
        </div>

        <div className="bg-gradient-to-b from-pink-50 to-white flex-1 overflow-y-auto p-3 min-h-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                {meta?.svgIcon ? (
                  <img src={meta.svgIcon} alt="" className="w-5 h-5 object-contain" draggable={false} />
                ) : null}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-medium">
                  Página {pageIndex + 1} de {totalPages}
                </p>
                <p className="text-xs font-semibold text-gray-800 truncate">{meta?.label ?? page.type}</p>
              </div>
            </div>
            <PagePreviewContent type={page.type} data={page.data} />
          </div>
        </div>

        <div className="bg-gray-800 h-5 flex-shrink-0 flex items-center justify-center">
          <div className="w-20 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  )
}
