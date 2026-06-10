import { createContext, useContext, useMemo, type CSSProperties, type ReactNode } from 'react'
import { DEFAULT_SITE_COLOR } from '@/shared/constants/colorPalette'
import { buildSiteTheme, type SiteTheme } from '@/shared/utils/siteTheme'

const SiteThemeContext = createContext<SiteTheme>(buildSiteTheme(DEFAULT_SITE_COLOR))

interface ProviderProps {
  color?: string
  children: ReactNode
}

export function SiteThemeProvider({ color, children }: ProviderProps) {
  const theme = useMemo(() => buildSiteTheme(color ?? DEFAULT_SITE_COLOR), [color])

  const cssVars = {
    '--site-primary': theme.primary,
    '--site-light': theme.light,
    '--site-lighter': theme.lighter,
    '--site-dark': theme.dark,
    '--site-page-gradient': theme.pageGradient,
    '--site-brand-gradient': theme.brandGradient,
    '--site-radial-accent': theme.radialAccent,
    '--site-soft-fill': theme.softFill,
    '--site-border-soft': theme.borderSoft,
    '--site-button-shadow': theme.buttonShadow,
  } as CSSProperties

  return (
    <SiteThemeContext.Provider value={theme}>
      <div className="site-theme-root" style={cssVars}>
        {children}
      </div>
    </SiteThemeContext.Provider>
  )
}

export function useSiteTheme(): SiteTheme {
  return useContext(SiteThemeContext)
}
