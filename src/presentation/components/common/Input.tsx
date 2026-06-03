import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  charCount?: number
  maxChars?: number
}

export function Input({ label, error, hint, charCount, maxChars, className = '', ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`input-base ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : ''} ${className}`}
        {...props}
      />
      <div className="flex justify-between mt-1">
        {(error || hint) && (
          <span className={`text-xs ${error ? 'text-red-500' : 'text-gray-400'}`}>
            {error ?? hint}
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
