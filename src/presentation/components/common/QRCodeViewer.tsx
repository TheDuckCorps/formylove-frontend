import { QRCodeSVG } from 'qrcode.react'

const TEMPLATE_CONFIG: Record<string, { style: string; emoji?: string }> = {
  'template-1': { style: 'bg-white border border-gray-200' },
  'template-2': { style: 'bg-[url("/templates/t2.png")] bg-cover', emoji: '🌸' },
  'template-3': { style: 'bg-gray-50 border border-gray-200' },
  'template-4': { style: 'bg-pink-100', emoji: '💗' },
  'template-5': { style: 'bg-sky-100', emoji: '☁️' },
  'template-6': { style: 'bg-green-50', emoji: '🌼' },
  'template-7': { style: 'bg-rose-50', emoji: '🌹' },
  'template-8': { style: 'bg-violet-100', emoji: '💜' },
  'template-9': { style: 'bg-purple-200', emoji: '🔮' },
}

interface Props {
  slug: string
  qrTemplate?: string
}

export function QRCodeViewer({ slug, qrTemplate }: Props) {
  const siteUrl = `${window.location.origin}/site/${slug}`
  const tpl = TEMPLATE_CONFIG[qrTemplate ?? 'template-1'] ?? TEMPLATE_CONFIG['template-1']

  return (
    <div className={`relative flex flex-col items-center justify-center rounded-2xl p-8 overflow-hidden ${tpl.style}`}>
      {tpl.emoji && (
        <div className="absolute inset-0 flex flex-wrap gap-3 p-3 opacity-20 pointer-events-none select-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <span key={i} className="text-3xl">{tpl.emoji}</span>
          ))}
        </div>
      )}

      <div className="relative bg-white rounded-xl p-4 shadow-md">
        <QRCodeSVG value={siteUrl} size={180} />
      </div>

      <p className="relative mt-4 text-xs text-gray-500 font-mono text-center break-all max-w-[220px]">
        {siteUrl}
      </p>
    </div>
  )
}
