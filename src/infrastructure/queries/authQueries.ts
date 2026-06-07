import { useMutation } from '@tanstack/react-query'
import { AuthRepository } from '../repositories/AuthRepository'
import type { IAuthRepository } from '@/core/repositories/IAuthRepository'

const repo = new AuthRepository()

export function useSendOTP() {
  return useMutation({
    mutationFn: (input: IAuthRepository.SendOTPInput) => repo.sendOTP(input),
  })
}

export function useVerifyOTP() {
  return useMutation({
    mutationFn: (input: IAuthRepository.VerifyOTPInput) => repo.verifyOTP(input),
  })
}
