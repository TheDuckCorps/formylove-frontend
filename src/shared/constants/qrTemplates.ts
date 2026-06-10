export const QR_TEMPLATE_IDS = [
  'template-1',
  'template-2',
  'template-3',
  'template-4',
  'template-5',
  'template-6',
  'template-7',
  'template-8',
  'template-9',
] as const

export type QrTemplateId = (typeof QR_TEMPLATE_IDS)[number]

export const QR_TEMPLATE_IMAGE: Record<QrTemplateId, string> = {
  'template-1': '/qr-codes/template-1.png',
  'template-2': '/qr-codes/template-2.png',
  'template-3': '/qr-codes/template-3.png',
  'template-4': '/qr-codes/template-4.png',
  'template-5': '/qr-codes/template-5.png',
  'template-6': '/qr-codes/template-6.png',
  'template-7': '/qr-codes/template-7.png',
  'template-8': '/qr-codes/template-8.png',
  'template-9': '/qr-codes/template-9.png',
}

export const QR_TEMPLATE_OPTIONS: { id: QrTemplateId; label: string }[] = [
  { id: 'template-1', label: 'Fundo branco' },
  { id: 'template-2', label: 'Flores coloridas' },
  { id: 'template-3', label: 'Fundo claro' },
  { id: 'template-4', label: 'Corações rosa' },
  { id: 'template-5', label: 'Nuvens' },
  { id: 'template-6', label: 'Flores silvestres' },
  { id: 'template-7', label: 'Rosa claro' },
  { id: 'template-8', label: 'Lilás' },
  { id: 'template-9', label: 'Roxo' },
]

export function getQrTemplateImagePath(id: string): string {
  if (id in QR_TEMPLATE_IMAGE) {
    return QR_TEMPLATE_IMAGE[id as QrTemplateId]
  }
  return QR_TEMPLATE_IMAGE['template-1']
}

export function isQrTemplateId(id: string): id is QrTemplateId {
  return QR_TEMPLATE_IDS.includes(id as QrTemplateId)
}
