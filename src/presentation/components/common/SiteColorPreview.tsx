import { getContrastTextColor } from '@/shared/constants/colorPalette'
import { buildSiteTheme } from '@/shared/utils/siteTheme'

interface Props {
  color: string
}

export function SiteColorPreview({ color }: Props) {
  const theme = buildSiteTheme(color)
  const onPrimary = getContrastTextColor(theme.primary)

  return (
    <div className="w-full rounded-xl border border-gray-200 overflow-hidden">
      <p className="text-[10px] font-semibold text-gray-500 px-2.5 py-1.5 bg-gray-50 border-b border-gray-100">
        Prévia do presente
      </p>

      <div
        className="relative p-3 min-h-[9.5rem]"
        style={{ background: theme.pageGradient }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: theme.radialAccent }}
          aria-hidden
        />

        <div className="relative space-y-2.5">
          <div className="h-1.5 w-full rounded-full overflow-hidden bg-gray-200">
            <div
              className="h-full w-[65%] rounded-full"
              style={{ backgroundColor: theme.primary }}
            />
          </div>

          <div
            className="rounded-xl border bg-white/80 backdrop-blur-[1px] p-2.5 text-center text-[10px] text-gray-600 shadow-sm"
            style={{ borderColor: theme.borderSoft }}
          >
            Uma surpresa pra você
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              tabIndex={-1}
              className="flex-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold"
              style={{
                backgroundColor: theme.primary,
                color: onPrimary,
                boxShadow: theme.buttonShadow,
              }}
            >
              Próxima página
            </button>
            <button
              type="button"
              tabIndex={-1}
              className="rounded-xl px-2 py-1.5 text-[10px] font-semibold bg-white"
              style={{
                color: theme.primary,
                border: `1px solid ${theme.primary}`,
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
