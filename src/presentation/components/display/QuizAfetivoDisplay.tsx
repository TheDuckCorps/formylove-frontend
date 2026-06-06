import { useEffect, useRef, useState } from 'react'
import { RewardReveal } from './RewardReveal'

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

export function QuizAfetivoDisplay({ question, answers, onComplete, previewMode = false }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const completedRef = useRef(false)

  useEffect(() => {
    if (isCorrect === true && !completedRef.current) {
      completedRef.current = true
      onComplete?.()
    }
    if (isCorrect === false) {
      const t = setTimeout(() => {
        setSelectedId(null)
        setIsCorrect(null)
      }, 900)
      return () => clearTimeout(t)
    }
    return
  }, [isCorrect, onComplete])

  function handleSelect(answer: Answer) {
    if (isCorrect === true) return
    setSelectedId(answer.id)
    setIsCorrect(answer.isCorrect)
  }

  return (
    <div className="space-y-4">
      <RewardReveal active={isCorrect === true} message="Resposta certa!" previewMode={previewMode} />

      <p className="text-lg font-semibold text-gray-800 text-center">
        {question || 'Pergunta não definida'}
      </p>

      <div className="grid grid-cols-2 gap-3">
        {answers.map((answer) => {
          const selected = selectedId === answer.id
          return (
            <button
              key={answer.id}
              type="button"
              disabled={isCorrect === true}
              onClick={() => handleSelect(answer)}
              className={[
                'text-sm px-3 py-4 rounded-xl border text-center transition font-medium',
                selected
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-700 animate-bounce'
                    : 'border-red-500 bg-red-50 text-red-700 animate-bounce'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand',
                isCorrect === true && 'opacity-60 cursor-not-allowed',
              ].join(' ')}
            >
              {answer.text || 'Opção'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
