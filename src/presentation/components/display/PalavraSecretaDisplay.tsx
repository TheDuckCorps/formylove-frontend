import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getContrastTextColor } from '@/shared/constants/colorPalette'
import { useSiteTheme } from '@/shared/context/SiteThemeContext'
import { fireConfettiFrom } from '@/shared/utils/confetti'
import { getThemeConfettiColors } from '@/shared/utils/siteTheme'
import { playLetterFound, playLetterWrong } from '@/shared/utils/audioEffects'
import { playWinSound } from '@/shared/utils/spinWheelAudio'
import {
  KEYBOARD_GAP,
  KEYBOARD_WIDTH,
  LETTER_SLOT,
  layoutWordRows,
  type DisplayRow,
} from '@/shared/utils/portugueseWordLayout'

interface Props {
  hint: string
  secret: string
  onComplete?: () => void
  previewMode?: boolean
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const DIGITS = '0123456789'.split('')

const GUESSABLE = /[A-Z0-9]/

const PREVIEW_MAX_WIDTH = 250

// Strips diacritics so Ã→A, Ç→C, É→E, etc.
function stripAccents(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function isGuessableChar(char: string): boolean {
  return GUESSABLE.test(stripAccents(char))
}

function extractWords(text: string): string[] {
  const words: string[] = []
  let current = ''

  for (const char of text) {
    if (isGuessableChar(char)) {
      current += char
      continue
    }
    if (current) {
      words.push(current)
      current = ''
    }
  }

  if (current) words.push(current)
  return words
}

interface GuessKeyProps {
  value: string
  guessedSet: Set<string>
  wrongFlashSet: Set<string>
  wrongGuessedSet: Set<string>
  hasWord: boolean
  isComplete: boolean
  theme: ReturnType<typeof useSiteTheme>
  onGuess: (value: string) => void
}

function GuessKey({
  value,
  guessedSet,
  wrongFlashSet,
  wrongGuessedSet,
  hasWord,
  isComplete,
  theme,
  onGuess,
}: GuessKeyProps) {
  const selected = guessedSet.has(value)
  const flashingWrong = wrongFlashSet.has(value)
  const unavailable = wrongGuessedSet.has(value)
  const disabled = !hasWord || selected || unavailable || isComplete

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => onGuess(value)}
      animate={flashingWrong ? { x: [0, -5, 5, -4, 4, 0] } : {}}
      transition={{ duration: 0.35 }}
      className={[
        'text-xs font-semibold rounded-md border transition flex items-center justify-center',
        flashingWrong && 'bg-red-50 text-red-600 border-red-400',
        unavailable && 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50',
        disabled && !selected && !flashingWrong && !unavailable &&
          'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed',
        !disabled && !selected && !flashingWrong &&
          'bg-white border-gray-300 text-gray-700 hover:border-[var(--site-primary)] hover:text-[var(--site-primary)]',
      ].filter(Boolean).join(' ')}
      style={{
        ...(selected
          ? {
              backgroundColor: theme.primary,
              borderColor: theme.primary,
              color: getContrastTextColor(theme.primary),
            }
          : undefined),
        width: LETTER_SLOT.width,
        height: LETTER_SLOT.height,
      }}
    >
      {value}
    </motion.button>
  )
}

