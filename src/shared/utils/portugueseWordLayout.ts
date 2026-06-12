import { hyphenateSync } from 'hyphen/pt'

export const LETTER_SLOT = {
  width: 32,
  height: 32,
  gap: 6,
  fontSize: 16,
} as const

export const KEYBOARD_COLS = 7
export const KEYBOARD_GAP = 8

/** Largura natural do teclado (7 colunas) — usada para centralizar sem esticar em telas grandes. */
export const KEYBOARD_WIDTH =
  KEYBOARD_COLS * LETTER_SLOT.width + (KEYBOARD_COLS - 1) * KEYBOARD_GAP

export interface DisplayRow {
  chars: string[]
  endsWithHyphen: boolean
}

export function getMaxCharsPerLine(maxWidth: number): number {
  const { width, gap } = LETTER_SLOT
  return Math.max(1, Math.floor((maxWidth + gap) / (width + gap)))
}

function getSyllables(word: string): string[] {
  const hyphenated = hyphenateSync(word)
  const syllables = hyphenated.split('\u00AD')
  return syllables.length > 0 ? syllables : [word]
}

function splitLongChunk(word: string, maxPerLine: number): string[] {
  if (word.length <= maxPerLine) return [word]

  const lines: string[] = []
  let idx = 0

  while (idx < word.length) {
    const remaining = word.length - idx
    const isLast = remaining <= maxPerLine
    const take = isLast ? remaining : maxPerLine
    lines.push(word.slice(idx, idx + take))
    idx += take
  }

  return lines
}

function packSyllables(syllables: string[], maxPerLine: number): string[] {
  const lines: string[] = []
  let start = 0

  while (start < syllables.length) {
    let end = start

    while (end + 1 < syllables.length) {
      const next = end + 1
      const combined = syllables.slice(start, next + 1).join('')
      if (combined.length <= maxPerLine) {
        end = next
      } else {
        break
      }
    }

    const combined = syllables.slice(start, end + 1).join('')
    if (combined.length <= maxPerLine) {
      lines.push(combined)
      start = end + 1
      continue
    }

    lines.push(combined.slice(0, maxPerLine))
    syllables.splice(start, end - start + 1, combined.slice(maxPerLine))
  }

  return lines
}

function getTextLines(word: string, maxPerLine: number): string[] {
  if (word.length <= maxPerLine) return [word]

  const syllables = getSyllables(word)
  if (syllables.length === 1) return splitLongChunk(word, maxPerLine)

  return packSyllables(syllables, maxPerLine)
}

export function layoutWordRows(word: string, maxWidth: number): DisplayRow[] {
  const maxPerLine = getMaxCharsPerLine(maxWidth)
  const textLines = getTextLines(word, maxPerLine)

  return textLines.map((line, index) => ({
    chars: [...line],
    endsWithHyphen: index < textLines.length - 1,
  }))
}
