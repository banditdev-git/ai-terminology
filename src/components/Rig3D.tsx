import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import type { PartId, Upgrades } from '../data/upgrades'

// Low-poly diorama: flat-shaded primitives, no textures or model files.
// Palette follows the favicon's purple ramp.
const C = {
  p1: '#d4c3e6',
  p2: '#b59ad0',
  p3: '#9776b7',
  p4: '#7a5a9c',
  p5: '#5c4180',
  board: '#3a2f52',
  ink: '#241d33',
  shell: '#ece7f3',
  paper: '#f8f6fb',
  gold: '#ffb21e',
  ice: '#cff3ff',
}

export type Pulses = Record<PartId, number>

export function Rig3D({ upgrades, pulses }: { upgrades: Upgrades; pulses: Pulses }) {
  return (
    <Canvas orthographic flat shadows dpr={[1, 2]} camera={{ position: [8, 7.2, 10], zoom: 55, near: 0.1, far: 100 }} gl={{ alpha: true, antialias: true }}>
      <FitZoom />
      <hemisphereLight args={['#ffffff', C.p4, 1.1]} />
      <directionalLight
        position={[5, 9, 6]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <Scene upgrades={upgrades} pulses={pulses} />
      <OrbitControls target={[0, 0.9, 0]} enablePan={false} enableZoom={false} minPolarAngle={0.5} maxPolarAngle={1.35} />
    </Canvas>
  )
}

/** Keep the whole diorama in frame whatever the panel size. */
function FitZoom() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.zoom = Math.min(size.width / 7.1, size.height / 5.0)
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

function Box({ args, position, rotation, color, emissive, ei = 0, opacity, shadow = true }: {
  args: [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
  emissive?: string
  ei?: number
  opacity?: number
  shadow?: boolean
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow={shadow} receiveShadow>
      <boxGeometry args={args} />
      <meshLambertMaterial color={color} emissive={emissive ?? '#000'} emissiveIntensity={ei} transparent={opacity !== undefined} opacity={opacity ?? 1} />
    </mesh>
  )
}

function Hex({ r, h, position, rotation, color, sides = 6 }: {
  r: number | [number, number]
  h: number
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
  sides?: number
}) {
  const [top, bottom] = Array.isArray(r) ? r : [r, r]
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[top, bottom, h, sides]} />
      <meshLambertMaterial color={color} flatShading />
    </mesh>
  )
}

/** Springy scale pop whenever `trigger` changes. */
function Pop({ trigger, position, children }: { trigger: number; position?: [number, number, number]; children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const start = useRef(-10)
  const last = useRef(trigger)
  useFrame(({ clock }) => {
    if (trigger !== last.current) {
      last.current = trigger
      start.current = clock.elapsedTime
    }
    const t = clock.elapsedTime - start.current
    const k = t < 1.2 ? Math.exp(-t * 5) * Math.sin(t * 22) * 0.22 : 0
    ref.current?.scale.setScalar(1 + k)
  })
  return <group ref={ref} position={position}>{children}</group>
}

function Scene({ upgrades, pulses }: { upgrades: Upgrades; pulses: Pulses }) {
  const sway = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    if (sway.current) sway.current.rotation.y = Math.sin(clock.elapsedTime * 0.35) * 0.16
  })
  const total = Object.values(pulses).reduce((a, b) => a + b, 0)

  return (
    <group ref={sway}>
      {/* layered hexagon base */}
      <Hex r={[3.0, 3.2]} h={0.4} position={[0, -0.2, 0]} color={C.p2} />
      <Hex r={[3.2, 3.35]} h={0.16} position={[0, -0.48, 0]} color={C.p4} />
      <Shockwave trigger={total} />

      <Pop trigger={pulses.context} position={[-1.45, 0, -0.2]}>
        <Monitor level={upgrades.context} />
      </Pop>
      <Keyboard />

      <group position={[0.75, 0.06, -0.25]}>
        <Case upgrades={upgrades} pulses={pulses} />
      </group>

    </group>
  )
}

// ───────────────────────── case + internals ─────────────────────────

const W = 1.3, H = 2.1, D = 2.0, T = 0.08
const INNER_X = -W / 2 + T // inner face of the motherboard wall

