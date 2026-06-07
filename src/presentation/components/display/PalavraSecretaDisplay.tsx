import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fireConfettiFrom } from '@/shared/utils/confetti'
import { playLetterFound, playLetterWrong } from '@/shared/utils/audioEffects'
import { playWinSound } from '@/shared/utils/spinWheelAudio'

interface Props {
  hint: string
  secret: string
  onComplete?: () => void
  previewMode?: boolean
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Strips diacritics so Ã→A, Ç→C, É→E, etc.
function stripAccents(str: string): string {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function PalavraSecretaDisplay({ hint, secret, onComplete, previewMode = false }: Props) {
  // displaySecret keeps original accents for rendering
  const displaySecret = useMemo(() => secret.toUpperCase(), [secret])
  // normalizedSecret has accents stripped — used for game logic (A-Z only)
  const normalizedSecret = useMemo(() => stripAccents(displaySecret), [displaySecret])

  const [guessed, setGuessed] = useState<string[]>([])
  const [wrongGuessed, setWrongGuessed] = useState<string[]>([])
  const [wrongFlash, setWrongFlash] = useState<string[]>([])
  const completedRef = useRef(false)
  const wordRef = useRef<HTMLDivElement>(null)

  const guessedSet = useMemo(() => new Set(guessed), [guessed])
  const wrongGuessedSet = useMemo(() => new Set(wrongGuessed), [wrongGuessed])
  const wrongFlashSet = useMemo(() => new Set(wrongFlash), [wrongFlash])

  // Only count A-Z letters in the normalized version
  const lettersOnly = normalizedSecret.replace(/[^A-Z]/g, '')
  const hasWord = lettersOnly.length > 0
  const isComplete = hasWord && [...lettersOnly].every((letter) => guessedSet.has(letter))

  useEffect(() => {
    if (isComplete && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
      if (!previewMode) {
        if (wordRef.current) fireConfettiFrom(wordRef.current)
        playWinSound()
      }
    }
  }, [isComplete, onComplete, previewMode])

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
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-700 font-semibold uppercase tracking-wide mb-1">Dica</p>
        <p className="text-sm text-gray-800">{hint || 'Sem dica definida'}</p>
      </div>

      <div ref={wordRef} className="flex flex-wrap justify-center gap-2">
        {displaySecret ? (
          [...displaySecret].map((char, idx) => {
            // Use normalized char to decide if it's a letter or separator
            const normalizedChar = stripAccents(char)
            if (!/[A-Z]/.test(normalizedChar)) {
              return <span key={`sep-${idx}`} className="w-3" />
            }
            // Revealed when the base letter (no accent) has been guessed
            const revealed = guessedSet.has(normalizedChar)
            return (
              <motion.div
                key={`${char}-${idx}`}
                className={[
                  'w-9 h-11 border-b-2 flex items-center justify-center rounded-sm',
                  isComplete
                    ? 'border-green-500 bg-green-100'
                    : 'border-gray-400 bg-transparent',
                ].join(' ')}
                animate={isComplete ? { scale: [1, 1.18, 1] } : {}}
                transition={{ delay: idx * 0.04, type: 'spring', stiffness: 380, damping: 16 }}
              >
                <AnimatePresence mode="wait">
                  {revealed ? (
                    <motion.span
                      key="revealed"
                      className={[
                        'font-bold text-lg',
                        isComplete ? 'text-green-700' : 'text-gray-800',
                      ].join(' ')}
                      initial={{ opacity: 0, y: -8, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      {char}
                    </motion.span>
                  ) : (
                    <motion.span
                      key="hidden"
                      className="font-bold text-lg text-gray-400"
                      initial={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      _
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })
        ) : (
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

      {/* Alphabet */}
      {!hasWord ? (
        <p className="text-sm text-gray-400 text-center">Palavra secreta não configurada</p>
      ) : (
        <div className="grid grid-cols-7 gap-2">
          {ALPHABET.map((letter) => {
            const selected = guessedSet.has(letter)
            const flashingWrong = wrongFlashSet.has(letter)
            const unavailable = wrongGuessedSet.has(letter)
            const disabled = !hasWord || selected || unavailable || isComplete

            return (
              <motion.button
                key={letter}
                type="button"
                disabled={disabled}
                onClick={() => handleGuess(letter)}
                animate={flashingWrong ? { x: [0, -5, 5, -4, 4, 0] } : {}}
                transition={{ duration: 0.35 }}
                className={[
                  'text-xs font-semibold rounded-md py-2.5 border transition',
                  selected && 'bg-brand text-white border-brand',
                  flashingWrong && 'bg-red-50 text-red-600 border-red-400',
                  unavailable && 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-50',
                  disabled && !selected && !flashingWrong && !unavailable &&
                    'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed',
                  !disabled && !flashingWrong &&
                    'bg-white border-gray-300 text-gray-700 hover:border-brand hover:text-brand',
                ].filter(Boolean).join(' ')}
              >
                {letter}
              </motion.button>
            )
          })}
        </div>
      )}
    </div>
  )
}
