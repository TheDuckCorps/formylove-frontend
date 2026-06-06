import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'outline' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

const variantClasses = {
  brand: 'bg-brand-gradient text-white shadow-[0_2px_14px_rgba(198,42,135,0.30)] hover:opacity-90 hover:shadow-[0_4px_24px_rgba(198,42,135,0.50)] transition-shadow',
  outline: 'border border-brand text-brand hover:bg-brand-50 bg-white',
  ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  text: 'text-brand hover:underline bg-transparent p-0',
}

const sizeClasses = {
  sm: 'px-4 py-1.5 text-xs rounded-xl',
  md: 'px-6 py-2.5 text-sm rounded-xl',
  lg: 'px-8 py-3 text-base rounded-xl',
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