function Case({ upgrades, pulses }: { upgrades: Upgrades; pulses: Pulses }) {
  return (
    <group>
      {/* feet */}
      {[[-0.5, -0.8], [0.5, -0.8], [-0.5, 0.8], [0.5, 0.8]].map(([x, z]) => (
        <Box key={`${x}${z}`} args={[0.16, 0.06, 0.16]} position={[x, -0.03, z]} color={C.p5} />
      ))}
      {/* shell — the +x side is glass so you can see inside */}
      <Box args={[W, T, D]} position={[0, T / 2, 0]} color={C.shell} />
      <Box args={[W, T, D]} position={[0, H - T / 2, 0]} color={C.shell} />
      <Box args={[T, H, D]} position={[-W / 2 + T / 2, H / 2, 0]} color={C.shell} />
      <Box args={[W, H, T]} position={[0, H / 2, -D / 2 + T / 2]} color={C.shell} />
      <Box args={[W, H, T]} position={[0, H / 2, D / 2 - T / 2]} color={C.shell} />
      <Box args={[0.02, H - 2 * T, D - 2 * T]} position={[W / 2 - 0.01, H / 2, 0]} color={C.p1} opacity={0.16} shadow={false} />

      {/* soft light inside so the parts aren't lost in the top panel's shadow */}
      <pointLight position={[0.3, 1.4, 0.2]} intensity={1.2} distance={2.6} decay={1.5} />

      {/* motherboard + CPU */}
      <Box args={[0.04, H - 0.3, D - 0.3]} position={[INNER_X + 0.02, H / 2, 0]} color={C.board} />
      <Box args={[0.1, 0.34, 0.34]} position={[INNER_X + 0.09, 1.5, 0.3]} color={C.p2} />
      <Hex r={0.17} h={0.3} rotation={[0, 0, Math.PI / 2]} position={[INNER_X + 0.29, 1.5, 0.3]} color={C.p1} />

      <Pop trigger={pulses.ram} position={[INNER_X + 0.19, 1.5, -0.2]}>
        <Ram level={upgrades.ram} />
      </Pop>
      <Pop trigger={pulses.gpu} position={[INNER_X + 0.5, 0.95, -0.3]}>
        <Gpus level={upgrades.gpu} />
      </Pop>
      <Pop trigger={pulses.cooling} position={[0, 0, D / 2 + 0.04]}>
        <Fans level={upgrades.cooling} />
      </Pop>
      <Pop trigger={pulses.data} position={[W / 2 - 0.3, T, 0.6]}>
        <Drives level={upgrades.data} />
      </Pop>
      {upgrades.cooling >= 4 && <Tubes ice={upgrades.cooling >= 5} />}
      <Pop trigger={pulses.params} position={[0, H, 0]}>
        <LedGrid level={upgrades.params} />
      </Pop>
    </group>
  )
}

function Ram({ level }: { level: number }) {
  const count = [1, 2, 3, 4, 5, 6][level]
  return (
    <group>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} position={[0, 0, -i * 0.1]}>
          <Box args={[0.3, 0.7, 0.05]} color={C.p3} />
          <Box args={[0.3, 0.05, 0.06]} position={[0, 0.37, 0]} color={level >= 4 ? C.gold : C.p1} />
        </group>
      ))}
    </group>
  )
}

function Gpus({ level }: { level: number }) {
  const count = [0, 1, 1, 2, 3, 4][level]
  const fans = useRef<THREE.Group>(null)
  useFrame((_, dt) => fans.current?.traverse((o) => { if (o.userData.spin) o.rotation.y += dt * (4 + level * 2) }))
  if (level === 0) return <Box args={[0.08, 0.22, 0.22]} position={[-0.38, 0, 0.3]} color={C.p4} />
  const body = level === 1 ? C.p4 : C.board
  const shroud = level === 1 ? C.p2 : C.p3
  return (
    <group ref={fans}>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} position={[0, -i * 0.25, 0]}>
          <Box args={[0.9, 0.14, 1.1]} color={body} />
          <Box args={[0.86, 0.04, 1.04]} position={[0, 0.09, 0]} color={shroud} />
          <Box args={[0.04, 0.1, 0.9]} position={[0.46, 0, 0]} color={level >= 5 ? C.gold : C.p1} />
          {[-0.25, 0.25].map((z) => (
            <group key={z} position={[0, 0.12, z]} userData={{ spin: true }}>
              <Hex r={0.2} h={0.03} color={C.p5} />
              <Box args={[0.36, 0.035, 0.07]} color={C.p1} />
              <Box args={[0.07, 0.035, 0.36]} color={C.p1} />
            </group>
          ))}
        </group>
      ))}
    </group>
  )
}

