import type { BlackHoleObject } from '@/types/simulation'

/**
 * The objects the explorer can load. `params` overrides only the disk/look; mass,
 * spin and distance drive the telemetry rescale. Numbers are real (Gargantua is the
 * film's flagship). Disk colour follows the temperature ramp — Cygnus X-1's hot disk
 * runs blue, the supermassive giants run gold.
 */
export const BLACK_HOLES: BlackHoleObject[] = [
  {
    id: 'gargantua',
    name: 'Gargantua',
    designation: 'Interstellar (2014)',
    kind: 'fictional',
    massSolar: 1.0e8,
    spin: 0.99,
    tagline: 'The fictional black hole from Interstellar',
    blurb:
      "The film's black hole, designed with physicist Kip Thorne. A near-maximally spinning supermassive hole with a cool, gold accretion disk and the fierce time dilation that stranded a landing party on Miller's planet.",
    params: {
      diskInner: 2.6, diskOuter: 10, diskBrightness: 0.66, diskTemperature: 0.26,
      diskDensity: 1.0, diskSpeed: 1.0, diskThickness: 0.26, jet: 0, nebula: 0.45, starDensity: 1.0,
    },
    facts: [
      { label: 'Mass', value: '100M M☉' },
      { label: 'Spin', value: 'a ≈ 0.999' },
      { label: "Miller's planet", value: '1 hr ≈ 7 yr' },
    ],
    codexId: 'obj-gargantua',
  },
  {
    id: 'sgra',
    name: 'Sagittarius A*',
    designation: 'Milky Way core',
    kind: 'supermassive',
    massSolar: 4.297e6,
    spin: 0.9,
    distanceLy: 26996,
    tagline: "Our galaxy's own black hole",
    blurb:
      'The supermassive black hole at the heart of the Milky Way, about 27,000 light-years away. A quiet, slow eater — its faint disk earned the Event Horizon Telescope its second black hole portrait in 2022.',
    params: {
      diskInner: 3.0, diskOuter: 9, diskBrightness: 0.42, diskTemperature: 0.34,
      diskDensity: 0.7, diskSpeed: 0.9, diskThickness: 0.24, jet: 0, nebula: 0.5, starDensity: 1.1,
    },
    facts: [
      { label: 'Mass', value: '4.3M M☉' },
      { label: 'Distance', value: '27,000 ly' },
      { label: 'Imaged', value: 'EHT · 2022' },
    ],
    codexId: 'obj-sgra',
  },
  {
    id: 'm87',
    name: 'M87*',
    designation: 'Virgo A · NGC 4486',
    kind: 'supermassive',
    massSolar: 6.5e9,
    spin: 0.9,
    distanceLy: 53.5e6,
    tagline: 'The first black hole ever imaged',
    blurb:
      'A giant at the centre of galaxy M87, some 53 million light-years away. In 2019 it became the first black hole ever directly imaged. It drives a relativistic jet roughly 5,000 light-years long.',
    params: {
      diskInner: 2.8, diskOuter: 11.5, diskBrightness: 0.72, diskTemperature: 0.44,
      diskDensity: 1.0, diskSpeed: 0.7, diskThickness: 0.28, jet: 0.85, nebula: 0.4, starDensity: 0.9,
    },
    facts: [
      { label: 'Mass', value: '6.5B M☉' },
      { label: 'Distance', value: '53M ly' },
      { label: 'Jet', value: '~5,000 ly' },
    ],
    codexId: 'obj-m87',
  },
  {
    id: 'cygx1',
    name: 'Cygnus X-1',
    designation: 'X-ray binary',
    kind: 'stellar',
    massSolar: 21.2,
    spin: 0.95,
    distanceLy: 7240,
    tagline: 'A stellar-mass furnace',
    blurb:
      'A 21-solar-mass black hole pulling gas from a blue supergiant companion. Its inner disk blazes at millions of degrees, radiating X-rays. It was the first object widely accepted as a black hole — and the subject of a famous Hawking–Thorne bet.',
    params: {
      diskInner: 2.3, diskOuter: 8, diskBrightness: 0.95, diskTemperature: 0.92,
      diskDensity: 1.1, diskSpeed: 1.7, diskThickness: 0.32, jet: 0.35, nebula: 0.7, starDensity: 1.3,
    },
    facts: [
      { label: 'Mass', value: '21 M☉' },
      { label: 'Distance', value: '7,200 ly' },
      { label: 'Inner disk', value: 'millions K' },
    ],
    codexId: 'obj-cygx1',
  },
  {
    id: 'ton618',
    name: 'TON 618',
    designation: 'Hyperluminous quasar',
    kind: 'ultramassive',
    massSolar: 4.0e10,
    spin: 0.9,
    distanceLy: 10.4e9,
    tagline: 'One of the most massive known',
    blurb:
      'An ultramassive black hole powering a quasar over 10 billion light-years away, at roughly 40 billion solar masses. Its event horizon dwarfs our entire solar system many times over.',
    params: {
      diskInner: 2.6, diskOuter: 13, diskBrightness: 1.05, diskTemperature: 0.6,
      diskDensity: 1.0, diskSpeed: 0.55, diskThickness: 0.3, jet: 0.25, nebula: 0.35, starDensity: 0.8,
    },
    facts: [
      { label: 'Mass', value: '~40B M☉' },
      { label: 'Distance', value: '10.4B ly' },
      { label: 'Type', value: 'Quasar' },
    ],
    codexId: 'obj-ton618',
  },
]

export const DEFAULT_OBJECT_ID = 'gargantua'

export function getObject(id: string): BlackHoleObject {
  return BLACK_HOLES.find((o) => o.id === id) ?? BLACK_HOLES[0]
}
