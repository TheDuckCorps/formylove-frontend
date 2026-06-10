async function sha256(value: string): Promise<string> {
  const encoded = new TextEncoder().encode(value.trim().toLowerCase())
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function generateEventId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export async function ttqIdentify(email: string): Promise<void> {
  if (!window.ttq) return
  const hashedEmail = await sha256(email)
  window.ttq.identify({ email: hashedEmail })
}

export interface TtqContent {
  content_id: string
  content_type: 'product'
  content_name: string
  price?: number
}

export interface TtqEventParams {
  contents: TtqContent[]
  value: number
  currency: 'BRL'
}

export function ttqTrack(
  event: string,
  params: TtqEventParams,
  eventId?: string,
): void {
  if (!window.ttq) return
  window.ttq.track(event, params, { event_id: eventId ?? generateEventId() })
}
