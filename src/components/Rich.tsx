import type { CSSProperties } from 'react'

/** Renders **highlight** and `code` markup from the content file. Highlights sweep in one after another. */
export function Rich({ text }: { text: string }) {
  let n = 0
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith('**')) {
          return <strong key={i} className="hl" style={{ '--i': n++ } as CSSProperties}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`')) return <code key={i} className="code">{part.slice(1, -1)}</code>
        return part
      })}
    </>
  )
}
