import { useState, useEffect, useRef, useCallback } from 'react'
import { PaymentRepository } from '@/infrastructure/repositories/PaymentRepository'

const POLLING_INTERVAL_MS = 5000

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
  const [isPaid, setIsPaid] = useState(false)
  const [siteSlug, setSiteSlug] = useState<string | null>(null)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [checkMessage, setCheckMessage] = useState<string | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPaidRef = useRef(false)

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

  const fetchPaymentStatus = useCallback(async (): Promise<boolean> => {
    if (!siteId || isPaidRef.current) return isPaidRef.current
    try {
      const repo = new PaymentRepository()
      const status = await repo.getStatus(siteId)
      if (status.paid) {
        isPaidRef.current = true
        setSiteSlug(status.slug)
        setIsPaid(true)
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (pollingRef.current) clearInterval(pollingRef.current)
        return true
      }
    } catch {
      // silent — polling will retry
    }
    return false
  }, [siteId])

  // Poll payment status in background while waiting
  useEffect(() => {
    if (!siteId) return
    pollingRef.current = setInterval(fetchPaymentStatus, POLLING_INTERVAL_MS)
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current)
    }
  }, [siteId, fetchPaymentStatus])

  // Manual check triggered by the "Já paguei" button
  async function checkPaymentNow() {
    setIsCheckingPayment(true)
    setCheckMessage(null)
    try {
      const paid = await fetchPaymentStatus()
      if (!paid) {
        setCheckMessage(
          'Ainda não identificamos seu pagamento. Pode levar alguns instantes — vamos avisar assim que for confirmado.',
        )
      }
    } finally {
      setIsCheckingPayment(false)
    }
  }

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
      setError(err instanceof Error ? err.message : 'Erro ao gerar novo QR Code')
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
    isPaid,
    siteSlug,
    isCheckingPayment,
    checkMessage,
    checkPaymentNow,
  }
}
