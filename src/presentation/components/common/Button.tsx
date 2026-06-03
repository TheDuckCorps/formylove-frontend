import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'outline' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

const variantClasses = {
  brand: 'bg-brand-gradient text-white hover:opacity-90',
  outline: 'border border-brand text-brand hover:bg-brand-50 bg-white',
  ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  text: 'text-brand hover:underline bg-transparent p-0',
}

const sizeClasses = {
  sm: 'px-4 py-1.5 text-xs rounded-full',
  md: 'px-6 py-2.5 text-sm rounded-full',
  lg: 'px-8 py-3 text-base rounded-full',
}

export function Button({
  variant = 'brand',
  size = 'md',
  children,
  fullWidth,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer select-none',
        variantClasses[variant],
        variant !== 'text' ? sizeClasses[size] : '',
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
