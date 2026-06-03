export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'

export interface Payment {
  id: string
  siteId: string
  amount: number
  status: PaymentStatus
  pixQrCode?: string
  pixCopyPaste?: string
  couponCode?: string
  discountAmount?: number
  createdAt: string
}
