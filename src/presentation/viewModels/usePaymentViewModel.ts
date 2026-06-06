import { useState, useEffect, useRef, useCallback } from 'react'
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository'
import { getFriendlyMessage } from '@/shared/errors/getFriendlyMessage'

interface UsePaymentViewModelInput {
  initialQrCode: string
  initialQrCodeImage?: string
  siteId: string
  email?: string
  qrCodeDetailed?: boolean
  expiresIn: number
}

export function usePaymentViewModel({
  initialQrCode,
  initialQrCodeImage,
  siteId,
  email,
  qrCodeDetailed = false,
  expiresIn,
}: UsePaymentViewModelInput) {
  const [qrCode, setQrCode] = useState(initialQrCode)
  const [qrCodeImage, setQrCodeImage] = useState(initialQrCodeImage)
  const [secondsLeft, setSecondsLeft] = useState(expiresIn)
  const [isExpired, setIsExpired] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCountdown = useCallback((seconds: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setSecondsLeft(seconds)
    setIsExpired(false)

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          setIsExpired(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  useEffect(() => {
    startCountdown(expiresIn)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [expiresIn, startCountdown])

  async function refreshQrCode() {
    setIsRefreshing(true)
    setError(null)
    try {
      const repo = new PaymentRepository()
      const result = await repo.create({
        siteId,
        qrCodeDetailed,
        customerEmail: email,
      })
      setQrCode(result.qrCode)
      setQrCodeImage(result.qrCodeImage)
      startCountdown(result.expiresIn)
    } catch (err) {
      setError(getFriendlyMessage(err, 'Não foi possível gerar um novo QR Code.'))
    } finally {
      setIsRefreshing(false)
    }
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  const isWarning = secondsLeft <= 30 && !isExpired

  return {
    qrCode,
    qrCodeImage,
    secondsLeft,
    isExpired,
    isRefreshing,
    isWarning,
    formattedTime,
    error,
    refreshQrCode,
  }
}
