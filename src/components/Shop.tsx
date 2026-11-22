import { useState } from 'react'
import { PARTS, MAX_LEVEL, upgradeCost, type PartId } from '../data/upgrades'
import type { GameState, Dispatch } from '../store'
import { sfx } from '../sound'
import { juice } from './Juice'
import { PixelIcon } from './Icons'

export function Shop({ state, dispatch, onBought }: { state: GameState; dispatch: Dispatch; onBought: (p: PartId) => void }) {
  const [shaking, setShaking] = useState<string | null>(null)

  return (
    <div className="parts">
      {PARTS.map((p) => {
        const lvl = state.upgrades[p.id]
        const maxed = lvl >= MAX_LEVEL
        const cost = upgradeCost(lvl)
        const afford = state.coins >= cost
        return (
          <div key={p.id} className={`part chamfer ${maxed ? 'maxed' : ''} ${shaking === p.id ? 'shake' : ''}`} title={p.blurb}>
            <PixelIcon name={p.id} size={36} />
            <div className="part-text">
              <div className="part-name">{p.name}</div>
              <div className="part-tier">{p.tiers[lvl]}</div>
            </div>
            <div className="pips" aria-label={`Level ${lvl} of ${MAX_LEVEL}`}>
              {Array.from({ length: MAX_LEVEL }, (_, i) => (
                <span key={i} className={i < lvl ? 'on' : ''} />
              ))}
            </div>
            <button
              className={`buy chamfer-sm ${afford && !maxed ? 'can' : ''}`}
              disabled={maxed}
              aria-label={maxed ? `${p.name} is maxed` : `Upgrade ${p.name} to ${p.tiers[lvl + 1]} for ${cost} coins`}
              onClick={(e) => {
                if (!afford) {
                  sfx.wrong()
                  setShaking(p.id)
                  setTimeout(() => setShaking(null), 400)
                  return
                }
                const r = e.currentTarget.getBoundingClientRect()
                dispatch({ type: 'buy', part: p.id })
                sfx.buy()
                juice.text(r.left + r.width / 2, r.top, `-${cost}`, '#d4c3e6')
                juice.toast(`${p.name} upgraded to ${p.tiers[lvl + 1]}`)
                onBought(p.id)
              }}
            >
              {maxed ? 'Max' : (
                <>
                  <PixelIcon name="coin" size={24} />
                  {cost}
                </>
              )}
            </button>
          </div>
        )
      })}
    </div>
  )
}
