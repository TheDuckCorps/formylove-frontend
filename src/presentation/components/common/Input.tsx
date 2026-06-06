import { useId } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  charCount?: number
  maxChars?: number
}

export function Input({
  label,
  error,
  hint,
  charCount,
  maxChars,
  className = '',
  id: idProp,
  ...props
}: InputProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          [error ? errorId : null, hint && !error ? hintId : null].filter(Boolean).join(' ') ||
          undefined
        }
        className={`input-base ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {(error || hint) && (
          <span
            id={error ? errorId : hintId}
            role={error ? 'alert' : undefined}
            className={`text-xs flex items-center gap-1 ${error ? 'text-red-500' : 'text-gray-400'}`}
          >
            {error ? (
              <>
                <span aria-hidden>💡</span>
                {error}
              </>
            ) : (
              hint
            )}
          </span>
        )}
        {maxChars !== undefined && (
          <span className="text-xs text-gray-400 ml-auto">
            {charCount ?? 0}/{maxChars}
          </span>
        )}
      </div>
    </div>
  )
}
