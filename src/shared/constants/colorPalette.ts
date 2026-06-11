export interface BaseColor {
  id: string
  name: string
  hex: string
  shades: [string, string, string, string, string]
}

export const BASE_COLORS: BaseColor[] = [
  {
    id: 'preto',
    name: 'Preto',
    hex: '#171717',
    shades: ['#F5F5F5', '#D4D4D4', '#737373', '#171717', '#0A0A0A'],
  },

  {
    id: 'vermelho',
    name: 'Vermelho',
    hex: '#E11D48',
    shades: ['#FFE4EA', '#FDA4AF', '#FB7185', '#E11D48', '#881337'],
  },

  {
    id: 'laranja',
    name: 'Laranja',
    hex: '#FF7A00',
    shades: ['#FFF2E5', '#FFD0A3', '#FFA94D', '#FF7A00', '#A64E00'],
  },

  {
    id: 'coral',
    name: 'Coral',
    hex: '#FF5A5F',
    shades: ['#FFE5E6', '#FFB3B6', '#FF858A', '#FF5A5F', '#A1262A'],
  },

  {
    id: 'verde',
    name: 'Verde',
    hex: '#16A34A',
    shades: ['#DCFCE7', '#86EFAC', '#4ADE80', '#16A34A', '#166534'],
  },

  {
    id: 'turquesa',
    name: 'Turquesa',
    hex: '#00C2A8',
    shades: ['#D9FFF8', '#7CF4E2', '#33E2C6', '#00C2A8', '#0F766E'],
  },

  {
    id: 'ciano',
    name: 'Ciano',
    hex: '#06B6D4',
    shades: ['#CFFAFE', '#67E8F9', '#22D3EE', '#06B6D4', '#155E75'],
  },

  {
    id: 'azul',
    name: 'Azul',
    hex: '#2563EB',
    shades: ['#DBEAFE', '#93C5FD', '#60A5FA', '#2563EB', '#1E40AF'],
  },

  {
    id: 'lilas',
    name: 'Lilás',
    hex: '#8B5CF6',
    shades: ['#F5F3FF', '#DDD6FE', '#A78BFA', '#8B5CF6', '#6D28D9'],
  },

  {
    id: 'magenta',
    name: 'Magenta',
    hex: '#C026D3',
    shades: ['#FAE8FF', '#F5D0FE', '#E879F9', '#C026D3', '#701A75'],
  },

  {
    id: 'pink',
    name: 'Pink',
    hex: '#FF1493',
    shades: ['#FFE5F4', '#FFB3DB', '#FF66BF', '#FF1493', '#9F0B5D'],
  },

  {
    id: 'rosa',
    name: 'Rosa',
    hex: '#C62A87',
    shades: ['#FCE4F3', '#F9B8E0', '#E879B8', '#C62A87', '#8B1D5F'],
  }
]
export const COLOR_GRID_COLUMNS = 3
export const COLOR_GRID_ROWS = 4

export const DEFAULT_SITE_COLOR = '#C62A87'

export const DEFAULT_WHEEL_COLORS = [
  '#C62A87',
  '#8B5CF6',
  '#DC2626',
  '#F97316',
] as const

export const WHEEL_COLOR_SLOTS = 4

export function normalizeWheelColors(colors?: string[]): string[] {
  if (colors?.length === WHEEL_COLOR_SLOTS) return [...colors]
  const base: string[] = [...DEFAULT_WHEEL_COLORS]
  if (colors?.length) {
    colors.forEach((color, index) => {
      if (index < WHEEL_COLOR_SLOTS) base[index] = color
    })
  }
  return base
}

export function findColorSelection(hex: string): { colorIndex: number; shadeIndex: number } {
  const normalized = hex.toUpperCase()
  for (let colorIndex = 0; colorIndex < BASE_COLORS.length; colorIndex += 1) {
    const shadeIndex = BASE_COLORS[colorIndex].shades.findIndex(
      (shade) => shade.toUpperCase() === normalized,
    )
    if (shadeIndex !== -1) return { colorIndex, shadeIndex }
  }
  const rosaIndex = BASE_COLORS.findIndex((c) => c.id === 'rosa')
  return { colorIndex: rosaIndex >= 0 ? rosaIndex : 0, shadeIndex: 3 }
}

export function isLightColor(hex: string): boolean {
  const value = hex.replace('#', '')
  const r = parseInt(value.slice(0, 2), 16)
  const g = parseInt(value.slice(2, 4), 16)
  const b = parseInt(value.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.62
}

export function getContrastTextColor(hex: string): '#171717' | '#ffffff' {
  return isLightColor(hex) ? '#171717' : '#ffffff'
}