function LetterCell({
  char,
  isComplete,
  guessedSet,
  animationIndex,
}: {
  char: string
  isComplete: boolean
  guessedSet: Set<string>
  animationIndex: number
}) {
  const normalizedChar = stripAccents(char)
  const revealed = guessedSet.has(normalizedChar)

  return (
    <motion.div
      className={[
        'border-b-2 flex items-center justify-center rounded-sm flex-shrink-0',
        isComplete ? 'border-green-500 bg-green-100' : 'border-gray-400 bg-transparent',
      ].join(' ')}
      style={{ width: LETTER_SLOT.width, height: LETTER_SLOT.height }}
      animate={isComplete ? { scale: [1, 1.18, 1] } : {}}
      transition={{ delay: animationIndex * 0.04, type: 'spring', stiffness: 380, damping: 16 }}
    >
      <AnimatePresence mode="wait">
        {revealed ? (
          <motion.span
            key="revealed"
            className={['font-bold', isComplete ? 'text-green-700' : 'text-gray-800'].join(' ')}
            style={{ fontSize: LETTER_SLOT.fontSize }}
            initial={{ opacity: 0, y: -8, scale: 0.7 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            {char}
          </motion.span>
        ) : (
          <motion.span
            key="hidden"
            className="font-bold text-gray-400"
            style={{ fontSize: LETTER_SLOT.fontSize }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            _
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function WordRows({
  rows,
  isComplete,
  guessedSet,
}: {
  rows: DisplayRow[]
  isComplete: boolean
  guessedSet: Set<string>
}) {
  return (
    <div className="flex flex-col items-center gap-y-2 w-full">
      {rows.map((row, rowIdx) => (
        <div
          key={`row-${rowIdx}`}
          className="flex items-center justify-center"
          style={{ gap: LETTER_SLOT.gap, maxWidth: KEYBOARD_WIDTH }}
        >
          {row.chars.map((char, cellIdx) => (
            <LetterCell
              key={`${rowIdx}-${cellIdx}-${char}`}
              char={char}
              isComplete={isComplete}
              guessedSet={guessedSet}
              animationIndex={rowIdx * 10 + cellIdx}
            />
          ))}
          {row.endsWithHyphen && (
            <span
              className="font-bold text-gray-500 flex-shrink-0 ml-0.5"
              style={{ fontSize: LETTER_SLOT.fontSize }}
              aria-hidden
            >
              -
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

export function PalavraSecretaDisplay({ hint, secret, onComplete, previewMode = false }: Props) {
  const theme = useSiteTheme()

  // displaySecret keeps original accents for rendering
  const displaySecret = useMemo(() => secret.toUpperCase(), [secret])
  // normalizedSecret has accents stripped — used for game logic (A-Z and 0-9)
  const normalizedSecret = useMemo(() => stripAccents(displaySecret), [displaySecret])

  const [guessed, setGuessed] = useState<string[]>([])
  const [wrongGuessed, setWrongGuessed] = useState<string[]>([])
  const [wrongFlash, setWrongFlash] = useState<string[]>([])
  const completedRef = useRef(false)
  const wordRef = useRef<HTMLDivElement>(null)

  const guessedSet = useMemo(() => new Set(guessed), [guessed])
  const wrongGuessedSet = useMemo(() => new Set(wrongGuessed), [wrongGuessed])
  const wrongFlashSet = useMemo(() => new Set(wrongFlash), [wrongFlash])

  const maxWidth = previewMode ? PREVIEW_MAX_WIDTH : KEYBOARD_WIDTH

  const wordLayouts = useMemo(() => {
    return displaySecret.split('\n').flatMap((line) => {
      const words = extractWords(line)
      return words.map((word) => ({
        word,
        rows: layoutWordRows(word, maxWidth),
      }))
    })
  }, [displaySecret, maxWidth])

  // Only count A-Z and 0-9 in the normalized version
  const guessableChars = normalizedSecret.replace(/[^A-Z0-9]/g, '')
  const hasWord = guessableChars.length > 0
  const isComplete = hasWord && [...guessableChars].every((char) => guessedSet.has(char))

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
      if (!previewMode) {
        if (wordRef.current) fireConfettiFrom(wordRef.current, getThemeConfettiColors(theme))
        playWinSound()
      }
    }
  }, [isComplete, onComplete, previewMode, theme])

  function handleGuess(letter: string) {
    if (!hasWord || isComplete) return
    if (guessedSet.has(letter) || wrongGuessedSet.has(letter) || wrongFlashSet.has(letter)) return

    // Compare against normalized secret (accent-stripped)
    if (normalizedSecret.includes(letter)) {
      if (!previewMode) playLetterFound()
      setGuessed((prev) => [...prev, letter])
      return
    }

    if (!previewMode) playLetterWrong()
    setWrongFlash((prev) => [...prev, letter])
    window.setTimeout(() => {
      setWrongFlash((prev) => prev.filter((l) => l !== letter))
      setWrongGuessed((prev) => [...prev, letter])
    }, 650)
  }

  return (
    <div className="mx-auto w-full space-y-4" style={{ maxWidth: KEYBOARD_WIDTH }}>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-700 font-semibold uppercase tracking-wide mb-1">Dica</p>
        <p className="text-sm text-gray-800">{hint || 'Sem dica definida'}</p>
      </div>

      <div ref={wordRef} className="flex flex-col items-center gap-y-3 w-full">
        {wordLayouts.length > 0 ? (
          wordLayouts.map(({ word, rows }, layoutIdx) => (
            <WordRows
              key={`${layoutIdx}-${word}`}
              rows={rows}
              isComplete={isComplete}
              guessedSet={guessedSet}
            />
          ))
        ) : displaySecret ? null : (
          <p className="text-sm text-gray-400">Sem palavra/frase definida</p>
        )}
      </div>

      {/* Completion banner */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{
              opacity: 1,
              scale: [0.5, 1.12, 0.96, 1.04, 1],
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, scale: { type: 'spring', stiffness: 420, damping: 18 } }}
            className="relative overflow-hidden bg-green-50 border-2 border-green-400 rounded-2xl px-6 py-4 text-center shadow-lg"
          >
            {/* shimmer */}
            <motion.div
              className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{ delay: 0.3, duration: 0.55, ease: 'easeInOut' }}
            />
            <p className="text-xs text-green-600 font-semibold uppercase tracking-widest mb-1">
              Parabéns!
            </p>
            <p className="text-lg font-extrabold text-green-700">Você descobriu a palavra!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard */}
      {!hasWord ? (
        <p className="text-sm text-gray-400 text-center">Palavra secreta não configurada</p>
      ) : (
        <div className="space-y-2 pt-6 w-full">
          <div
            className="grid grid-cols-7 w-full"
            style={{ gap: KEYBOARD_GAP, width: KEYBOARD_WIDTH }}
          >
            {DIGITS.slice(0, 7).map((digit) => (
              <GuessKey
                key={digit}
                value={digit}
                guessedSet={guessedSet}
                wrongFlashSet={wrongFlashSet}
                wrongGuessedSet={wrongGuessedSet}
                hasWord={hasWord}
                isComplete={isComplete}
                theme={theme}
                onGuess={handleGuess}
              />
            ))}
          </div>
          <div
            className="flex justify-center w-full"
            style={{ gap: KEYBOARD_GAP, width: KEYBOARD_WIDTH }}
          >
            {DIGITS.slice(7).map((digit) => (
              <GuessKey
                key={digit}
                value={digit}
                guessedSet={guessedSet}
                wrongFlashSet={wrongFlashSet}
                wrongGuessedSet={wrongGuessedSet}
                hasWord={hasWord}
                isComplete={isComplete}
                theme={theme}
                onGuess={handleGuess}
              />
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3" />
          <div
            className="grid grid-cols-7 w-full"
            style={{ gap: KEYBOARD_GAP, width: KEYBOARD_WIDTH }}
          >
            {ALPHABET.map((letter) => (
              <GuessKey
                key={letter}
                value={letter}
                guessedSet={guessedSet}
                wrongFlashSet={wrongFlashSet}
                wrongGuessedSet={wrongGuessedSet}
                hasWord={hasWord}
                isComplete={isComplete}
                theme={theme}
                onGuess={handleGuess}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
