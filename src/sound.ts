// Tiny synth sound effects via Web Audio — no audio files needed.
let ctx: AudioContext | null = null
let muted = false
export const setMuted = (m: boolean) => { muted = m }

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', vol = 0.15, slideTo?: number) {
  if (muted) return
  ctx ??= new AudioContext()
  const t = ctx.currentTime + start
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t)
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur)
  gain.gain.setValueAtTime(0.0001, t)
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t)
  osc.stop(t + dur + 0.05)
}

export const sfx = {
  click: () => tone(600, 0, 0.05, 'square', 0.04),
  // pitch climbs with the streak for extra satisfaction
  correct: (streak = 0) => {
    const base = 520 * Math.pow(1.06, Math.min(streak, 12))
    tone(base, 0, 0.12, 'triangle')
    tone(base * 1.26, 0.08, 0.12, 'triangle')
    tone(base * 1.5, 0.16, 0.2, 'triangle')
  },
  wrong: () => {
    tone(180, 0, 0.25, 'sawtooth', 0.08, 90)
  },
  coin: (i = 0) => tone(1300 + i * 40, 0, 0.08, 'square', 0.035),
  buy: () => {
    tone(220, 0, 0.35, 'sawtooth', 0.06, 880)
    tone(880, 0.3, 0.15, 'triangle', 0.12)
    tone(1320, 0.4, 0.25, 'triangle', 0.1)
  },
  fanfare: () => {
    ;[523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, 'triangle', 0.12))
    tone(1047, 0.5, 0.6, 'triangle', 0.1)
  },
}
