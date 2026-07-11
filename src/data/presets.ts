import type { Preset } from '@/types/simulation'

/** Framed vantage points. Positions are in Schwarzschild radii around the origin. */
export const PRESETS: Preset[] = [
  {
    id: 'establishing',
    name: 'Establishing',
    blurb: 'The signature three-quarter view',
    position: [0, 2.6, 15],
    target: [0, 0, 0],
    fov: 55,
  },
  {
    id: 'edge-on',
    name: 'Edge-on disk',
    blurb: 'Razor disk arcing over the shadow',
    position: [0, 0.55, 12.5],
    target: [0, 0, 0],
    fov: 46,
  },
  {
    id: 'photon-ring',
    name: 'Photon ring',
    blurb: 'Close on the bright rim of the shadow',
    position: [0, 1.1, 6.4],
    target: [0, 0, 0],
    fov: 34,
  },
  {
    id: 'polar',
    name: 'Polar view',
    blurb: 'Down the spin axis — concentric rings',
    position: [0.001, 15, 0.4],
    target: [0, 0, 0],
    fov: 56,
  },
  {
    id: 'high-orbit',
    name: 'High orbit',
    blurb: 'The grand, distant perspective',
    position: [0, 8.5, 24],
    target: [0, 0, 0],
    fov: 60,
  },
]
