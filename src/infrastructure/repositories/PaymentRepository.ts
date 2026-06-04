import { httpClient } from '../api/httpClient'
import type { IPaymentRepository } from '@/core/repositories/IPaymentRepository'

export class PaymentRepository implements IPaymentRepository {
  async create(
    input: IPaymentRepository.CreateInput,
  ): Promise<IPaymentRepository.CreateOutput> {
    const { data } = await httpClient.post<IPaymentRepository.CreateOutput>(
      '/api/v1/payments/create',
      input,
    )
    return data
  }
}
