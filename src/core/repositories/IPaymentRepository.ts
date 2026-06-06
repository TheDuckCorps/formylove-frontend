export namespace IPaymentRepository {
  export interface CreateInput {
    siteId: string
    qrCodeDetailed: boolean
    customerEmail?: string
    customerName?: string
  }
  export interface CreateOutput {
    qrCode: string
    qrCodeImage?: string
    amount: number
    expiresIn: number
  }
  export interface GetStatusOutput {
    paid: boolean
    paymentStatus: 'CREATED' | 'AWAITING_PAYMENT' | 'PAID' | 'ERROR' | 'REFUNDED'
    siteStatus: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
    slug: string
  }
}

export interface IPaymentRepository {
  create(input: IPaymentRepository.CreateInput): Promise<IPaymentRepository.CreateOutput>
  getStatus(siteId: string): Promise<IPaymentRepository.GetStatusOutput>
}
