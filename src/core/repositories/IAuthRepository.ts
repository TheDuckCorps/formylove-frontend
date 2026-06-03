export namespace IAuthRepository {
  export interface SendOTPInput { email: string }
  export interface VerifyOTPInput { email: string; code: string }
  export interface VerifyOTPOutput { token: string; expiresAt: string }
  export interface ConfirmEmailInput { token: string }
}

export interface IAuthRepository {
  sendOTP(input: IAuthRepository.SendOTPInput): Promise<void>
  verifyOTP(input: IAuthRepository.VerifyOTPInput): Promise<IAuthRepository.VerifyOTPOutput>
  confirmEmail(input: IAuthRepository.ConfirmEmailInput): Promise<{ email: string }>
}
