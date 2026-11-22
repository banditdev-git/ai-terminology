// The parts of your AI rig. Each part has MAX_LEVEL upgrades; the 3D model reads these levels.

export type PartId = 'gpu' | 'ram' | 'cooling' | 'data' | 'params' | 'context'

export type Part = {
  id: PartId
  name: string
  blurb: string // shown as a tooltip
  tiers: string[] // tiers[0] = starting state, tiers[MAX_LEVEL] = maxed
}

export const MAX_LEVEL = 5

export const PARTS: Part[] = [
  { id: 'gpu', name: 'GPU', blurb: 'Does the math. More GPUs means faster tokens.', tiers: ['Laptop chip', 'Gaming GPU', 'Pro GPU', '2× Pro GPU', '3× Datacenter', '4× Datacenter'] },
  { id: 'ram', name: 'VRAM', blurb: 'Holds the parameters. A bigger model needs more memory.', tiers: ['8 GB', '24 GB', '80 GB', '320 GB', '1 TB', '4 TB'] },
  { id: 'cooling', name: 'Cooling', blurb: 'Keeps the hardware from overheating under load.', tiers: ['Stock fan', 'Case fan', 'Dual fans', 'Triple fans', 'Liquid loop', 'Cryo loop'] },
  { id: 'data', name: 'Data', blurb: 'Training data: what the model learns from.', tiers: ['A few blogs', 'Wikipedia', 'Books', 'Books + code', 'Public web', 'Everything'] },
  { id: 'params', name: 'Parameters', blurb: 'The learned weights. Where the knowledge lives.', tiers: ['1M', '100M', '7B', '70B', '400B', '2T'] },
  { id: 'context', name: 'Context', blurb: 'The context window: how much text the model sees at once.', tiers: ['4K', '8K', '32K', '128K', '200K', '1M'] },
]

/** Cost to go from `level` to `level + 1`. Maxing everything costs 180; a perfect run pays 200. */
export const upgradeCost = (level: number) => 2 * (level + 1)

export type Upgrades = Record<PartId, number>
export const emptyUpgrades = (): Upgrades => ({ gpu: 0, ram: 0, cooling: 0, data: 0, params: 0, context: 0 })
