type StopFn = () => void

function getAudioContext(): AudioContext | null {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    return new Ctx()
  } catch {
    return null
  }
}

/**
 * Schedules ratchet-click ticks that decelerate over `durationMs`,
 * matching the wheel's cubic-bezier ease-out curve.
 * Returns a stop/cleanup function.
 */
export function startWheelSpin(durationMs: number, segments: number): StopFn {
  const ctx = getAudioContext()
  if (!ctx) return () => {}

  const now = ctx.currentTime
  const durationS = durationMs / 1000

  // Ticks spaced uniformly in angle-space. Timing follows ease-out cubic
  // so clicks are dense at start (fast spin) and sparse at end (slowing down).
  const ticksPerRev = Math.min(Math.max(segments, 4), 12)
  const totalTicks = Math.round(5.5 * ticksPerRev)

  for (let i = 0; i < totalTicks; i++) {
    // t_i = duration * (1 - cbrt(1 - i/N))  → ease-out cubic inverse
    const t = durationS * (1 - Math.cbrt(1 - i / totalTicks))

    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    filter.type = 'bandpass'
    filter.frequency.value = 700 + Math.random() * 800
    filter.Q.value = 7

    osc.type = 'square'
    osc.frequency.value = 180 + Math.random() * 120

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    // Volume fades as wheel slows
    const vol = 0.13 * Math.max(0.25, 1 - t / durationS)
    gain.gain.setValueAtTime(0.001, now + t)
    gain.gain.linearRampToValueAtTime(vol, now + t + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.055)

    osc.start(now + t)
    osc.stop(now + t + 0.06)
  }

  return () => { try { ctx.close() } catch { /* noop */ } }
}

/**
 * Plays an ascending major-chord arpeggio + noise pop on win.
 */
export function playWinSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return

  const now = ctx.currentTime

  // Ascending arpeggio — C5, E5, G5, C6
  const notes = [523.25, 659.25, 783.99, 1046.5]
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.value = freq

    const t = now + i * 0.1
    gain.gain.setValueAtTime(0.001, t)
    gain.gain.linearRampToValueAtTime(0.22, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42)

    osc.start(t)
    osc.stop(t + 0.45)
  })

  // Short noise pop (confetti "bang" feel)
  const sr = ctx.sampleRate
  const bufLen = Math.floor(sr * 0.12)
  const buf = ctx.createBuffer(1, bufLen, sr)
  const data = buf.getChannelData(0)
  for (let i = 0; i < bufLen; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 2.5)
  }

  const noise = ctx.createBufferSource()
  const noiseFilter = ctx.createBiquadFilter()
  const noiseGain = ctx.createGain()

  noise.buffer = buf
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = 3200
  noiseFilter.Q.value = 0.7
  noiseGain.gain.value = 0.4

  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(ctx.destination)
  noise.start(now)

  setTimeout(() => { try { ctx.close() } catch { /* noop */ } }, 2500)
}
