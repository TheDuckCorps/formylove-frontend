interface Props {
  phrase: string
  onContinue?: () => void
}

export function ToqueContinuarDisplay({ phrase, onContinue }: Props) {
  return (
    <div className="flex flex-col items-center gap-5 text-center py-6">
      <p className="text-base font-medium text-gray-800">
        {phrase || 'Toque para continuar'}
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="btn-brand px-8 py-2 rounded-lg text-sm font-semibold"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
