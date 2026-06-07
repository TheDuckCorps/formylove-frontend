import confettiLib from 'canvas-confetti'

const COLORS = ['#C62A87', '#E91E8C', '#a855f7', '#f472b6', '#fbbf24', '#34d399', '#fff']

export function fireConfettiFrom(el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  const originX = (rect.left + rect.width / 2) / window.innerWidth
  const originY = (rect.top + rect.height / 2) / window.innerHeight

  const desktop = window.innerWidth >= 1024
  const base = { origin: { x: originX, y: originY }, colors: COLORS, disableForReducedMotion: true }

  const p1 = desktop ? 140 : 80
  const p2 = desktop ? 100 : 60
  const p3 = desktop ? 70  : 40
  const sc  = desktop ? 1.4 : 1.1

  confettiLib({ ...base, particleCount: p1, spread: desktop ? 70 : 55, startVelocity: desktop ? 45 : 35, scalar: sc })
  setTimeout(() => confettiLib({ ...base, particleCount: p2, spread: desktop ? 110 : 90,  startVelocity: desktop ? 32 : 25, scalar: sc * 0.77 }), 120)
  setTimeout(() => confettiLib({ ...base, particleCount: p3, spread: desktop ? 150 : 120, startVelocity: desktop ? 22 : 18, scalar: sc * 0.64, gravity: 0.6 }), 260)
}
