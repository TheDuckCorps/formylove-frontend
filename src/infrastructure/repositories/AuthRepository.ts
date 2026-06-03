import { httpClient } from '../api/httpClient'
import type { IAuthRepository } from '@/core/repositories/IAuthRepository'

export class AuthRepository implements IAuthRepository {
  async sendOTP({ email }: IAuthRepository.SendOTPInput): Promise<void> {
    await httpClient.post('/api/v1/auth/otp/send', { email })
  }

  async verifyOTP(
    input: IAuthRepository.VerifyOTPInput,
  ): Promise<IAuthRepository.VerifyOTPOutput> {
    const { data } = await httpClient.post<IAuthRepository.VerifyOTPOutput>(
      '/api/v1/auth/otp/verify',
      input,
    )
    sessionStorage.setItem('hl_token', data.token)
    return data
  }

  async confirmEmail(
    input: IAuthRepository.ConfirmEmailInput,
  ): Promise<{ email: string }> {
    const { data } = await httpClient.get<{ email: string }>(
      `/api/v1/auth/confirm-email?token=${input.token}`,
    )
    return data
  }
}
