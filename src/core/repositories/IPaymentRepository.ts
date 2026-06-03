import type { Payment } from '../entities/Payment'

export namespace IPaymentRepository {
  export interface CreateInput {
    siteId: string
    couponCode?: string
  }
  export interface ValidateCouponInput { code: string; planType: string }
  export interface ValidateCouponOutput {
    valid: boolean
    discountType: 'PERCENTAGE' | 'FIXED'
    discountValue: number
  }
}

export interface IPaymentRepository {
  create(input: IPaymentRepository.CreateInput): Promise<Payment>
  getById(id: string): Promise<Payment>
  validateCoupon(input: IPaymentRepository.ValidateCouponInput): Promise<IPaymentRepository.ValidateCouponOutput>
}