function Fans({ level }: { level: number }) {
  const count = [1, 1, 2, 3, 3, 3][level]
  const r = level === 0 ? 0.2 : 0.27
  const blade = level >= 5 ? C.ice : C.paper
  const ref = useRef<THREE.Group>(null)
  useFrame((_, dt) => ref.current?.traverse((o) => { if (o.userData.spin) o.rotation.z += dt * (2 + level * 3) }))
  return (
    <group ref={ref}>
      {Array.from({ length: count }, (_, i) => (
        <group key={i} position={[0, 1.6 - i * 0.56, 0]}>
          <Hex r={r} h={0.06} sides={8} rotation={[Math.PI / 2, 0, 0]} color={C.p5} />
          <group position={[0, 0, 0.04]} userData={{ spin: true }}>
            {[0, 1, 2, 3].map((b) => (
              <Box key={b} args={[r * 0.38, r * 1.7, 0.02]} rotation={[0, 0, b * (Math.PI / 4)]} color={blade} shadow={false} />
            ))}
            <Hex r={r * 0.28} h={0.05} rotation={[Math.PI / 2, 0, 0]} color={C.p3} />
          </group>
        </group>
      ))}
    </group>
  )
}

function Tubes({ ice }: { ice: boolean }) {
  const color = ice ? C.ice : C.p2
  return (
    <group>
      {[-0.32, -0.16].map((x) => (
        <group key={x}>
          <Hex r={0.045} h={0.62} rotation={[Math.PI / 2, 0, 0]} position={[x, 1.5, 0.62]} color={color} />
          <Hex r={0.045} h={1.1} position={[x, 0.97, 0.9]} color={color} />
        </group>
      ))}
    </group>
  )
}

/** Parameters: a grid of "neurons" on the top panel; more light up as you upgrade. */
const LED_ORDER = [7, 12, 2, 17, 9, 14, 0, 19, 5, 11, 16, 3, 8, 13, 18, 1, 6, 10, 15, 4]
function LedGrid({ level }: { level: number }) {
  const lit = [2, 5, 8, 12, 16, 20][level]
  const litSet = useMemo(() => new Set(LED_ORDER.slice(0, lit)), [lit])
  const ref = useRef<THREE.Group>(null)
  useFrame(({ clock }) => {
    ref.current?.children.forEach((m, i) => {
      if (!litSet.has(i)) return
      const mat = (m as THREE.Mesh).material as THREE.MeshLambertMaterial
      mat.emissiveIntensity = 0.35 + Math.max(0, Math.sin(clock.elapsedTime * 2.2 + i * 1.7)) * 0.5
    })
  })
  return (
    <group ref={ref}>
      {Array.from({ length: 20 }, (_, i) => {
        const on = litSet.has(i)
        return (
          <mesh key={i} position={[-0.375 + (i % 4) * 0.25, 0.025, -0.64 + Math.floor(i / 4) * 0.32]} receiveShadow>
            <boxGeometry args={[0.2, 0.05, 0.24]} />
            <meshLambertMaterial color={on ? (level >= 5 ? C.gold : C.p1) : C.p5} emissive={on ? (level >= 5 ? C.gold : C.p2) : '#000'} emissiveIntensity={on ? 0.4 : 0} />
          </mesh>
        )
      })}
    </group>
  )
}

// ───────────────────────── desk items ─────────────────────────

