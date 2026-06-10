import { PAGE_TYPES_META } from '@/core/entities/Page'
import type { PageItem } from '@/core/entities/Page'
import { Logo } from '@/presentation/components/common/Logo'
import { SiteThemeProvider, useSiteTheme } from '@/shared/context/SiteThemeContext'
import { useSiteBuilderStore } from '@/shared/store/siteBuilderStore'
import { PagePreviewContent } from './PagePreviewContent'

interface Props {
  page: PageItem
  pageIndex?: number
  totalPages?: number
}

function LivePreviewPanelInner({ page, pageIndex = 0, totalPages = 1 }: Props) {
  const theme = useSiteTheme()
  const meta = PAGE_TYPES_META.find((m) => m.type === page.type)

  return (
    <div className="w-full max-w-[340px] mx-auto">
      <div className="border-[6px] border-gray-800 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col aspect-[9/19] bg-gray-50">
        <div className="bg-gray-800 h-6 flex-shrink-0 flex items-center justify-center">
          <div className="w-16 h-1 bg-gray-600 rounded-full" />
        </div>

        <div
          className="flex-1 overflow-y-auto p-3 min-h-0 relative"
          style={{ background: theme.pageGradient }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: theme.radialAccent }}
            aria-hidden
          />
          <div className="relative z-10">
            <div className="flex justify-center pb-2">
              <Logo size="sm" color={theme.primary} />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                  style={{ backgroundColor: theme.softFill }}
                >
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
        </div>

        <div className="bg-gray-800 h-5 flex-shrink-0 flex items-center justify-center">
          <div className="w-20 h-1 bg-gray-600 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function LivePreviewPanel(props: Props) {
  const siteColor = useSiteBuilderStore((s) => s.siteColor)

  return (
    <SiteThemeProvider color={siteColor}>
      <LivePreviewPanelInner {...props} />
    </SiteThemeProvider>
  )
}
