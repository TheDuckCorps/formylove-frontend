import { Button } from '../common/Button'
import { useTypewriter } from '@/shared/hooks/useTypewriter'

interface Props {
  phrase: string
  onContinue?: () => void
}

export function ToqueContinuarDisplay({ phrase, onContinue }: Props) {
  const text = phrase || 'Toque para continuar'
  const displayed = useTypewriter(text, { speed: 40 })

  return (
    <div className="flex flex-col items-center gap-6 text-center py-8">
      <p className="text-lg font-medium text-gray-800 min-h-[2rem] max-w-sm">
        {displayed}
        {displayed.length < text.length && (
          <span className="animate-blink text-brand" aria-hidden>
            |
          </span>
        )}
      </p>

      <Button onClick={onContinue} disabled={!onContinue}>
        Próxima página →
      </Button>
    </div>
  )
}
