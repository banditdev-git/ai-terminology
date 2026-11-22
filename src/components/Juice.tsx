import { useEffect, useRef, useState } from 'react'
import { sfx } from '../sound'
import { PixelIcon } from './Icons'

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A tiny global event bus so any component can trigger screen effects.
type Fx =
  | { kind: 'coins'; id: number; x: number; y: number; amount: number }
  | { kind: 'text'; id: number; x: number; y: number; text: string; color: string }
  | { kind: 'confetti'; id: number }
  | { kind: 'toast'; id: number; text: string }

type Listener = (fx: Fx) => void
const listeners = new Set<Listener>()
const arriveListeners = new Set<() => void>()
let nextId = 1
type NoId<T> = T extends unknown ? Omit<T, 'id'> : never
const emit = (fx: NoId<Fx>) => listeners.forEach((l) => l({ ...fx, id: nextId++ } as Fx))

export const juice = {
  /** coins burst from (x,y) and fly into the coin counter */
  coins: (x: number, y: number, amount: number) => {
    if (reducedMotion()) arriveListeners.forEach((fn) => fn())
    else emit({ kind: 'coins', x, y, amount })
  },
  text: (x: number, y: number, text: string, color = '#ffb21e') => emit({ kind: 'text', x, y, text, color }),
  confetti: () => { if (!reducedMotion()) emit({ kind: 'confetti' }) },
  toast: (text: string) => emit({ kind: 'toast', text }),
  onCoinArrive: (fn: () => void) => {
    arriveListeners.add(fn)
    return () => void arriveListeners.delete(fn)
  },
}

export function JuiceLayer() {
  const [fx, setFx] = useState<Fx[]>([])
  useEffect(() => {
    const l: Listener = (f) => setFx((a) => [...a, f])
    listeners.add(l)
    return () => void listeners.delete(l)
  }, [])
  const done = (id: number) => setFx((a) => a.filter((f) => f.id !== id))

  return (
    <div className="juice-layer">
      {fx.map((f) =>
        f.kind === 'coins' ? (
          <CoinBurst key={f.id} {...f} onDone={() => done(f.id)} />
        ) : f.kind === 'text' ? (
          <FloatText key={f.id} {...f} onDone={() => done(f.id)} />
        ) : f.kind === 'confetti' ? (
          <Confetti key={f.id} onDone={() => done(f.id)} />
        ) : (
          <Toast key={f.id} text={f.text} onDone={() => done(f.id)} />
        ),
      )}
    </div>
  )
}

function CoinBurst({ x, y, amount, onDone }: { x: number; y: number; amount: number; onDone: () => void }) {
  const count = Math.min(12, Math.max(3, Math.ceil(amount / 1.5)))
  const finished = useRef(0)
  const target = document.getElementById('coin-counter')?.getBoundingClientRect()
  const tx = target ? target.left + target.width / 2 : window.innerWidth / 2
  const ty = target ? target.top + target.height / 2 : 0

  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="fly-coin"
          style={{ left: x, top: y }}
          ref={(el) => {
            if (!el || el.dataset.started) return
            el.dataset.started = '1'
            // burst outward, then curve into the counter
            const ang = (i / count) * Math.PI * 2 + Math.random()
            const r = 40 + Math.random() * 50
            const bx = Math.cos(ang) * r
            const by = Math.sin(ang) * r - 30
            const anim = el.animate(
              [
                { transform: 'translate(-50%,-50%) scale(0.2)', opacity: 0 },
                { transform: `translate(calc(-50% + ${bx}px), calc(-50% + ${by}px)) scale(1.15)`, opacity: 1, offset: 0.3 },
                { transform: `translate(calc(-50% + ${tx - x}px), calc(-50% + ${ty - y}px)) scale(0.6)`, opacity: 1 },
              ],
              { duration: 650 + i * 45, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' },
            )
            anim.onfinish = () => {
              el.style.display = 'none'
              sfx.coin(i)
              arriveListeners.forEach((fn) => fn())
              if (++finished.current === count) onDone()
            }
          }}
        >
          <PixelIcon name="coin" size={24} />
        </div>
      ))}
    </>
  )
}

function FloatText({ x, y, text, color, onDone }: { x: number; y: number; text: string; color: string; onDone: () => void }) {
  return (
    <div className="float-text" style={{ left: x, top: y, color }} onAnimationEnd={onDone}>
      {text}
    </div>
  )
}

const CONFETTI_COLORS = ['#d4c3e6', '#b59ad0', '#9776b7', '#7a5a9c', '#5c4180', '#ffb21e']
function Confetti({ onDone }: { onDone: () => void }) {
  const pieces = useRef(
    Array.from({ length: 90 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      dur: 1.8 + Math.random() * 1.4,
      drift: (Math.random() - 0.5) * 300,
      spin: (Math.random() - 0.5) * 1440,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      w: [6, 9, 12][Math.floor(Math.random() * 3)],
    })),
  ).current
  const doneRef = useRef(onDone)
  doneRef.current = onDone
  useEffect(() => {
    const t = setTimeout(() => doneRef.current(), 3600)
    return () => clearTimeout(t)
  }, [])
  return (
    <>
      {pieces.map((p, i) => (
        <div
          key={i}
          className="confetti"
          style={
            {
              left: `${p.left}%`,
              width: p.w,
              height: p.w,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              '--drift': `${p.drift}px`,
              '--spin': `${p.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </>
  )
}

function Toast({ text, onDone }: { text: string; onDone: () => void }) {
  return (
    <div className="toast" onAnimationEnd={onDone}>
      {text}
    </div>
  )
}

/** Animated coin counter: ticks toward the real value and bumps when coins land. */
export function CoinCounter({ coins }: { coins: number }) {
  const [shown, setShown] = useState(coins)
  const [bump, setBump] = useState(0)
  const shownRef = useRef(coins)

  useEffect(() => juice.onCoinArrive(() => setBump((b) => b + 1)), [])

  useEffect(() => {
    let raf = 0
    const from = shownRef.current
    const delay = coins > from ? 550 : 0 // wait for flying coins to land
    const start = performance.now() + delay
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 500))
      const v = Math.round(from + (coins - from) * (1 - Math.pow(1 - t, 3)))
      shownRef.current = v
      setShown(v)
      if (t < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [coins])

  return (
    <div id="coin-counter" className="coin-counter" key={bump}>
      <PixelIcon name="coin" size={24} />
      <span>{shown}</span>
    </div>
  )
}
