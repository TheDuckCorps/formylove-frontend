interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
}

const sizes = { sm: 'h-6', md: 'h-8', lg: 'h-12' }

export function Logo({ size = 'md' }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      {/* Double-heart SVG matching the prototype */}
      <svg
        viewBox="0 0 36 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={sizes[size]}
        style={{ aspectRatio: '36/32' }}
      >
        {/* Back heart */}
        <path
          d="M22 27C22 27 10 19.5 10 11.5C10 8.42 12.42 6 15.5 6C17.5 6 19.24 7.04 20.24 8.6C20.7 9.32 21.32 9.32 21.76 8.6C22.76 7.04 24.5 6 26.5 6C29.58 6 32 8.42 32 11.5C32 19.5 22 27 22 27Z"
          stroke="#C62A87"
          strokeWidth="1.6"
          fill="none"
        />
        {/* Front heart */}
        <path
          d="M14 24C14 24 4 17.5 4 10.5C4 7.97 6.01 6 8.5 6C10.1 6 11.5 6.84 12.2 8.1C12.6 8.82 13.4 8.82 13.8 8.1C14.5 6.84 15.9 6 17.5 6C19.99 6 22 7.97 22 10.5C22 17.5 14 24 14 24Z"
          fill="#C62A87"
          opacity="0.85"
        />
      </svg>

      <span className="font-bold text-gray-800 tracking-tight" style={{ fontSize: size === 'sm' ? 14 : size === 'lg' ? 22 : 17 }}>
        Heart Link
      </span>
    </div>
  )
}
