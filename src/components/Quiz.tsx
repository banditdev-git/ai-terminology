import { useEffect, useMemo, useRef, useState } from 'react'
import { TERMS } from '../data/terms'
import type { GameState, Dispatch } from '../store'
import { sfx } from '../sound'
import { juice } from './Juice'
import { Rich } from './Rich'

const FULL_REWARD = 10 // first time you get one right
const REPEAT_REWARD = 2 // already earned before

const shuffle = <T,>(a: T[]) => {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

export function Quiz({ state, dispatch }: { state: GameState; dispatch: Dispatch }) {
  const total = TERMS.length
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'learn' | 'ask'>('learn')
  const [picked, setPicked] = useState<number | null>(null)
  const [results, setResults] = useState<boolean[]>([])
  const [streak, setStreak] = useState(0)
  const [runCoins, setRunCoins] = useState(0)
  const [reread, setReread] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [shake, setShake] = useState(false)
  const [finished, setFinished] = useState(false)
  const [run, setRun] = useState(0)
  const choiceRefs = useRef<(HTMLButtonElement | null)[]>([])
  const mainBtn = useRef<HTMLButtonElement>(null)

  const term = TERMS[idx]
  const choices = useMemo(() => shuffle(term.choices), [term, run])

  // move focus to the main action so keyboard users can keep pressing Enter
  const viewKey = `${idx}-${phase}-${picked}-${finished}`
  const lastView = useRef(viewKey)
  useEffect(() => {
    if (lastView.current === viewKey) return // not on first load
    lastView.current = viewKey
    mainBtn.current?.focus({ preventScroll: true })
  }, [viewKey])

  const restart = () => {
    sfx.click()
    setIdx(0); setPhase('learn'); setPicked(null); setResults([]); setStreak(0)
    setRunCoins(0); setReread(false); setFinished(false); setRun((r) => r + 1)
  }

  const next = () => {
    sfx.click()
    if (phase === 'learn') return setPhase('ask')
    setPicked(null)
    setReread(false)
    setShowCard(false)
    if (idx + 1 >= total) {
      const score = results.filter(Boolean).length
      dispatch({ type: 'finishRun', score })
      setFinished(true)
      sfx.fanfare()
      juice.confetti()
    } else {
      setIdx(idx + 1)
      setPhase('learn')
    }
  }

  const answer = (i: number) => {
    if (picked !== null || phase !== 'ask') return
    setPicked(i)
    const correct = !!choices[i].correct
    setResults((r) => [...r, correct])
    const rect = choiceRefs.current[i]?.getBoundingClientRect()
    const cx = rect ? rect.left + rect.width * 0.7 : innerWidth / 2
    const cy = rect ? rect.top + rect.height / 2 : innerHeight / 2

    if (correct) {
      let amount = state.earned[term.id] ? REPEAT_REWARD : FULL_REWARD
      if (reread) amount = Math.ceil(amount / 2)
      dispatch({ type: 'addCoins', amount })
      dispatch({ type: 'markEarned', id: term.id })
      setRunCoins((c) => c + amount)
      sfx.correct(streak)
      setStreak((s) => s + 1)
      juice.coins(cx, cy, amount)
      juice.text(cx, cy - 24, `+${amount}`)
      if (streak + 1 >= 3) juice.text(cx, cy - 60, `${streak + 1} in a row`, '#d4c3e6')
    } else {
      sfx.wrong()
      setStreak(0)
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  // keyboard: 1/2/3 to answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!finished && phase === 'ask' && picked === null && !showCard && ['1', '2', '3'].includes(e.key)) answer(Number(e.key) - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const progress = (
    <div className="progress-row">
      <div className="progress" aria-hidden="true">
        {TERMS.map((t, i) => (
          <span key={t.id} className={i < results.length ? (results[i] ? 'good' : 'bad') : i === idx && !finished ? 'now' : ''} />
        ))}
      </div>
      <span className="count">{finished ? total : idx + 1}/{total}</span>
    </div>
  )

  if (finished) {
    const score = results.filter(Boolean).length
    const missed = TERMS.filter((_, i) => !results[i])
    return (
      <div className="quiz">
        {progress}
        <div className="screen result">
          <div className="result-score">{score}/{total}</div>
          <p className="lead">
            {score === total ? 'All of them, first try.' : score >= total * 0.7 ? 'Most of them. Play again to fix the rest.' : 'Play again. Anything you missed still pays full coins the first time you get it right.'}
          </p>
          <p className="earned">You earned {runCoins} coins this run.</p>
          {missed.length > 0 && (
            <div className="review">
              <div className="review-title">Worth another look</div>
              <div className="chips">{missed.map((t) => <span key={t.id} className="chip chamfer-sm">{t.name}</span>)}</div>
            </div>
          )}
          <button ref={mainBtn} className="btn primary chamfer" onClick={restart}>Play again</button>
          <ResetButton dispatch={dispatch} onReset={restart} />
        </div>
      </div>
    )
  }

  return (
    <div className="quiz">
      {progress}

      {phase === 'learn' ? (
        <div className="screen learn" key={`l${idx}`}>
          <h2 className="term">{term.name}</h2>
          <p className="lead"><Rich text={term.info} /></p>
          <button ref={mainBtn} className="btn primary chamfer" onClick={next}>Got it</button>
        </div>
      ) : (
        <div className={`screen ask ${shake ? 'shake' : ''}`} key={`q${idx}`}>
          <h2 className="question">{term.q}</h2>
          <div className="choices">
            {choices.map((c, i) => {
              const s = picked === null ? '' : c.correct ? 'correct' : i === picked ? 'wrong' : 'dim'
              return (
                <button key={i} ref={(el) => { choiceRefs.current[i] = el }} className={`choice chamfer ${s}`} disabled={picked !== null} onClick={() => answer(i)}>
                  <span className="key">{i + 1}</span>
                  <span>{c.text}</span>
                </button>
              )
            })}
          </div>

          {picked === null ? (
            <button className="link" onClick={() => { setReread(true); setShowCard(true); sfx.click() }}>
              {reread ? 'Read the card again' : 'Read the card again (half coins)'}
            </button>
          ) : (
            <div className={`explain chamfer ${choices[picked].correct ? 'good' : 'bad'}`}>
              <div className="explain-title">{choices[picked].correct ? 'Correct' : 'Not quite'}</div>
              <p><Rich text={choices[picked].why} /></p>
              {!choices[picked].correct && <p><span className="answer-label">The answer:</span> <Rich text={choices.find((c) => c.correct)!.text} />. <Rich text={choices.find((c) => c.correct)!.why} /></p>}
              <button ref={mainBtn} className="btn primary chamfer" onClick={next}>{idx + 1 >= total ? 'See results' : 'Next'}</button>
            </div>
          )}

          {showCard && (
            <div className="overlay" onClick={() => setShowCard(false)}>
              <div className="screen learn card-pop chamfer" onClick={(e) => e.stopPropagation()}>
                <h2 className="term">{term.name}</h2>
                <p className="lead"><Rich text={term.info} /></p>
                <button className="btn primary chamfer" autoFocus onClick={() => setShowCard(false)}>Back to the question</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ResetButton({ dispatch, onReset }: { dispatch: Dispatch; onReset: () => void }) {
  const [armed, setArmed] = useState(false)
  return (
    <button
      className="link"
      onClick={() => {
        if (!armed) return setArmed(true)
        dispatch({ type: 'reset' })
        onReset()
      }}
      onBlur={() => setArmed(false)}
    >
      {armed ? 'Click again to erase coins and upgrades' : 'Reset progress'}
    </button>
  )
}
