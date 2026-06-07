import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fireConfettiFrom } from '@/shared/utils/confetti'
import { playCorrectAnswer, playWrongAnswer } from '@/shared/utils/audioEffects'

interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

interface Props {
  question: string
  answers: Answer[]
  onComplete?: () => void
  previewMode?: boolean
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 shrink-0">
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )
}


export function QuizAfetivoDisplay({ question, answers, onComplete, previewMode = false }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [shakeKey, setShakeKey] = useState(0)
  const completedRef = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isCorrect === true && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
      if (!previewMode && gridRef.current) {
        fireConfettiFrom(gridRef.current)
      }
    }
    if (isCorrect === false) {
      const t = setTimeout(() => {
        setSelectedId(null)
        setIsCorrect(null)
      }, 900)
      return () => clearTimeout(t)
    }
    return
  }, [isCorrect, onComplete, previewMode])

  function handleSelect(answer: Answer) {
    if (isCorrect === true) return
    if (answer.isCorrect) {
      playCorrectAnswer()
    } else {
      setShakeKey((k) => k + 1)
      playWrongAnswer()
    }
    setSelectedId(answer.id)
    setIsCorrect(answer.isCorrect)
  }

  return (
    <div className="space-y-4">
      <p className="text-lg font-semibold text-gray-800 text-center">
        {question || 'Pergunta não definida'}
      </p>

      <div ref={gridRef} className="grid grid-cols-2 gap-3">
        {answers.map((answer) => {
          const selected = selectedId === answer.id
          const wrong = selected && isCorrect === false
          const correct = selected && isCorrect === true

          return (
            <motion.button
              key={answer.id}
              // Re-key the shake so it replays on each wrong attempt
              {...(wrong ? { key: `${answer.id}-shake-${shakeKey}` } : {})}
              type="button"
              disabled={isCorrect === true}
              onClick={() => handleSelect(answer)}
              initial={false}
              animate={
                wrong
                  ? { x: [0, -10, 10, -8, 8, -5, 5, 0], scale: 1 }
                  : correct
                  ? { scale: [1, 1.06, 1], x: 0 }
                  : { scale: 1, x: 0 }
              }
              transition={
                wrong
                  ? { duration: 0.45, ease: 'easeInOut' }
                  : { type: 'spring', stiffness: 380, damping: 18 }
              }
              className={[
                'relative flex items-center gap-2 text-sm px-3 py-4 rounded-xl border text-left font-medium transition-colors',
                correct
                  ? 'border-green-500 bg-green-50 text-green-700 shadow-[0_0_0_3px_rgba(34,197,94,0.2)]'
                  : wrong
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand hover:bg-brand/5',
                isCorrect === true && !correct && 'opacity-50 cursor-not-allowed',
              ].join(' ')}
            >
              <AnimatePresence mode="wait">
                {correct && (
                  <motion.span
                    key="check"
                    className="text-green-600"
                    initial={{ scale: 0, opacity: 0, x: -8 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <CheckIcon />
                  </motion.span>
                )}
                {wrong && (
                  <motion.span
                    key="x"
                    className="text-red-500"
                    initial={{ scale: 0, opacity: 0, x: -8 }}
                    animate={{ scale: 1, opacity: 1, x: 0 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    <XIcon />
                  </motion.span>
                )}
              </AnimatePresence>

              <span className="flex-1 text-center leading-snug">
                {answer.text || 'Opção'}
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {isCorrect === true && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: [0.5, 1.12, 0.96, 1.04, 1], y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, scale: { type: 'spring', stiffness: 420, damping: 18 } }}
            className="relative overflow-hidden bg-green-50 border-2 border-green-400 rounded-2xl px-6 py-4 text-center shadow-lg"
          >
            <motion.div
              className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
              initial={{ x: '-120%' }}
              animate={{ x: '220%' }}
              transition={{ delay: 0.3, duration: 0.55, ease: 'easeInOut' }}
            />
            <p className="text-xs text-green-600 font-semibold uppercase tracking-widest mb-1">Resposta certa!</p>
            <p className="text-lg font-extrabold text-green-700">Você acertou! 🎯</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
