import { useEffect, useState } from 'react'
import { useGame } from './store'
import { emptyUpgrades, type PartId } from './data/upgrades'
import { setMuted } from './sound'
import { Rig3D, type Pulses } from './components/Rig3D'
import { Shop } from './components/Shop'
import { Quiz } from './components/Quiz'
import { JuiceLayer, CoinCounter } from './components/Juice'
import { PixelIcon } from './components/Icons'

export function App() {
  const [state, dispatch] = useGame()
  const [pulses, setPulses] = useState<Pulses>(emptyUpgrades)

  useEffect(() => setMuted(state.muted), [state.muted])

  const bought = (p: PartId) => setPulses((ps) => ({ ...ps, [p]: ps[p] + 1 }))

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <img src={`${import.meta.env.BASE_URL}favicon.svg`} width={34} height={34} alt="" />
          <h1>AI Terminology</h1>
        </div>
        <div className="hud">
          <CoinCounter coins={state.coins} />
          <button
            className="sound chamfer-sm"
            aria-label={state.muted ? 'Turn sound on' : 'Turn sound off'}
            aria-pressed={!state.muted}
            onClick={() => dispatch({ type: 'toggleMute' })}
          >
            <PixelIcon name={state.muted ? 'soundOff' : 'soundOn'} size={24} />
          </button>
        </div>
      </header>

      <main className="layout">
        <section className="rig chamfer" aria-label="Your AI rig">
          <div className="rig-view">
            <Rig3D upgrades={state.upgrades} pulses={pulses} />
          </div>
          <Shop state={state} dispatch={dispatch} onBought={bought} />
        </section>

        <section className="play chamfer">
          <Quiz state={state} dispatch={dispatch} />
        </section>
      </main>
      <JuiceLayer />
    </div>
  )
}
