import type { TourKeyframe } from '@/types/simulation'

/**
 * The Grand Tour — a narrated journey from Gargantua's approach through the
 * anatomy and relativity of black holes, then across the real objects in the
 * explorer. Chapters switch the observed object, flip render mode, and toggle
 * the anatomy overlay. Fully navigable via the transport controls.
 */
export const TOUR: TourKeyframe[] = [
  {
    id: 'approach',
    title: 'Gargantua',
    caption:
      'A hundred million suns folded into a spinning sphere roughly two astronomical units across. We begin our approach.',
    objectId: 'gargantua',
    mode: 'cinematic',
    annotate: false,
    position: [0, 4.5, 34],
    target: [0, 0, 0],
    fov: 58,
    duration: 6,
    hold: 4,
  },
  {
    id: 'shadow',
    title: 'The Shadow',
    caption:
      'The black disc is the shadow — light that fell past the event horizon and never returned. Lensing swells it to about 2.6 Schwarzschild radii.',
    annotate: true,
    position: [0, 1.8, 13],
    target: [0, 0, 0],
    fov: 48,
    duration: 5.5,
    hold: 4.5,
  },
  {
    id: 'photon-ring',
    title: 'The Photon Ring',
    caption:
      'At one and a half radii, gravity bends light into orbit. That trapped glow forms the brilliant, knife-thin ring tracing the shadow.',
    annotate: true,
    position: [0, 1.0, 6.4],
    target: [0, 0, 0],
    fov: 34,
    duration: 5,
    hold: 4.5,
  },
  {
    id: 'lensing',
    title: 'Gravitational Lensing',
    caption:
      'The disk lies flat, yet you see it arc overhead and beneath. Gargantua bends the light of its far side up and over the shadow — the signature "eye".',
    annotate: true,
    position: [0, 0.55, 9],
    target: [0, 0, 0],
    fov: 42,
    duration: 5,
    hold: 5,
  },
  {
    id: 'doppler',
    title: 'The True Colours',
    caption:
      'In reality the disk is lopsided: the edge sweeping toward us blazes brighter and bluer, the receding edge fades. Scientific mode restores this Doppler beaming the film chose to hide.',
    mode: 'scientific',
    annotate: false,
    position: [0, 0.5, 11],
    target: [0, 0, 0],
    fov: 46,
    duration: 5,
    hold: 5.5,
  },
  {
    id: 'dilation',
    title: 'Where Time Crawls',
    caption:
      "Deep in this gravity well, clocks nearly stop. On Miller's planet, one hour cost the crew seven years — real physics, born of Gargantua's fierce spin.",
    mode: 'cinematic',
    annotate: false,
    position: [0, 1.2, 6.8],
    target: [0, 0, 0],
    fov: 38,
    duration: 5,
    hold: 5,
  },
  {
    id: 'cygnus',
    title: 'A Stellar Furnace',
    caption:
      'Not every black hole is a giant. Cygnus X-1 is a 21-solar-mass hole devouring a companion star — its inner disk blazing blue-white at millions of degrees. Here, tides would shred you far outside the horizon.',
    objectId: 'cygx1',
    annotate: false,
    position: [0, 1.6, 12],
    target: [0, 0, 0],
    fov: 50,
    duration: 6,
    hold: 5.5,
  },
  {
    id: 'm87',
    title: 'Engines of Galaxies',
    caption:
      'M87* — the first black hole ever imaged — launches a jet of plasma 5,000 light-years long from its poles, powered by its spin and magnetic field.',
    objectId: 'm87',
    position: [0, 3.4, 15],
    target: [0, 0, 0],
    fov: 55,
    duration: 6,
    hold: 5.5,
  },
  {
    id: 'sgra',
    title: "Our Galaxy's Heart",
    caption:
      'Sagittarius A*, 4.3 million suns at the centre of the Milky Way. A quiet eater, imaged by the Event Horizon Telescope in 2022 — its mass mapped by watching stars whirl around it.',
    objectId: 'sgra',
    position: [0, 2.2, 13],
    target: [0, 0, 0],
    fov: 52,
    duration: 6,
    hold: 5,
  },
  {
    id: 'ton618',
    title: 'A Cosmic Titan',
    caption:
      'And a monster: TON 618, some 40 billion solar masses, its horizon dwarfing our solar system many times over — one of the largest black holes ever weighed.',
    objectId: 'ton618',
    position: [0, 3.0, 16],
    target: [0, 0, 0],
    fov: 56,
    duration: 6,
    hold: 5,
  },
  {
    id: 'return',
    title: 'Take the Helm',
    caption:
      'Free flight resumes at Gargantua. Explore on your own trajectory — and open the Codex whenever you want to go deeper.',
    objectId: 'gargantua',
    mode: 'cinematic',
    annotate: false,
    position: [0, 2.6, 15],
    target: [0, 0, 0],
    fov: 55,
    duration: 5.5,
    hold: 2,
  },
]
