import { useMemo, useState } from 'react'
import { HeartConfetti } from './HeartConfetti'

interface Props {
  hint: string
  secret: string
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function PalavraSecretaDisplay({ hint, secret }: Props) {
  const normalizedSecret = useMemo(() => secret.toUpperCase(), [secret])
  const [guessed, setGuessed] = useState<string[]>([])
  const [wrongGuessed, setWrongGuessed] = useState<string[]>([])
  const [wrongFlash, setWrongFlash] = useState<string[]>([])

  const guessedSet = useMemo(() => new Set(guessed), [guessed])
  const wrongGuessedSet = useMemo(() => new Set(wrongGuessed), [wrongGuessed])
  const wrongFlashSet = useMemo(() => new Set(wrongFlash), [wrongFlash])
  const lettersOnly = normalizedSecret.replace(/[^A-Z]/g, '')
  const hasWord = lettersOnly.length > 0
  const isComplete =
    hasWord && [...lettersOnly].every((letter) => guessedSet.has(letter))

  function handleGuess(letter: string) {
    if (!hasWord || isComplete) return
    if (guessedSet.has(letter) || wrongGuessedSet.has(letter) || wrongFlashSet.has(letter)) return

    if (normalizedSecret.includes(letter)) {
      setGuessed((prev) => [...prev, letter])
      return
    }

    setWrongFlash((prev) => [...prev, letter])
    window.setTimeout(() => {
      setWrongFlash((prev) => prev.filter((l) => l !== letter))
      setWrongGuessed((prev) => [...prev, letter])
    }, 650)
  }

  return (
    <div className="space-y-4">
      <HeartConfetti active={isComplete} />

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-xs text-yellow-700 font-semibold uppercase tracking-wide mb-1">Dica</p>
        <p className="text-sm text-gray-800">{hint || 'Sem dica definida'}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {normalizedSecret ? (
          [...normalizedSecret].map((char, idx) => {
            if (!/[A-Z]/.test(char)) {
              return <span key={`${char}-${idx}`} className="w-3" />
            }
            const revealed = guessedSet.has(char)
            return (
              <div
                key={`${char}-${idx}`}
                className="w-8 h-10 border-b-2 border-gray-400 flex items-center justify-center"
              >
                <span className="font-bold text-gray-800">{revealed ? char : '_'}</span>
              </div>
            )
          })
        ) : (
          <p className="text-sm text-gray-400">Sem palavra/frase definida</p>
        )}
      </div>

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
              <button
                key={letter}
                type="button"
                disabled={disabled}
                onClick={() => handleGuess(letter)}
                className={[
                  'text-xs font-semibold rounded-md py-2 border transition',
                  selected && 'bg-brand text-white border-brand',
                  flashingWrong && 'bg-red-50 text-red-600 border-red-400 animate-bounce',
                  unavailable && 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-70',
                  disabled && !selected && !flashingWrong && !unavailable &&
                    'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed',
                  !disabled && !flashingWrong &&
                    'bg-white border-gray-300 text-gray-700 hover:border-brand hover:text-brand',
                ].filter(Boolean).join(' ')}
              >
                {letter}
              </button>
            )
          })}
        </div>
      )}

      {isComplete && (
        <div className="text-center rounded-lg bg-green-50 border border-green-200 py-2 animate-bounce">
          <p className="text-sm font-semibold text-green-700">Você acertou!</p>
        </div>
      )}
    </div>
  )
}
