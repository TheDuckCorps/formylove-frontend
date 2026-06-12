import { motion } from 'framer-motion'
import type { PageType } from '@/core/entities/Page'

type PreviewVariant = 'card' | 'stepper'

function BaseFrame({ children, variant }: { children: React.ReactNode; variant: PreviewVariant }) {
  return (
    <div
      className={[
        'relative w-full h-full overflow-hidden',
        variant === 'stepper'
          ? 'rounded-md bg-transparent'
          : 'rounded-xl border border-pink-100 bg-gradient-to-br from-white to-pink-50',
      ].join(' ')}
    >
      {children}
    </div>
  )
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M3 21l3.75-1 11-11-2.75-2.75-11 11L3 21z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
      <path d="M14.5 6.5l2.75 2.75 1.5-1.5a1.06 1.06 0 0 0 0-1.5l-1.25-1.25a1.06 1.06 0 0 0-1.5 0l-1.5 1.5z" fill="#fde68a" stroke="#d97706" strokeWidth="0.6" />
      <path d="M3 21l1.5-3.75" stroke="#92400e" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 17.25L3 21" fill="#fca5a5" />
      <circle cx="4.2" cy="19.8" r="1.1" fill="#fecaca" />
    </svg>
  )
}

function DesenhoLivrePreview({ variant }: { variant: PreviewVariant }) {
  const pencilSize = variant === 'stepper' ? 'w-5 h-5' : 'w-7 h-7'

  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          className="origin-center drop-shadow-sm"
          animate={{
            x: [0, 4, -3, 2, 0],
            y: [0, -3, 2, -1, 0],
            rotate: [-42, -50, -36, -44, -42],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PencilIcon className={pencilSize} />
        </motion.div>
      </div>
    </BaseFrame>
  )
}

function MedidorAmorPreview({ variant }: { variant: PreviewVariant }) {
  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          className={variant === 'stepper' ? 'text-xl' : 'text-4xl'}
          animate={{ scale: [1, 1.16, 1], opacity: [0.92, 1, 0.92] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ❤️
        </motion.div>
      </div>
    </BaseFrame>
  )
}

function ToqueContinuarPreview({ variant }: { variant: PreviewVariant }) {
  if (variant === 'stepper') {
    return (
      <BaseFrame variant={variant}>
        <div className="absolute inset-0 grid place-items-center">
          <motion.div
            className="w-5 h-5 rounded-full bg-pink-500 text-white grid place-items-center text-[10px] font-bold"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
          >
            →
          </motion.div>
        </div>
        <motion.div
          className="absolute left-1/2 top-1/2 w-6 h-6 rounded-full border border-pink-300"
          initial={{ opacity: 0.6, scale: 0.7 }}
          animate={{ opacity: [0.6, 0], scale: [0.7, 1.3] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
          style={{ translateX: '-50%', translateY: '-50%' }}
        />
      </BaseFrame>
    )
  }

  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 grid place-items-center">
        <motion.button
          type="button"
          className="px-4 py-2 rounded-full bg-pink-500 text-white text-xs font-semibold shadow"
          animate={{ scale: [1, 1.05, 1], y: [0, -1, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          Continuar →
        </motion.button>
      </div>
      <motion.div
        className="absolute left-1/2 top-1/2 w-10 h-10 rounded-full border border-pink-300"
        initial={{ opacity: 0.7, scale: 0.7 }}
        animate={{ opacity: [0.7, 0], scale: [0.7, 1.3] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeOut' }}
        style={{ translateX: '-50%', translateY: '-50%' }}
      />
    </BaseFrame>
  )
}

function MusicaFundoPreview({ variant }: { variant: PreviewVariant }) {
  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 grid place-items-center">
        <motion.svg
          className={['text-pink-500', variant === 'stepper' ? 'w-5 h-5' : 'w-7 h-7'].join(' ')}
          fill="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
        </motion.svg>
      </div>
    </BaseFrame>
  )
}

function PalavraSecretaPreview({ variant }: { variant: PreviewVariant }) {
  const slotClass =
    variant === 'stepper'
      ? 'w-4 h-4 border-b-2 border-gray-400 bg-white rounded-sm flex items-center justify-center'
      : 'w-7 h-7 border-b-2 border-gray-400 bg-white rounded-sm flex items-center justify-center'

  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 grid place-items-center">
        <div className={['flex items-center', variant === 'stepper' ? 'gap-1' : 'gap-2'].join(' ')}>
          <div className={slotClass}>
            <span className={variant === 'stepper' ? 'text-[9px] font-bold text-gray-700' : 'text-xs font-bold text-gray-700'}>O</span>
          </div>
          <div className={slotClass}>
            <motion.span
              className={variant === 'stepper' ? 'text-[9px] font-bold text-pink-600' : 'text-xs font-bold text-pink-600'}
              initial={{ opacity: 0, y: -7, scale: 0.75 }}
              animate={{ opacity: [0, 1, 1, 0], y: [-7, 0, 0, -4], scale: [0.75, 1, 1, 0.86] }}
              transition={{
                duration: variant === 'stepper' ? 2.8 : 2.2,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.25, 0.65, 1],
              }}
            >
              I
            </motion.span>
          </div>
        </div>
      </div>
    </BaseFrame>
  )
}

function QuizAfetivoPreview({ variant }: { variant: PreviewVariant }) {
  if (variant === 'stepper') {
    return (
      <BaseFrame variant={variant}>
        <div className="absolute inset-0 grid place-items-center px-1">
          <motion.div
            className="w-full h-4 rounded border text-[8px] font-bold flex items-center justify-center"
            animate={{
              backgroundColor: ['#ffffff', '#dcfce7', '#ffffff'],
              borderColor: ['#d1d5db', '#22c55e', '#d1d5db'],
              color: ['#374151', '#166534', '#374151'],
            }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            OK
          </motion.div>
        </div>
      </BaseFrame>
    )
  }

  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 grid place-items-center px-4">
        <motion.div
          className="w-full max-w-[150px] text-center rounded-lg border text-[10px] font-semibold py-2"
          animate={{
            backgroundColor: ['#ffffff', '#dcfce7', '#ffffff'],
            borderColor: ['#d1d5db', '#22c55e', '#d1d5db'],
            color: ['#374151', '#166534', '#374151'],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          Opção correta
        </motion.div>
      </div>
    </BaseFrame>
  )
}

function RaspadinhaPreview({ variant }: { variant: PreviewVariant }) {
  const fingerClass = variant === 'stepper' ? 'absolute text-[12px]' : 'absolute text-lg'
  const zPath =
    variant === 'stepper'
      ? {
          left: ['18%', '78%', '18%', '78%'],
          top: ['18%', '18%', '78%', '78%'],
        }
      : {
          left: ['12%', '82%', '12%', '82%'],
          top: ['12%', '12%', '82%', '82%'],
        }

  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 bg-gradient-to-br from-pink-200 to-fuchsia-300" />
      <div className="absolute inset-0 bg-gray-300/95" />
      <motion.div
        className={[fingerClass, '-translate-x-1/2 -translate-y-1/2'].join(' ')}
        animate={zPath}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      >
        ☝️
      </motion.div>
    </BaseFrame>
  )
}

function RoletaPreview({ variant }: { variant: PreviewVariant }) {
  return (
    <BaseFrame variant={variant}>
      <div className="absolute inset-0 grid place-items-center">
        <motion.div
          className={[
            'relative rounded-full border-2 border-white shadow',
            variant === 'stepper' ? 'w-5 h-5' : 'w-16 h-16',
          ].join(' ')}
          style={{
            background:
              'conic-gradient(#ec4899 0deg 120deg, #8b5cf6 120deg 240deg, #f97316 240deg 360deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'linear' }}
        >
          {variant === 'card' && (
            <span className="absolute inset-0 grid place-items-center text-[9px] font-bold text-white">RODAR</span>
          )}
        </motion.div>
      </div>
    </BaseFrame>
  )
}

export function PageTypeAnimatedPreview({
  type,
  variant = 'card',
}: {
  type: PageType
  variant?: PreviewVariant
}) {
  switch (type) {
    case 'DESENHO_LIVRE':
      return <DesenhoLivrePreview variant={variant} />
    case 'MEDIDOR_AMOR':
      return <MedidorAmorPreview variant={variant} />
    case 'TOQUE_CONTINUAR':
      return <ToqueContinuarPreview variant={variant} />
    case 'MUSICA_FUNDO':
      return <MusicaFundoPreview variant={variant} />
    case 'PALAVRA_SECRETA':
      return <PalavraSecretaPreview variant={variant} />
    case 'QUIZ_AFETIVO':
      return <QuizAfetivoPreview variant={variant} />
    case 'RASPADINHA_SURPRESA':
      return <RaspadinhaPreview variant={variant} />
    case 'ROLETA_ESCOLHAS':
      return <RoletaPreview variant={variant} />
    case 'MENSAGEM_MULTIMIDIA':
      return (
        <BaseFrame variant={variant}>
          <div className="absolute inset-0 grid place-items-center">
            {variant === 'card' ? (
              <div className="text-[11px] text-gray-500 font-medium">Em breve</div>
            ) : (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
          </div>
        </BaseFrame>
      )
    default:
      return null
  }
}
