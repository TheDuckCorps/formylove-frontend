declare function gtag(...args: unknown[]): void

export function trackGoogleAdsPurchase(params: {
  transactionId: string
  value: number
  currency?: string
}) {
  if (typeof gtag === 'undefined') return
  gtag('event', 'conversion', {
    send_to: 'AW-18229156221/2fEPCKGburwcEP2yq_RD',
    value: params.value,
    currency: params.currency ?? 'BRL',
    transaction_id: params.transactionId,
  })
}
