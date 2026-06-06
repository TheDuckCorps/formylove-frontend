import { useId } from 'react'
import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  charCount?: number
  maxChars?: number
}

export function Textarea({
  label,
  error,
  charCount,
  maxChars,
  className = '',
  id: idProp,
  ...props
}: TextareaProps) {
  const autoId = useId()
  const id = idProp ?? autoId
  const errorId = `${id}-error`

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={`input-base resize-none ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {error && (
          <span id={errorId} role="alert" className="text-xs text-red-500 flex items-center gap-1">
            <span aria-hidden>💡</span>
            {error}
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
