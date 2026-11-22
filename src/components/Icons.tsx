import type { ReactElement } from 'react'
// Hand-drawn 12×12 pixel icons. Every icon uses the same small palette:
// K ink outline · W light · A theme purple · D dark purple (+ coin golds for the coin only)

const PAL: Record<string, string> = {
  K: '#241d33',
  W: '#f8f6fb',
  A: '#9776b7',
  D: '#5c4180',
  Y: '#ffb21e',
  L: '#ffe15a',
  O: '#c26a12',
}

type Grid = readonly string[]

export const ICONS = {
  gpu: [
    '............',
    'KK..........',
    'KDKKKKKKKKKK',
    'KDKWWWWWWWWK',
    'KDKWKKWWKKWK',
    'KDKKAAKKAAKK',
    'KDKKAAKKAAKK',
    'KDKWKKWWKKWK',
    'KDKWWWWWWWWK',
    'KDKKKKKKKKKK',
    'KK..KDKDKDK.',
    '....KKKKKKK.',
  ],
  ram: [
    '............',
    '............',
    'KKKKKKKKKKKK',
    'KWWWWWWWWWWK',
    'KWKKWKKWKKWK',
    'KWKKWKKWKKWK',
    'KWWWWWWWWWWK',
    'KAAAAAAAAAAK',
    'KADADADADADK',
    'KKKKK.KKKKKK',
    '............',
    '............',
  ],
  cooling: [
    'KKKKKKKKKKKK',
    'KDWWWWWWWWDK',
    'KWKKKKKKKKWK',
    'KWKAAAWWWKWK',
    'KWKWAAWWAKWK',
    'KWKWWKKAAKWK',
    'KWKAAKKWWKWK',
    'KWKAWWAAWKWK',
    'KWKWWWAAAKWK',
    'KWKKKKKKKKWK',
    'KDWWWWWWWWDK',
    'KKKKKKKKKKKK',
  ],
  data: [
    '............',
    '.KKKKKKKKKK.',
    '.KAAAAAAAAK.',
    '.KWWWWWWWAK.',
    'KKKKKKKKKKK.',
    'KDDDDDDDDDK.',
    'KWWWWWWWWDK.',
    '.KKKKKKKKKKK',
    '.KAAAAAAAAAK',
    '.KWWWWWWWWAK',
    '.KKKKKKKKKKK',
    '............',
  ],
  params: [
    '...K.KK.K...',
    '...K.KK.K...',
    '..KKKKKKKK..',
    'KKKWWWWWWKKK',
    '..KWAAAAWK..',
    'KKKWADDAWKKK',
    'KKKWADDAWKKK',
    '..KWAAAAWK..',
    'KKKWWWWWWKKK',
    '..KKKKKKKK..',
    '...K.KK.K...',
    '...K.KK.K...',
  ],
  context: [
    '............',
    'KKKKKKKKKKKK',
    'KAAAAAAWAWAK',
    'KKKKKKKKKKKK',
    'KWWWWWWWWWWK',
    'KWDDDWDDDDWK',
    'KWWWWWWWWWWK',
    'KWDDWDDDWWWK',
    'KWWWWWWWWWWK',
    'KWDDDDWDDWWK',
    'KWWWWWWWWWWK',
    'KKKKKKKKKKKK',
  ],
  coin: [
    '...KKKKKK...',
    '.KKLLLLYYKK.',
    '.KLLYYYYYOK.',
    'KLLYYLOYYYOK',
    'KLYYYLOYYYOK',
    'KLYYYLOYYYOK',
    'KLYYYLOYYYOK',
    'KLYYYLOYYYOK',
    'KLYYYYYYYOOK',
    '.KYYYYYYOOK.',
    '.KKOOOOOOKK.',
    '...KKKKKK...',
  ],
  soundOn: [
    '............',
    '....KK......',
    '...KWK...A..',
    '..KWWK.A..A.',
    'KKKWWK..A.A.',
    'KWWWWK..A.A.',
    'KWWWWK..A.A.',
    'KKKWWK..A.A.',
    '..KWWK.A..A.',
    '...KWK...A..',
    '....KK......',
    '............',
  ],
  soundOff: [
    '............',
    '....KK......',
    '...KWK......',
    '..KWWK......',
    'KKKWWK.A..A.',
    'KWWWWK..AA..',
    'KWWWWK..AA..',
    'KKKWWK.A..A.',
    '..KWWK......',
    '...KWK......',
    '....KK......',
    '............',
  ],
  github: [
    '...KKKKKK...',
    '.KKKKKKKKKK.',
    '.KKWKKKKWKK.',
    'KKKWWWWWWKKK',
    'KKWWWWWWWWKK',
    'KKWWWWWWWWKK',
    'KKWWWWWWWWKK',
    'KKKWWWWWWKKK',
    'KWKKKWWKKKKK',
    '.KWWWWWKKKK.',
    '.KKKKWWKKKK.',
    '...KKWWKK...',
  ],
} satisfies Record<string, Grid>

export type IconName = keyof typeof ICONS

/** Renders a pixel grid as crisp SVG rects (horizontal runs merged). Size should be a multiple of 12. */
export function PixelIcon({ name, size = 36, className }: { name: IconName; size?: number; className?: string }) {
  const grid = ICONS[name]
  const rects: ReactElement[] = []
  grid.forEach((row, y) => {
    let x = 0
    while (x < row.length) {
      const c = row[x]
      if (c === '.') { x++; continue }
      let w = 1
      while (row[x + w] === c) w++
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={PAL[c]} />)
      x += w
    }
  })
  return (
    <svg className={className} viewBox="0 0 12 12" width={size} height={size} shapeRendering="crispEdges" aria-hidden="true">
      {rects}
    </svg>
  )
}
