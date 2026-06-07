import { useQuery, useMutation } from '@tanstack/react-query'
import { PaymentRepository } from '../repositories/PaymentRepository'
import type { IPaymentRepository } from '@/core/repositories/IPaymentRepository'

const repo = new PaymentRepository()

export const paymentKeys = {
  status: (siteId: string) => ['payments', 'status', siteId] as const,
}

export function usePaymentStatus(siteId: string) {
  return useQuery({
    queryKey: paymentKeys.status(siteId),
    queryFn: () => repo.getStatus(siteId),
    enabled: !!siteId,
    refetchInterval: (query) => (query.state.data?.paid ? false : 5000),
    retry: false,
  })
}

export function useCreatePayment() {
  return useMutation({
    mutationFn: (input: IPaymentRepository.CreateInput) => repo.create(input),
  })
}
