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
  }
}

export interface IPaymentRepository {
  create(input: IPaymentRepository.CreateInput): Promise<IPaymentRepository.CreateOutput>
}
