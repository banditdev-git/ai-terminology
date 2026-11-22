import { useEffect, useReducer } from 'react'
import { emptyUpgrades, upgradeCost, MAX_LEVEL, type PartId, type Upgrades } from './data/upgrades'

export type GameState = {
  coins: number
  upgrades: Upgrades
  /** term ids that have already paid out full coins */
  earned: Record<string, true>
  /** best score of a full run, null until the first run is finished */
  best: number | null
  muted: boolean
}

type Action =
  | { type: 'addCoins'; amount: number }
  | { type: 'markEarned'; id: string }
  | { type: 'finishRun'; score: number }
  | { type: 'buy'; part: PartId }
  | { type: 'toggleMute' }
  | { type: 'reset' }

const KEY = 'ai-terms-save-v2'

const fresh = (): GameState => ({ coins: 0, upgrades: emptyUpgrades(), earned: {}, best: null, muted: false })

function load(): GameState {
  try {
    const raw = localStorage.getItem(KEY)
    const s: GameState = raw ? { ...fresh(), ...JSON.parse(raw) } : fresh()
    s.upgrades = { ...emptyUpgrades(), ...s.upgrades }
    // testing helper: add ?coins=100 to the URL
    const bonus = Number(new URLSearchParams(location.search).get('coins'))
    if (bonus > 0) s.coins += bonus
    return s
  } catch {
    return fresh()
  }
}

function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'addCoins':
      return { ...s, coins: s.coins + a.amount }
    case 'markEarned':
      return { ...s, earned: { ...s.earned, [a.id]: true } }
    case 'finishRun':
      return { ...s, best: Math.max(a.score, s.best ?? 0) }
    case 'buy': {
      const lvl = s.upgrades[a.part]
      const cost = upgradeCost(lvl)
      if (lvl >= MAX_LEVEL || s.coins < cost) return s
      return { ...s, coins: s.coins - cost, upgrades: { ...s.upgrades, [a.part]: lvl + 1 } }
    }
    case 'toggleMute':
      return { ...s, muted: !s.muted }
    case 'reset':
      return { ...fresh(), muted: s.muted }
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state))
  }, [state])
  return [state, dispatch] as const
}
export type Dispatch = ReturnType<typeof useGame>[1]
