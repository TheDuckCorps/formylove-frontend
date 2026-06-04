import { useEffect, useState } from 'react'

interface Answer {
  id: string
  text: string
  isCorrect: boolean
}

interface Props {
  question: string
  answers: Answer[]
  onComplete?: () => void
}

export function QuizAfetivoDisplay({ question, answers, onComplete }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (isCorrect === true) {
      const t = setTimeout(() => onComplete?.(), 1200)
      return () => clearTimeout(t)
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
    setSelectedId(answer.id)
    setIsCorrect(answer.isCorrect)
  }

  return (
    <div className="space-y-4">
      <p className="text-base font-semibold text-gray-800 text-center">
        {question || 'Pergunta não definida'}
      </p>

      <div className="grid grid-cols-2 gap-2">
        {answers.map((answer) => {
          const selected = selectedId === answer.id
          return (
            <button
              key={answer.id}
              type="button"
              onClick={() => handleSelect(answer)}
              className={[
                'text-sm px-3 py-3 rounded-lg border text-center transition',
                selected
                  ? isCorrect
                    ? 'border-green-500 bg-green-50 text-green-700 animate-bounce'
                    : 'border-red-500 bg-red-50 text-red-700 animate-bounce'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-brand',
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
