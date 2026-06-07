function ctx(): AudioContext | null {
  try {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    return new C()
  } catch { return null }
}

function autoClose(c: AudioContext, ms = 1000) {
  setTimeout(() => { try { c.close() } catch { /* noop */ } }, ms)
}

// ─── Love Meter ────────────────────────────────────────────────────────────

/** Short bass thump on each love-meter tap. */
export function playHeartClick() {
  const c = ctx(); if (!c) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain); gain.connect(c.destination)
  osc.type = 'sine'
  osc.frequency.setValueAtTime(140, now)
  osc.frequency.exponentialRampToValueAtTime(55, now + 0.07)
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.linearRampToValueAtTime(0.45, now + 0.006)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
  osc.start(now); osc.stop(now + 0.11)
  autoClose(c, 400)
}

/**
 * Rising chime on milestones.
 * level 1 = 25%, 2 = 50%, 3 = 75%
 */
export function playMilestone(level: 1 | 2 | 3) {
  const c = ctx(); if (!c) return
  const now = c.currentTime
  const freqs = [
    [523.25],
    [523.25, 783.99],
    [523.25, 783.99, 1046.5],
  ][level - 1]

  freqs.forEach((freq, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain); gain.connect(c.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    const t = now + i * 0.12
    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.18, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28)
    osc.start(t); osc.stop(t + 0.3)
  })
  autoClose(c, 1200)
}

// ─── Scratch Card ──────────────────────────────────────────────────────────

let scratchCtx: AudioContext | null = null
let scratchGain: GainNode | null = null

/** Call once on mount; returns a cleanup fn. */
export function initScratchSound(): () => void {
  try {
    const C = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    scratchCtx = new C()
    const c = scratchCtx

    const sr = c.sampleRate
    const bufLen = sr * 2
    const buf = c.createBuffer(1, bufLen, sr)
    const data = buf.getChannelData(0)
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1

    const src = c.createBufferSource()
    src.buffer = buf; src.loop = true

    const filter = c.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2200
    filter.Q.value = 1.2

    scratchGain = c.createGain()
    scratchGain.gain.value = 0

    src.connect(filter); filter.connect(scratchGain); scratchGain.connect(c.destination)
    src.start()
  } catch { /* noop */ }

  return () => {
    try { scratchCtx?.close() } catch { /* noop */ }
    scratchCtx = null; scratchGain = null
  }
}

/** Toggle scratch noise on/off. */
export function setScratchActive(active: boolean) {
  if (!scratchCtx || !scratchGain) return
  const now = scratchCtx.currentTime
  scratchGain.gain.setTargetAtTime(active ? 0.13 : 0, now, 0.012)
}

// ─── Quiz ──────────────────────────────────────────────────────────────────

/** Short ascending chime for correct answer. */
export function playCorrectAnswer() {
  const c = ctx(); if (!c) return
  const now = c.currentTime
  const notes = [659.25, 880]
  notes.forEach((freq, i) => {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain); gain.connect(c.destination)
    osc.type = 'sine'; osc.frequency.value = freq
    const t = now + i * 0.1
    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.22, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.32)
    osc.start(t); osc.stop(t + 0.35)
  })
  autoClose(c, 800)
}

/** Low descending buzz for wrong answer. */
export function playWrongAnswer() {
  const c = ctx(); if (!c) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain); gain.connect(c.destination)
  osc.type = 'sawtooth'
  osc.frequency.setValueAtTime(240, now)
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.22)
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.linearRampToValueAtTime(0.18, now + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24)
  osc.start(now); osc.stop(now + 0.25)
  autoClose(c, 500)
}

// ─── Palavra Secreta ───────────────────────────────────────────────────────

/** Subtle mechanical click on any key press. */
export function playKeyPress() {
  const c = ctx(); if (!c) return
  const now = c.currentTime
  const sr = c.sampleRate
  const bufLen = Math.floor(sr * 0.02)
  const buf = c.createBuffer(1, bufLen, sr)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 3)
  const src = c.createBufferSource()
  const filter = c.createBiquadFilter()
  const gain = c.createGain()
  src.buffer = buf
  filter.type = 'highpass'; filter.frequency.value = 3500
  gain.gain.value = 0.2
  src.connect(filter); filter.connect(gain); gain.connect(c.destination)
  src.start(now)
  autoClose(c, 300)
}

/** Soft ding when a correct letter is found. */
export function playLetterFound() {
  const c = ctx(); if (!c) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain); gain.connect(c.destination)
  osc.type = 'sine'; osc.frequency.value = 880
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.linearRampToValueAtTime(0.2, now + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
  osc.start(now); osc.stop(now + 0.26)
  autoClose(c, 500)
}

/** Short buzz when a wrong letter is guessed. */
export function playLetterWrong() {
  const c = ctx(); if (!c) return
  const now = c.currentTime
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.connect(gain); gain.connect(c.destination)
  osc.type = 'square'; osc.frequency.value = 180
  gain.gain.setValueAtTime(0.001, now)
  gain.gain.linearRampToValueAtTime(0.12, now + 0.008)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)
  osc.start(now); osc.stop(now + 0.19)
  autoClose(c, 400)
}