/** Context window = literally a window. It gets wider and fills with token blocks. */
function Monitor({ level }: { level: number }) {
  const w = [1.0, 1.2, 1.45, 1.7, 1.95, 2.2][level]
  const h = [0.9, 0.94, 0.98, 1.04, 1.1, 1.16][level]
  const y = 0.6 + h / 2
  const tokens = useMemo(() => {
    const rows: { x: number; y: number; w: number; c: string }[] = []
    const innerW = w - 0.22
    const nRows = Math.floor((h - 0.2) / 0.11)
    let seed = 7
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280)
    for (let r = 0; r < nRows; r++) {
      let x = 0
      const limit = r === nRows - 1 ? innerW * 0.55 : innerW
      while (x < limit - 0.05) {
        const tw = Math.min(0.06 + rnd() * 0.16, limit - x)
        rows.push({ x: -innerW / 2 + x + tw / 2, y: (h - 0.2) / 2 - 0.05 - r * 0.11, w: tw, c: rnd() > 0.7 ? C.p1 : rnd() > 0.4 ? C.p3 : C.p2 })
        x += tw + 0.035
      }
    }
    return rows
  }, [w, h])
  const cursor = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => { if (cursor.current) cursor.current.visible = Math.sin(clock.elapsedTime * 5) > 0 })
  const last = tokens[tokens.length - 1]

  return (
    <group rotation={[0, 0.25, 0]}>
      <Box args={[0.6, 0.05, 0.4]} position={[0, 0.025, 0]} color={C.p4} />
      <Box args={[0.12, 0.6, 0.12]} position={[0, 0.33, -0.05]} color={C.p4} />
      <Box args={[w, h, 0.1]} position={[0, y, 0]} color={C.p5} />
      <Box args={[w - 0.1, h - 0.1, 0.02]} position={[0, y, 0.051]} color={C.ink} shadow={false} />
      <group position={[0, y, 0.064]}>
        {tokens.map((t, i) => (
          <mesh key={i} position={[t.x, t.y, 0]}>
            <boxGeometry args={[t.w, 0.06, 0.01]} />
            <meshBasicMaterial color={t.c} />
          </mesh>
        ))}
        {last && (
          <mesh ref={cursor} position={[last.x + last.w / 2 + 0.05, last.y, 0]}>
            <boxGeometry args={[0.04, 0.07, 0.01]} />
            <meshBasicMaterial color={C.paper} />
          </mesh>
        )}
      </group>
    </group>
  )
}

/** Training data: a stack of drives inside the case, one more per level. */
const MAX_DRIVES = 6
function Drives({ level }: { level: number }) {
  return (
    <group>
      {Array.from({ length: level + 1 }, (_, i) => (
        <group key={i} position={[0, 0.045 + i * 0.09, 0]}>
          <Box args={[0.42, 0.075, 0.5]} color={i === MAX_DRIVES - 1 ? C.gold : C.board} />
          <Box args={[0.3, 0.03, 0.02]} position={[-0.03, 0, 0.255]} color={C.p2} shadow={false} />
          <Box args={[0.03, 0.03, 0.02]} position={[0.16, 0, 0.255]} color={C.p1} shadow={false} />
        </group>
      ))}
    </group>
  )
}

/** Low-poly keyboard: a plate with staggered rows of keys and a space bar. */
function Keyboard() {
  const keys: [number, number, number][] = []
  for (let r = 0; r < 3; r++) for (let c = 0; c < 11; c++) keys.push([-0.5 + c * 0.1 + (r % 2) * 0.03, 0.075, -0.15 + r * 0.1])
  return (
    <group position={[-1.3, 0, 1.0]} rotation={[0, 0.18, 0]}>
      <Box args={[1.18, 0.06, 0.48]} position={[0, 0.03, 0]} color={C.p5} />
      {keys.map((p, i) => (
        <Box key={i} args={[0.075, 0.035, 0.075]} position={p} color={C.shell} shadow={false} />
      ))}
      <Box args={[0.5, 0.035, 0.075]} position={[0, 0.075, 0.16]} color={C.shell} shadow={false} />
    </group>
  )
}

function Shockwave({ trigger }: { trigger: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const start = useRef(-10)
  const last = useRef(trigger)
  useFrame(({ clock }) => {
    if (trigger !== last.current) {
      last.current = trigger
      start.current = clock.elapsedTime
    }
    const t = clock.elapsedTime - start.current
    const m = ref.current
    if (!m) return
    m.visible = t < 0.7
    m.scale.setScalar(0.6 + t * 4)
    ;(m.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.9 - t * 1.3)
  })
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} visible={false}>
      <ringGeometry args={[0.62, 0.7, 6]} />
      <meshBasicMaterial color={C.paper} transparent side={THREE.DoubleSide} />
    </mesh>
  )
}
