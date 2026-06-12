import { nanoid } from '@/shared/utils/nanoid'
import type { QuizAfetivoData, QuizAfetivoAnswer } from '@/core/entities/Page'
import { Input } from '../common/Input'
import { FieldError } from '../common/FieldError'

const MAX_ANSWERS = 4
const MIN_ANSWERS = 2

interface Props {
  data: QuizAfetivoData
  onChange: (data: Partial<QuizAfetivoData>) => void
  fieldErrors?: Record<string, string>
}

export function QuizAfetivoPage({ data, onChange, fieldErrors = {} }: Props) {
  function updateAnswer(id: string, patch: Partial<QuizAfetivoAnswer>) {
    onChange({
      answers: data.answers.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    })
  }

  function setCorrect(id: string) {
    onChange({
      answers: data.answers.map((a) => ({ ...a, isCorrect: a.id === id })),
    })
  }

  function addAnswer() {
    if (data.answers.length >= MAX_ANSWERS) return
    onChange({ answers: [...data.answers, { id: nanoid(), text: '', isCorrect: false }] })
  }

  function removeAnswer(id: string) {
    if (data.answers.length <= MIN_ANSWERS) return
    onChange({ answers: data.answers.filter((a) => a.id !== id) })
  }

  return (
    <div className="flex flex-col gap-5">
      <Input
        label="Digite a pergunta principal do quiz"
        placeholder="Ex: Quando eu nasci?"
        value={data.question}
        error={fieldErrors.question}
        onChange={(e) => onChange({ question: e.target.value })}
      />

      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Escolha a opção correta</p>
        <div className="flex flex-col gap-2">
          {data.answers.map((answer, index) => (
            <div key={answer.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCorrect(answer.id)}
                aria-label={`Marcar opção ${index + 1} como correta`}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                  answer.isCorrect
                    ? 'border-brand bg-brand'
                    : 'border-gray-300'
                }`}
              >
                {answer.isCorrect && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </button>

              <input
                className={[
                  'input-base flex-1 text-sm py-2',
                  fieldErrors[`answers.${index}.text`] || fieldErrors.answers ? 'border-red-400' : '',
                ].join(' ')}
                placeholder={`RESPOSTA ${index + 1}`}
                value={answer.text}
                onChange={(e) => updateAnswer(answer.id, { text: e.target.value })}
              />

              <button
                type="button"
                onClick={() => removeAnswer(answer.id)}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 hover:border-red-400 hover:text-red-400 flex-shrink-0 transition"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
        <FieldError message={fieldErrors.answers} />

        {data.answers.length < MAX_ANSWERS && (
          <button
            type="button"
            onClick={addAnswer}
            className="mt-3 w-8 h-8 rounded-full bg-brand-gradient text-white flex items-center justify-center hover:opacity-90 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
