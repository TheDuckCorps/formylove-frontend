/// <reference types="vite/client" />

interface TiktokPixel {
  page: () => void
  track: (event: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void
  identify: (params: Record<string, unknown>) => void
  load: (pixelId: string, options?: Record<string, unknown>) => void
  holdConsent: () => void
  revokeConsent: () => void
  grantConsent: () => void
  enableCookie: () => void
  disableCookie: () => void
}

interface Window {
  ttq: TiktokPixel
}
