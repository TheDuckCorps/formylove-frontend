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
    hex: '#DC2626',
    shades: ['#FEE2E2', '#FCA5A5', '#F87171', '#DC2626', '#991B1B'],
  },
  {
    id: 'laranja',
    name: 'Laranja',
    hex: '#FF8A00',
    shades: ['#FFF4E6', '#FFD299', '#FFB04D', '#FF8A00', '#B36000'],
  },
  {
    id: 'coral',
    name: 'Coral',
    hex: '#F97316',
    shades: ['#FFEDD5', '#FDBA74', '#FB923C', '#F97316', '#9A3412'],
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
    hex: '#14B8A6',
    shades: ['#CCFBF1', '#99F6E4', '#5EEAD4', '#14B8A6', '#0F766E'],
  },
  {
    id: 'ciano',
    name: 'Ciano',
    hex: '#0891B2',
    shades: ['#CFFAFE', '#67E8F9', '#22D3EE', '#0891B2', '#155E75'],
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
    hex: '#D946EF',
    shades: ['#FAE8FF', '#F0ABFC', '#E879F9', '#D946EF', '#86198F'],
  },
  {
    id: 'pink',
    name: 'Pink',
    hex: '#E91E8C',
    shades: ['#FCE7F3', '#F9A8D4', '#F472B6', '#E91E8C', '#9D174D'],
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
