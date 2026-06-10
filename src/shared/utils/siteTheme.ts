function parseHex(hex: string): { r: number; g: number; b: number } | null {
  const normalized = hex.replace('#', '').trim()
  if (!/^[0-9A-Fa-f]{6}$/.test(normalized)) return null
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  }
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (value: number) => Math.max(0, Math.min(255, Math.round(value)))
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((value) => value.toString(16).padStart(2, '0'))
    .join('')}`
}

function mixWithWhite(hex: string, amount: number): string {
  const rgb = parseHex(hex)
  if (!rgb) return hex
  return toHex(
    rgb.r + (255 - rgb.r) * amount,
    rgb.g + (255 - rgb.g) * amount,
    rgb.b + (255 - rgb.b) * amount,
  )
}

function mixWithBlack(hex: string, amount: number): string {
  const rgb = parseHex(hex)
  if (!rgb) return hex
  return toHex(rgb.r * (1 - amount), rgb.g * (1 - amount), rgb.b * (1 - amount))
}

function withAlpha(hex: string, alpha: number): string {
  const rgb = parseHex(hex)
  if (!rgb) return `rgba(198, 42, 135, ${alpha})`
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

export interface SiteTheme {
  primary: string
  light: string
  lighter: string
  dark: string
  pageGradient: string
  brandGradient: string
  radialAccent: string
  softFill: string
  borderSoft: string
  buttonShadow: string
}

export function getThemeConfettiColors(theme: SiteTheme): string[] {
  return [theme.primary, theme.light, theme.lighter, theme.dark, '#ffffff']
}

export function buildSiteTheme(color: string): SiteTheme {
  const normalized = parseHex(color)
  const primary = normalized
    ? color.startsWith('#') ? color : `#${color.replace('#', '')}`
    : '#C62A87'
  const light = mixWithWhite(primary, 0.55)
  const lighter = mixWithWhite(primary, 0.88)
  const dark = mixWithBlack(primary, 0.18)

  return {
    primary,
    light,
    lighter,
    dark,
    pageGradient: `linear-gradient(180deg, #ffffff 55%, ${lighter} 100%)`,
    brandGradient: `linear-gradient(135deg, ${primary} 0%, ${light} 100%)`,
    radialAccent: `radial-gradient(ellipse 90% 70% at 50% -10%, ${withAlpha(primary, 0.22)} 0%, transparent 68%)`,
    softFill: withAlpha(primary, 0.1),
    borderSoft: withAlpha(primary, 0.28),
    buttonShadow: `0 2px 12px ${withAlpha(primary, 0.28)}`,
  }
}
