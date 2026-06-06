interface Props {
  id?: string
  message?: string
}

export function FieldError({ id, message }: Props) {
  if (!message) return null

  return (
    <p
      id={id}
      role="alert"
      className="flex items-center gap-1.5 text-xs text-red-500 mt-1"
    >
      <span aria-hidden className="text-sm">
        💡
      </span>
      <span>{message}</span>
    </p>
  )
}
