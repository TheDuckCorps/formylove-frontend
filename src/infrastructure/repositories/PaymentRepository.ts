import { httpClient } from '../api/httpClient'
import type { IPaymentRepository } from '@/core/repositories/IPaymentRepository'
import type { Payment } from '@/core/entities/Payment'

export class PaymentRepository implements IPaymentRepository {
  async create(input: IPaymentRepository.CreateInput): Promise<Payment> {
    const { data } = await httpClient.post<Payment>('/api/v1/payments', input)
    return data
  }

  async getById(id: string): Promise<Payment> {
    const { data } = await httpClient.get<Payment>(`/api/v1/payments/${id}`)
    return data
  }

  async validateCoupon(
    input: IPaymentRepository.ValidateCouponInput,
  ): Promise<IPaymentRepository.ValidateCouponOutput> {
    const { data } = await httpClient.post<IPaymentRepository.ValidateCouponOutput>(
      '/api/v1/coupons/validate',
      input,
    )
    return data
  }
}
