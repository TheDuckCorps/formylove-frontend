import { useState, useEffect, useRef, useCallback } from 'react'
import { usePaymentStatus, useCreatePayment } from '@/infrastructure/queries/paymentQueries'
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
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [checkMessage, setCheckMessage] = useState<string | null>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { data: statusData, refetch: refetchStatus } = usePaymentStatus(siteId)
  const refreshQrCodeMutation = useCreatePayment()

  const isPaid = statusData?.paid ?? false
  const siteSlug = statusData?.slug ?? null

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

  async function checkPaymentNow() {
    setIsCheckingPayment(true)
    setCheckMessage(null)
    try {
      const result = await refetchStatus()
      if (!result.data?.paid) {
        setCheckMessage(
          'Ainda não identificamos seu pagamento. Pode levar alguns instantes — vamos avisar assim que for confirmado.',
        )
      }
    } finally {
      setIsCheckingPayment(false)
    }
  }

  async function refreshQrCode() {
    const result = await refreshQrCodeMutation.mutateAsync({
      siteId,
      qrCodeDetailed,
      customerEmail: email,
    }).catch(() => null)

    if (!result) return
    setQrCode(result.qrCode)
    setQrCodeImage(result.qrCodeImage)
    startCountdown(result.expiresIn)
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
    isRefreshing: refreshQrCodeMutation.isPending,
    isWarning,
    formattedTime,
    error: refreshQrCodeMutation.isError
      ? getFriendlyMessage(refreshQrCodeMutation.error, 'Não foi possível gerar um novo QR Code.')
      : null,
    refreshQrCode,
    isPaid,
    siteSlug,
    isCheckingPayment,
    checkMessage,
    checkPaymentNow,
  }
}
