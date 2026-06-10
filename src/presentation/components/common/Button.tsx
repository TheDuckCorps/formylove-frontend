import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'
import { getContrastTextColor } from '@/shared/constants/colorPalette'
import { useSiteTheme } from '@/shared/context/SiteThemeContext'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'brand' | 'outline' | 'ghost' | 'text'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
}

const baseVariantClasses = {
  brand: 'hover:opacity-90 transition-shadow',
  outline: 'border bg-white hover:opacity-90 transition',
  ghost: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  text: 'hover:underline bg-transparent p-0',
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
  style,
  ...props
}: ButtonProps) {
  const theme = useSiteTheme()

  const themeStyle: CSSProperties = { ...style }

  if (variant === 'brand') {
    themeStyle.backgroundColor = theme.primary
    themeStyle.color = getContrastTextColor(theme.primary)
    themeStyle.boxShadow = theme.buttonShadow
  } else if (variant === 'outline') {
    themeStyle.borderColor = theme.primary
    themeStyle.color = theme.primary
  } else if (variant === 'text') {
    themeStyle.color = theme.primary
  }

  return (
    <button
      className={[
        'inline-flex items-center justify-center gap-2 font-semibold transition-all cursor-pointer select-none',
        baseVariantClasses[variant],
        variant !== 'text' ? sizeClasses[size] : '',
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={themeStyle}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
