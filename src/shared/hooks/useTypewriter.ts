import { useEffect, useState } from 'react'

interface Options {
  /** Typing speed in ms per character */
  speed?: number
  /** Pause after finishing before optional loop */
  pauseAfter?: number
  /** If true, deletes and retypes (multi-phrase mode) */
  loop?: boolean
}

export function useTypewriter(text: string, options: Options = {}) {
  const { speed = 45, pauseAfter = 0, loop = false } = options
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing')

  useEffect(() => {
    if (!text) {
      setDisplayed('')
      return
    }

    if (!loop) {
      if (displayed.length < text.length) {
        const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed)
        return () => clearTimeout(t)
      }
      return
    }

    if (phase === 'typing') {
      if (displayed.length < text.length) {
        const t = setTimeout(() => setDisplayed(text.slice(0, displayed.length + 1)), speed)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('waiting'), pauseAfter || 1800)
      return () => clearTimeout(t)
    }

    if (phase === 'waiting') {
      const t = setTimeout(() => setPhase('deleting'), 400)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), Math.max(25, speed - 15))
        return () => clearTimeout(t)
      }
      setPhase('typing')
    }
  }, [displayed, phase, text, speed, pauseAfter, loop])

  useEffect(() => {
    setDisplayed('')
    setPhase('typing')
  }, [text])

  return displayed
}

export function useTypewriterPhrases(phrases: string[]) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'deleting'>('typing')

  useEffect(() => {
    const current = phrases[phraseIndex] ?? ''

    if (phase === 'typing') {
      if (displayed.length < current.length) {
        const t = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 80)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => setPhase('waiting'), 1800)
      return () => clearTimeout(t)
    }

    if (phase === 'waiting') {
      const t = setTimeout(() => setPhase('deleting'), 400)
      return () => clearTimeout(t)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 45)
        return () => clearTimeout(t)
      }
      setPhraseIndex((i) => (i + 1) % phrases.length)
      setPhase('typing')
    }
  }, [displayed, phase, phraseIndex, phrases])

  return displayed
}
