import type { TextareaHTMLAttributes } from 'react'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  charCount?: number
  maxChars?: number
}

export function Textarea({ label, error, charCount, maxChars, className = '', ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`input-base resize-none ${error ? 'border-red-400' : ''} ${className}`}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {error && <span className="text-xs text-red-500">{error}</span>}
        {maxChars !== undefined && (
          <span className="text-xs text-gray-400 ml-auto">
            {charCount ?? 0}/{maxChars}
          </span>
        )}
      </div>
    </div>
  )
}
