import type { CodexArticle, CodexSection } from '@/types/simulation'

/**
 * The Codex — a browsable, layered black-hole encyclopedia. Each article opens
 * with accessible prose (`body`); the "Go deeper" disclosure reveals the technical
 * layer (`deeper` + `equations`). Facts verified against NASA / ESO / EHT / LIGO
 * sources and the Thorne et al. Interstellar paper.
 */

export const CODEX_SECTIONS: CodexSection[] = [
  {
    id: 'foundations',
    title: 'Foundations',
    blurb: 'What a black hole is, and the warped spacetime that makes one.',
    articleIds: ['what-is', 'spacetime', 'escape-velocity', 'singularity'],
  },
  {
    id: 'anatomy',
    title: 'Anatomy',
    blurb: 'The parts of a black hole you can see on screen.',
    articleIds: ['event-horizon', 'shadow', 'photon-sphere', 'accretion-disk', 'isco', 'ergosphere', 'jets'],
  },
  {
    id: 'relativity',
    title: 'Relativity in action',
    blurb: 'The strange effects strong gravity has on light and time.',
    articleIds: ['lensing', 'time-dilation', 'spaghettification', 'doppler', 'redshift'],
  },
  {
    id: 'deep-physics',
    title: 'Deep physics',
    blurb: 'Where gravity meets quantum mechanics and thermodynamics.',
    articleIds: ['hawking', 'thermodynamics', 'information-paradox', 'penrose', 'no-hair'],
  },
  {
    id: 'types',
    title: 'Types & origins',
    blurb: 'The black-hole family, from stellar remnants to galactic giants.',
    articleIds: ['stellar-mass', 'intermediate', 'supermassive', 'primordial', 'formation', 'mergers'],
  },
  {
    id: 'real',
    title: 'Real black holes',
    blurb: 'The objects you can load in the explorer — and one you can hear.',
    articleIds: ['obj-gargantua', 'obj-sgra', 'obj-m87', 'obj-cygx1', 'obj-ton618', 'gw150914'],
  },
  {
    id: 'interstellar',
    title: 'The Interstellar science',
    blurb: 'How the film built the most accurate black hole ever put on screen.',
    articleIds: ['dngr', 'millers-planet', 'thorne'],
  },
  {
    id: 'observing',
    title: 'Observing black holes',
    blurb: 'How we actually detect the invisible.',
    articleIds: ['eht', 'xray-binaries', 'stellar-orbits', 'gw-astronomy'],
  },
]

export const CODEX_ARTICLES: CodexArticle[] = [
  // ---- Foundations ----
  {
    id: 'what-is',
    section: 'foundations',
    title: 'What is a black hole?',
    summary: 'A region where gravity is so strong that nothing — not even light — can escape.',
    body: [
      'A black hole is a place where matter has been crushed so densely that its gravity overwhelms everything else. Pack enough mass into a small enough space and the escape velocity — the speed needed to break free — climbs past the speed of light. Since nothing outruns light, nothing gets out. That boundary is the event horizon, and the darkness inside is the "black" in black hole.',
      'Black holes are not cosmic vacuum cleaners. Far away, a black hole pulls on you exactly like any other object of the same mass — swap the Sun for a black hole of one solar mass and Earth would orbit undisturbed. The strangeness only appears when you get close, where space and time themselves are bent almost beyond recognition.',
    ],
    deeper: [
      'In general relativity a black hole is a vacuum solution of the Einstein field equations bounded by an event horizon — a one-way causal surface. The simplest, a non-rotating uncharged hole, is described by the Schwarzschild metric (1916). Real astrophysical holes rotate and are described by the Kerr metric (1963). They are characterised by just three numbers: mass, spin, and charge.',
    ],
    equations: [{ expr: 'v_esc = √(2GM / r)', caption: 'Escape velocity — reaches c at the horizon.' }],
    facts: [
      { label: 'Defined by', value: 'Mass · spin · charge' },
      { label: 'Boundary', value: 'Event horizon' },
    ],
    related: ['spacetime', 'event-horizon', 'escape-velocity'],
    demo: { objectId: 'gargantua', annotate: true },
  },
  {
    id: 'spacetime',
    section: 'foundations',
    title: 'Spacetime & general relativity',
    summary: 'Gravity is not a force but the curvature of spacetime — and mass does the curving.',
    body: [
      "Einstein's general relativity (1915) reimagined gravity. Instead of a force reaching across space, mass and energy curve the four-dimensional fabric of spacetime, and objects simply follow the straightest available paths through that curved geometry. Planets orbit the Sun not because they are pulled, but because they roll along a valley the Sun's mass carves into spacetime.",
      'A black hole is the most extreme curvature possible: a bottomless well from which the straight-line paths of even light all lead inward. Everything this simulation shows — bent starlight, the wrapped disk, slowed clocks — is spacetime curvature made visible.',
    ],
    deeper: [
      "The field equations relate geometry to matter: Gμν = 8πG/c⁴ · Tμν. The left side (the Einstein tensor) encodes curvature; the right side encodes the energy and momentum present. Light and free-falling matter travel along geodesics — locally straight lines in curved spacetime. This renderer integrates those geodesics directly for every pixel.",
    ],
    equations: [{ expr: 'Gμν = (8πG / c⁴) Tμν', caption: "Einstein's field equations — matter tells spacetime how to curve." }],
    facts: [
      { label: 'Author', value: 'Einstein, 1915' },
      { label: 'Gravity is', value: 'Curved geometry' },
    ],
    related: ['what-is', 'lensing', 'time-dilation'],
  },
  {
    id: 'escape-velocity',
    section: 'foundations',
    title: 'Escape velocity & the Schwarzschild radius',
    summary: 'Squeeze any mass below a critical radius and it becomes a black hole.',
    body: [
      'Escape velocity is the speed needed to leave an object forever. On Earth it is 11 km/s; on the Sun, 617 km/s. Keep compressing a mass and the escape velocity keeps rising. At a particular radius it equals the speed of light — and there the event horizon forms. That radius is the Schwarzschild radius.',
      'It scales simply with mass: about 3 km for every solar mass. The Sun would need to be crushed to a 3 km ball; Earth, to the size of a marble. In this explorer, the Schwarzschild radius (rₛ) is the natural unit of distance, and the vitals panel shows it in kilometres for each object.',
    ],
    deeper: [
      'Setting the Newtonian escape velocity to c gives the correct general-relativistic horizon radius for a non-rotating hole. Every length in the simulation is measured in units of rₛ, so the horizon sits at r = 1, the photon sphere at 1.5, and the apparent shadow near 2.6.',
    ],
    equations: [{ expr: 'r_s = 2GM / c²  ≈  2.95 km × (M / M☉)', caption: 'Schwarzschild radius.' }],
    facts: [
      { label: 'Per solar mass', value: '≈ 2.95 km' },
      { label: 'Sun as a BH', value: '~3 km across' },
    ],
    related: ['event-horizon', 'what-is'],
  },
  {
    id: 'singularity',
    section: 'foundations',
    title: 'The singularity',
    summary: 'At the centre, our physics predicts infinite density — a sign the theory is incomplete.',
    body: [
      "General relativity predicts that inside the horizon, matter collapses to a point (or, for a spinning hole, a ring) of zero size and infinite density: the singularity. Curvature becomes infinite and the equations stop giving sensible answers. It is hidden from us forever behind the horizon.",
      'Most physicists read an infinity like this not as a real place but as a signpost: it marks where general relativity breaks down and a deeper theory — a quantum theory of gravity — must take over. What actually happens at the centre is one of the great open questions in physics.',
    ],
    deeper: [
      'The Penrose–Hawking singularity theorems (1960s) show that singularities are a generic, unavoidable feature of gravitational collapse in general relativity, not an artefact of special symmetry. Cosmic censorship conjectures that such singularities are always cloaked by a horizon, keeping the breakdown of physics hidden from outside observers.',
    ],
    facts: [
      { label: 'Predicted density', value: 'Infinite' },
      { label: 'Really means', value: 'Theory breaks down' },
    ],
    related: ['event-horizon', 'information-paradox'],
  },

  // ---- Anatomy ----
  {
    id: 'event-horizon',
    section: 'anatomy',
    title: 'The event horizon',
    summary: 'The point of no return — a one-way surface in spacetime.',
    body: [
      'The event horizon is the defining feature of a black hole: the surface where escape velocity reaches the speed of light. Cross it and every possible path — including every beam of light you could emit — leads inward. No signal you send can ever reach the outside universe again.',
      'It is not a physical surface you would feel. For a supermassive hole you could drift across the horizon without noticing anything locally special. Yet from the outside it is an absolute boundary: the outside universe can never learn what happens beyond it.',
    ],
    deeper: [
      "The horizon is a null surface — light rays emitted exactly there hover forever, neither escaping nor falling in. To a distant observer, an infalling object appears to slow and freeze at the horizon, its light stretched to invisibility, because of extreme gravitational time dilation. The infaller, meanwhile, crosses in finite time by their own clock.",
    ],
    equations: [{ expr: 'r_horizon = r_s = 2GM / c²', caption: 'Horizon radius (non-rotating).' }],
    facts: [
      { label: 'Radius', value: '1 rₛ' },
      { label: 'Escape speed', value: 'c' },
    ],
    related: ['shadow', 'time-dilation', 'redshift'],
    demo: { annotate: true },
  },
  {
    id: 'shadow',
    section: 'anatomy',
    title: 'The shadow',
    summary: 'The dark silhouette is larger than the horizon — lensing magnifies it.',
    body: [
      "The black disc at the centre of the image is the shadow: the region of your sky from which no light can reach you. Counter-intuitively, it is bigger than the event horizon itself. The hole's gravity bends nearby light so strongly that rays which would have missed a same-size ordinary object are instead swallowed, enlarging the dark patch.",
      'For a non-rotating hole the shadow spans about 2.6 Schwarzschild radii — roughly two and a half times the horizon. It is exactly this silhouette that the Event Horizon Telescope photographed for M87* and Sagittarius A*.',
    ],
    deeper: [
      'The shadow radius is set by the critical impact parameter for photon capture, b_crit = 3√3 GM/c² ≈ 2.6 rₛ. Light aimed within b_crit spirals in; light aimed just outside loops around and escapes, piling up into the photon ring at the shadow edge.',
    ],
    equations: [{ expr: 'r_shadow = 3√3 · GM/c²  ≈  2.6 r_s', caption: 'Apparent shadow radius (Schwarzschild).' }],
    facts: [
      { label: 'Size', value: '≈ 2.6 rₛ' },
      { label: 'First imaged', value: 'M87*, 2019' },
    ],
    related: ['event-horizon', 'photon-sphere', 'eht'],
    demo: { annotate: true },
  },
  {
    id: 'photon-sphere',
    section: 'anatomy',
    title: 'The photon sphere & photon ring',
    summary: 'Where gravity is strong enough to bend light into orbit.',
    body: [
      'At 1.5 Schwarzschild radii lies the photon sphere — the radius where gravity curves spacetime just enough that light can circle the hole on unstable orbits. A photon here loops around one or more times before either falling in or escaping toward you.',
      'Those looping photons pile up into the photon ring: the thin, brilliant circle tracing the edge of the shadow. It is the black hole\'s sharpest feature and, in principle, a near-perfect fingerprint of its mass and spin.',
    ],
    deeper: [
      'The photon sphere sits at r = 3GM/c² = 1.5 rₛ. Because the orbit is unstable, light can wind around any number of times, producing an infinite series of ever-fainter, exponentially thinner ring images (n = 1, 2, 3 …) stacked at the shadow edge. The renderer reproduces these higher-order images naturally by integrating each ray until it escapes or is captured.',
    ],
    equations: [{ expr: 'r_ph = 3GM / c² = 1.5 r_s', caption: 'Photon-sphere radius.' }],
    facts: [
      { label: 'Radius', value: '1.5 rₛ' },
      { label: 'Orbit', value: 'Unstable, at c' },
    ],
    related: ['shadow', 'lensing'],
    demo: { objectId: 'gargantua', preset: 'photon-ring', annotate: true },
  },
  {
    id: 'accretion-disk',
    section: 'anatomy',
    title: 'The accretion disk',
    summary: 'In-falling gas heats and glows as it spirals inward.',
    body: [
      'Most black holes are not feeding from empty space — they draw in gas from a companion star or their galaxy. That gas cannot fall straight in; conservation of angular momentum forces it into a flattened, spinning disk. Friction and compression heat the disk until it glows, sometimes outshining an entire galaxy.',
      "The disk orbits differentially: the inner edge races around far faster than the outer, shearing the gas into bright filaments. Its colour reveals its temperature — Gargantua glows cool gold, while a stellar-mass hole like Cygnus X-1 blazes blue-white at millions of degrees.",
    ],
    deeper: [
      'A thin disk radiates roughly as a series of blackbody annuli, hottest at the inner edge. Peak temperature scales as T ∝ (Ṁ / M²)¹ᐟ⁴, so for a fixed accretion efficiency, smaller holes run far hotter — which is why stellar-mass binaries are X-ray sources while supermassive disks peak in the ultraviolet and optical. Orbital motion is Keplerian: ω ∝ r⁻³ᐟ².',
    ],
    equations: [{ expr: 'ω(r) ∝ r^(−3/2)', caption: 'Keplerian shear — inner gas orbits fastest.' }],
    facts: [
      { label: 'Shape', value: 'Thin, differential' },
      { label: 'Inner edge', value: 'The ISCO' },
    ],
    related: ['isco', 'doppler', 'obj-cygx1'],
    demo: { objectId: 'cygx1' },
  },
  {
    id: 'isco',
    section: 'anatomy',
    title: 'The ISCO',
    summary: 'The innermost stable circular orbit — the disk\'s inner edge.',
    body: [
      'Close to a black hole, circular orbits become unstable: nudge inward past a certain radius and you spiral in rather than orbit. That last stable orbit, the ISCO, sets the inner edge of an accretion disk. Inside it, gas plunges toward the horizon.',
      "The ISCO's radius depends on spin. For a non-rotating hole it sits at 3 Schwarzschild radii; for a near-maximally spinning hole like Gargantua, frame-dragging pulls it inward to barely half a Schwarzschild radius, letting the disk reach far closer and shine brighter.",
    ],
    deeper: [
      'For a Schwarzschild hole the ISCO is at r = 6GM/c² = 3 rₛ. For a prograde orbit around a maximally spinning Kerr hole it shrinks to GM/c² = 0.5 rₛ. The vitals panel computes the Kerr prograde ISCO from each object\'s spin. A smaller ISCO means a deeper gravitational well is tapped, raising the maximum radiative efficiency from ~6% (a = 0) toward ~42% (a → 1).',
    ],
    equations: [{ expr: 'r_ISCO = 6GM/c²  (a=0)  →  GM/c²  (a→1)', caption: 'ISCO shrinks with spin.' }],
    facts: [
      { label: 'Non-spinning', value: '3 rₛ' },
      { label: 'Maximal spin', value: '0.5 rₛ' },
    ],
    related: ['accretion-disk', 'ergosphere'],
  },
  {
    id: 'ergosphere',
    section: 'anatomy',
    title: 'The ergosphere & frame-dragging',
    summary: 'A spinning black hole drags spacetime itself around with it.',
    body: [
      'A rotating black hole does something remarkable: it drags the surrounding spacetime into rotation, an effect called frame-dragging. Close in, this dragging becomes so strong that nothing can stay still — every object, even light, is forced to orbit in the direction of spin. That region, outside the horizon, is the ergosphere.',
      "Inside the ergosphere you could still, in principle, escape — but you cannot stand still. It is also where energy can be extracted from the hole's rotation, a process that could in theory power a civilisation.",
    ],
    deeper: [
      'The ergosphere lies between the outer event horizon and the static limit, where the time-translation Killing vector becomes spacelike. Its equatorial radius reaches rₛ (the full Schwarzschild radius) while the horizon has contracted inward. Frame-dragging (the Lense–Thirring effect) is encoded in the off-diagonal gₜφ term of the Kerr metric.',
    ],
    facts: [
      { label: 'Requires', value: 'Spin (Kerr)' },
      { label: 'Effect', value: 'Frame-dragging' },
    ],
    related: ['penrose', 'isco', 'no-hair'],
  },
  {
    id: 'jets',
    section: 'anatomy',
    title: 'Relativistic jets',
    summary: 'Twin beams of plasma launched from the poles at near light speed.',
    body: [
      "Some black holes fire narrow jets of plasma from their poles, spanning thousands or even millions of light-years. Magnetic fields threading the inner disk and the spinning hole itself wind up, collimate, and hurl charged particles outward at more than 99% of the speed of light. The jets glow blue-white with synchrotron radiation.",
      "M87*'s jet is the textbook example — a beam some 5,000 light-years long, visible for over a century before we ever imaged the hole that launches it. Load M87* in the explorer to see twin jets streaming from its poles.",
    ],
    deeper: [
      'The leading model is the Blandford–Znajek mechanism (1977): magnetic field lines anchored in the ergosphere extract rotational energy from a spinning hole and drive a Poynting-flux-dominated outflow. Jets are one of the most efficient known engines, and their power correlates with black-hole spin.',
    ],
    facts: [
      { label: 'Speed', value: '>99% c' },
      { label: 'M87* jet', value: '~5,000 ly' },
    ],
    related: ['obj-m87', 'ergosphere', 'accretion-disk'],
    demo: { objectId: 'm87' },
  },

  // ---- Relativity in action ----
  {
    id: 'lensing',
    section: 'relativity',
    title: 'Gravitational lensing',
    summary: 'Strong gravity bends light, warping the view of everything behind.',
    body: [
      "Because a black hole curves spacetime, light passing nearby follows a curved path — the hole acts as a lens. Stars behind it are smeared into arcs, and the flat accretion disk is bent so severely that you see its far side lifted up and over the top of the shadow, and down beneath the bottom. The disk appears to wrap the black sphere completely.",
      "This is the signature 'eye' of Interstellar's Gargantua. It is not an artistic flourish or a texture — it is what real, fully traced light does around a black hole. This simulation integrates each photon's curved path directly, the same physics the film's team derived with Kip Thorne.",
    ],
    deeper: [
      'For a light ray with impact parameter b, the deflection angle far from the hole is α = 4GM/(c²b) — twice the Newtonian prediction, a result confirmed by Eddington\'s 1919 eclipse expedition. Near the photon sphere the deflection diverges, allowing light to loop multiple times and creating the nested ring images that outline the shadow.',
    ],
    equations: [{ expr: 'α = 4GM / (c² b)', caption: 'Light-deflection angle (weak field).' }],
    facts: [
      { label: 'Confirmed', value: 'Eddington, 1919' },
      { label: 'Method here', value: 'Full geodesics' },
    ],
    related: ['photon-sphere', 'dngr', 'spacetime'],
    demo: { objectId: 'gargantua', annotate: true },
  },
  {
    id: 'time-dilation',
    section: 'relativity',
    title: 'Gravitational time dilation',
    summary: 'Clocks run slower the deeper they sit in a gravity well.',
    body: [
      'Time is not universal. The deeper you are in a gravitational field, the slower your clock ticks relative to someone far away. Near a black hole the effect becomes enormous: minutes near the horizon can correspond to years at a safe distance. The navigation readout shows this factor live as you fly closer.',
      "In Interstellar, one hour on Miller's planet — deep in Gargantua's gravity well — cost the crew seven years back on their ship. That was not fiction bent for drama; it is a direct consequence of parking a world close to a fast-spinning supermassive black hole.",
    ],
    deeper: [
      'For a static observer at radius r outside a Schwarzschild hole, proper time relates to far-away coordinate time by dτ = dt·√(1 − rₛ/r). The factor diverges at the horizon, where a distant observer sees infalling clocks freeze. Gravitational time dilation is measurable even on Earth — GPS satellites correct for it daily.',
    ],
    equations: [{ expr: 't₀ = t_f · √(1 − r_s / r)', caption: 'Local time vs far-observer time.' }],
    facts: [
      { label: "Miller's planet", value: '1 hr ≈ 7 yr' },
      { label: 'At horizon', value: 'Clocks freeze' },
    ],
    related: ['millers-planet', 'redshift', 'event-horizon'],
    demo: { objectId: 'gargantua', preset: 'photon-ring' },
  },
  {
    id: 'spaghettification',
    section: 'relativity',
    title: 'Spaghettification',
    summary: 'Tidal forces stretch infalling objects into thin strands.',
    body: [
      "Gravity weakens with distance, so the pull on your feet (nearer the hole) exceeds the pull on your head. Close to a black hole this difference — the tidal force — becomes lethal, stretching you lengthwise and squeezing you sideways into a thin strand. Physicists call it, only half-jokingly, spaghettification.",
      'Crucially, the danger depends on the hole\'s size. Around a small stellar-mass hole like Cygnus X-1, tides would tear you apart long before you reached the horizon. Around a supermassive giant like Gargantua, the horizon is so vast that tides there are gentle — you could cross it intact. The telemetry\'s "tidal stretch" readout makes the contrast vivid.',
    ],
    deeper: [
      'The tidal acceleration across a body of length L at radius r is roughly Δa ≈ 2GML/r³. Because the horizon radius grows with M while the tidal term falls as 1/r³, the tidal force at the horizon scales as 1/M² — a millionfold-larger hole has a trillionfold-gentler horizon.',
    ],
    equations: [{ expr: 'Δa ≈ 2GML / r³  →  horizon tide ∝ 1/M²', caption: 'Tidal stretch across length L.' }],
    facts: [
      { label: 'Stellar-mass', value: 'Lethal far out' },
      { label: 'Supermassive', value: 'Gentle at horizon' },
    ],
    related: ['obj-cygx1', 'obj-gargantua'],
    demo: { objectId: 'cygx1' },
  },
  {
    id: 'doppler',
    section: 'relativity',
    title: 'Doppler beaming & aberration',
    summary: 'The side of the disk racing toward you looks brighter and bluer.',
    body: [
      'Gas in the inner disk orbits at a large fraction of the speed of light. The side sweeping toward you has its light boosted — brighter and shifted bluer — while the receding side is dimmed and reddened. This relativistic beaming makes a real disk strikingly lopsided.',
      "Interstellar deliberately turned this asymmetry off, rendering Gargantua nearly symmetric so audiences wouldn't be confused. This explorer lets you choose: Cinematic mode matches the film; Scientific mode restores the true Doppler beaming, so one edge of the disk blazes while the other fades.",
    ],
    deeper: [
      'The observed intensity scales with the Doppler factor D = 1/[γ(1 − β·n̂)] raised to the third or fourth power (depending on the spectrum), where β is the orbital speed and n̂ the line of sight. Relativistic aberration also warps the apparent geometry, concentrating light in the direction of motion.',
    ],
    equations: [{ expr: 'I_obs ∝ D³,  D = 1 / [γ(1 − β·n̂)]', caption: 'Relativistic beaming.' }],
    facts: [
      { label: 'Film', value: 'Suppressed it' },
      { label: 'Toggle', value: 'Scientific mode' },
    ],
    related: ['accretion-disk', 'redshift'],
    demo: { objectId: 'gargantua', mode: 'scientific' },
  },
  {
    id: 'redshift',
    section: 'relativity',
    title: 'Gravitational redshift',
    summary: 'Light climbing out of a gravity well loses energy and reddens.',
    body: [
      'Light escaping from near a black hole has to fight its way out of curved spacetime, and it pays an energy toll: its wavelength stretches, shifting toward the red. The closer to the horizon the light began, the more it reddens — until, right at the horizon, it stretches infinitely and fades from view entirely.',
      'This is why an object falling in appears, from outside, to redden and dim rather than simply vanish. Gravitational redshift is a cousin of time dilation — both come from the same warping of time near mass.',
    ],
    deeper: [
      'The redshift factor for light emitted at radius r and received far away is 1 + z = 1/√(1 − rₛ/r). It has been measured on Earth (the Pound–Rebka experiment, 1959) and in the orbit of the star S2 around Sagittarius A*.',
    ],
    equations: [{ expr: '1 + z = 1 / √(1 − r_s / r)', caption: 'Gravitational redshift.' }],
    facts: [
      { label: 'At horizon', value: 'z → ∞' },
      { label: 'Measured', value: 'Pound–Rebka, 1959' },
    ],
    related: ['time-dilation', 'event-horizon'],
  },

  // ---- Deep physics ----
  {
    id: 'hawking',
    section: 'deep-physics',
    title: 'Hawking radiation',
    summary: 'Quantum effects make black holes glow faintly — and slowly evaporate.',
    body: [
      "In 1974 Stephen Hawking showed that black holes are not perfectly black. Quantum effects at the horizon cause them to emit a faint thermal glow. Over unimaginable spans of time this radiation carries away mass, and the hole slowly evaporates — ending, perhaps, in a final burst.",
      'The effect is stronger for smaller holes. Yet every astrophysical black hole is colder than deep space: the vitals panel shows Hawking temperatures of billionths of a kelvin or less, far below the 2.7 K cosmic microwave background. Real black holes therefore absorb far more than they emit — they grow, not shrink.',
    ],
    deeper: [
      'The Hawking temperature is T_H = ℏc³/(8πGMk_B), inversely proportional to mass. A solar-mass hole is ~60 nanokelvin; a supermassive hole, far colder still. The evaporation time scales as M³, giving a stellar-mass hole a lifetime of ~10⁶⁷ years — vastly longer than the current age of the universe.',
    ],
    equations: [
      { expr: 'T_H = ℏc³ / (8π G M k_B)', caption: 'Hawking temperature (∝ 1/M).' },
      { expr: 't_evap ∝ M³', caption: 'Evaporation lifetime.' },
    ],
    facts: [
      { label: 'Discovered', value: 'Hawking, 1974' },
      { label: '1 M☉ hole', value: '~60 nK' },
    ],
    related: ['thermodynamics', 'information-paradox', 'primordial'],
  },
  {
    id: 'thermodynamics',
    section: 'deep-physics',
    title: 'Black hole thermodynamics & entropy',
    summary: 'A black hole has a temperature and a vast entropy — set by its surface area.',
    body: [
      "Black holes obey laws uncannily like thermodynamics. They have a temperature (Hawking's), and an entropy — a measure of hidden information — that is proportional not to their volume but to the area of their horizon. A black hole is the most entropy-dense object that can exist.",
      'This surprising area law hints at something profound: that the information content of any region of space may be encoded on its boundary. The idea, called the holographic principle, is one of the deepest clues we have toward a quantum theory of gravity.',
    ],
    deeper: [
      'The Bekenstein–Hawking entropy is S = k_B c³ A/(4Gℏ), where A is the horizon area — one quarter of the area in Planck units. Combined with Hawking\'s temperature it completes a full thermodynamic dictionary, with horizon area playing the role of entropy and surface gravity the role of temperature.',
    ],
    equations: [{ expr: 'S = k_B c³ A / (4 G ℏ)', caption: 'Bekenstein–Hawking entropy (∝ area).' }],
    facts: [
      { label: 'Entropy ∝', value: 'Horizon area' },
      { label: 'Hints at', value: 'Holography' },
    ],
    related: ['hawking', 'information-paradox'],
  },
  {
    id: 'information-paradox',
    section: 'deep-physics',
    title: 'The information paradox',
    summary: 'Does evaporation destroy information? Gravity and quantum theory disagree.',
    body: [
      'Quantum mechanics insists that information is never truly lost — the present always encodes the past. But if a black hole swallows an encyclopedia and later evaporates into featureless Hawking radiation, where did the information go? This clash between general relativity and quantum theory is the black-hole information paradox.',
      'It has driven decades of research and remains unresolved, though recent work on quantum entanglement and holography suggests information does subtly escape. Solving it is widely believed to require the long-sought quantum theory of gravity.',
    ],
    deeper: [
      "Hawking's original calculation gives exactly thermal (information-free) radiation, implying non-unitary evolution — anathema to quantum mechanics. Modern approaches (the Page curve, islands, ER=EPR) argue that subtle correlations restore unitarity, so information leaks out encoded in the radiation rather than vanishing.",
    ],
    facts: [
      { label: 'Conflict', value: 'GR vs QM' },
      { label: 'Status', value: 'Open problem' },
    ],
    related: ['hawking', 'thermodynamics', 'singularity'],
  },
  {
    id: 'penrose',
    section: 'deep-physics',
    title: 'The Penrose process',
    summary: 'Energy can be mined from a spinning black hole\'s rotation.',
    body: [
      'Roger Penrose showed in 1969 that a rotating black hole is not just a sink — you can extract energy from it. Drop an object into the ergosphere, split it so one piece falls in on a special trajectory, and the escaping piece can carry away more energy than you started with. The surplus comes from the hole\'s spin, which slows a little.',
      'It is one of the few ways the universe permits tapping a black hole for power, and it earned Penrose a share of the 2020 Nobel Prize (for his broader work proving black holes are a robust prediction of relativity).',
    ],
    deeper: [
      'Within the ergosphere, particles can have negative energy as measured at infinity. A fragment on such a trajectory reduces the hole\'s mass-energy and angular momentum when captured, so its partner escapes with a net gain. The theoretical efficiency reaches ~20.7% per event; magnetised versions (the Blandford–Znajek mechanism) power real jets.',
    ],
    facts: [
      { label: 'Proposed', value: 'Penrose, 1969' },
      { label: 'Requires', value: 'The ergosphere' },
    ],
    related: ['ergosphere', 'jets'],
  },
  {
    id: 'no-hair',
    section: 'deep-physics',
    title: 'The no-hair theorem',
    summary: 'Every black hole is described by just three numbers.',
    body: [
      'Whatever forms a black hole — a star, a cloud of antimatter, a library of books — the result is astonishingly simple. Once it settles, the hole is fully described by only three properties: its mass, its spin, and its electric charge. Every other detail is erased. This is whimsically called the no-hair theorem: black holes have "no hair," no distinguishing features.',
      'It means two black holes of the same mass, spin, and charge are perfectly identical, no matter how differently they formed. Astrophysical holes are effectively neutral, so in practice just two numbers — mass and spin — capture everything.',
    ],
    deeper: [
      'The uniqueness theorems (Israel, Carter, Robinson) establish that the Kerr–Newman family is the only stationary, asymptotically flat, electrovacuum black-hole solution. Tests of the theorem — measuring whether real holes\' multipole moments match Kerr exactly — are a key goal of gravitational-wave and Event Horizon Telescope observations.',
    ],
    facts: [
      { label: 'Parameters', value: 'Mass · spin · charge' },
      { label: 'In practice', value: 'Mass & spin' },
    ],
    related: ['ergosphere', 'gw-astronomy'],
  },

  // ---- Types & origins ----
  {
    id: 'stellar-mass',
    section: 'types',
    title: 'Stellar-mass black holes',
    summary: 'The collapsed cores of massive stars, a few to a few dozen suns.',
    body: [
      'When a star far more massive than the Sun exhausts its fuel, its core can collapse past the neutron-star stage into a black hole, typically between about 3 and a few tens of solar masses. Our galaxy is thought to hold a hundred million of them, most invisible and drifting alone.',
      'We find them when they have a companion to feed on, like Cygnus X-1, whose scorching disk lights up in X-rays. Load Cygnus X-1 in the explorer to see how compact and fierce a stellar-mass hole is compared with the galactic giants.',
    ],
    deeper: [
      'Stellar-mass holes form via core-collapse supernovae or direct collapse. There is an observed gap around 2–5 M☉ between the heaviest neutron stars and the lightest black holes, and a predicted "upper mass gap" (~50–130 M☉) from pair-instability supernovae — though gravitational-wave detections keep finding surprises near those edges.',
    ],
    facts: [
      { label: 'Mass range', value: '~3–100 M☉' },
      { label: 'Example', value: 'Cygnus X-1' },
    ],
    related: ['obj-cygx1', 'formation', 'xray-binaries'],
    demo: { objectId: 'cygx1' },
  },
  {
    id: 'intermediate',
    section: 'types',
    title: 'Intermediate-mass black holes',
    summary: 'The elusive middleweights — hundreds to thousands of suns.',
    body: [
      'Between stellar-mass holes and supermassive giants lies a sparsely populated middle ground: intermediate-mass black holes, from roughly a hundred to a hundred thousand solar masses. They are hard to find and long remained largely hypothetical — a missing link in the black-hole family.',
      'They matter because they may be the seeds from which supermassive black holes grew in the early universe. Candidates have turned up in dense star clusters and, tantalisingly, in a 2019 gravitational-wave merger that produced a ~150-solar-mass remnant.',
    ],
    deeper: [
      'Formation channels include runaway stellar collisions in dense clusters, hierarchical mergers of smaller holes, and the direct collapse of primordial gas clouds. The 2019 event GW190521 produced an ~142 M☉ remnant — the first fairly secure intermediate-mass detection.',
    ],
    facts: [
      { label: 'Mass range', value: '~10²–10⁵ M☉' },
      { label: 'Role', value: 'SMBH seeds?' },
    ],
    related: ['supermassive', 'mergers', 'primordial'],
  },
  {
    id: 'supermassive',
    section: 'types',
    title: 'Supermassive black holes',
    summary: 'Millions to billions of suns, anchoring the hearts of galaxies.',
    body: [
      'At the centre of nearly every large galaxy sits a supermassive black hole — from millions to tens of billions of solar masses. Our own Milky Way hosts Sagittarius A*, a comparatively modest 4.3 million suns; M87\'s reaches 6.5 billion. They co-evolve with their galaxies, and when actively feeding they blaze as quasars, the brightest steady beacons in the universe.',
      'How they grew so massive so early in cosmic history is a major open question. Load Sagittarius A* or M87* to compare a quiet galactic core with an active, jet-launching giant.',
    ],
    deeper: [
      'Supermassive holes correlate tightly with their host galaxy\'s properties (the M–σ relation), implying deep co-evolution. Seeds may be intermediate-mass holes, direct-collapse clouds, or the remnants of the first stars, grown by accretion and mergers over billions of years.',
    ],
    facts: [
      { label: 'Mass range', value: '10⁶–10¹⁰ M☉' },
      { label: 'Home', value: 'Galactic centres' },
    ],
    related: ['obj-sgra', 'obj-m87', 'obj-ton618'],
    demo: { objectId: 'm87' },
  },
  {
    id: 'primordial',
    section: 'types',
    title: 'Primordial black holes',
    summary: 'Hypothetical holes forged in the first instants after the Big Bang.',
    body: [
      'Not every black hole need come from a star. If the infant universe had dense-enough patches, they could have collapsed directly into black holes moments after the Big Bang — primordial black holes, potentially of almost any mass, including far smaller than any star could make.',
      'None have been confirmed, but they are an active hunting ground: light ones would be evaporating via Hawking radiation now, and a population of them could account for some or all of the mysterious dark matter.',
    ],
    deeper: [
      'Primordial holes could form from the collapse of large density perturbations when a Hubble-mass region re-entered the horizon. Observational limits (microlensing, Hawking-evaporation gamma rays, CMB distortions) constrain their abundance across a huge mass range, leaving a few windows open as dark-matter candidates.',
    ],
    facts: [
      { label: 'Origin', value: 'Early universe' },
      { label: 'Status', value: 'Unconfirmed' },
    ],
    related: ['hawking', 'formation'],
  },
  {
    id: 'formation',
    section: 'types',
    title: 'Formation & collapse',
    summary: 'How stars die and cores collapse into horizons.',
    body: [
      'A star lives by balancing gravity against the outward push of fusion. When a massive star runs out of fuel, that support fails and the core collapses catastrophically. If the core exceeds the mass a neutron star can bear (a few solar masses), nothing known can halt the collapse — an event horizon closes around it and a black hole is born, often heralded by a supernova.',
      'Beyond stellar death, black holes also grow by devouring gas and by merging with one another, building up over cosmic time from modest seeds to the giants at galactic centres.',
    ],
    deeper: [
      'The Tolman–Oppenheimer–Volkoff limit (~2.2–2.9 M☉) sets the maximum neutron-star mass. Above it, degeneracy pressure fails and collapse to a horizon is inevitable. Very massive stars may skip the supernova and collapse directly. Growth thereafter proceeds by accretion (capped near the Eddington limit) and mergers.',
    ],
    facts: [
      { label: 'Trigger', value: 'Core collapse' },
      { label: 'Threshold', value: '~3 M☉ core' },
    ],
    related: ['stellar-mass', 'mergers', 'singularity'],
  },
  {
    id: 'mergers',
    section: 'types',
    title: 'Mergers & gravitational waves',
    summary: 'When black holes collide, they ring spacetime like a bell.',
    body: [
      'Two black holes locked in orbit spiral inexorably together, radiating energy as ripples in spacetime — gravitational waves. In the final fraction of a second they merge and "ring down" into a single larger hole, releasing a burst of gravitational energy that briefly outshines every star in the observable universe combined.',
      'In 2015 the LIGO detectors caught exactly such a signal, GW150914 — the first direct detection of gravitational waves and the first proof that binary black holes exist and merge. It opened an entirely new way to observe the universe.',
    ],
    deeper: [
      'The waveform encodes the masses and spins through inspiral, merger, and ringdown. GW150914 merged holes of 36 and 29 M☉ into a 62 M☉ remnant, radiating ~3 M☉ as gravitational-wave energy in ~0.2 s at a peak luminosity of ~3.6×10⁴⁹ W. The ringdown\'s quasinormal modes test the no-hair theorem.',
    ],
    equations: [{ expr: 'E_GW ≈ 3 M☉ c²  (GW150914)', caption: 'Energy radiated as gravitational waves.' }],
    facts: [
      { label: 'First detection', value: 'GW150914, 2015' },
      { label: 'Radiated', value: '~3 M☉ as waves' },
    ],
    related: ['gw150914', 'gw-astronomy', 'intermediate'],
  },

  // ---- Real black holes ----
  {
    id: 'obj-gargantua',
    section: 'real',
    title: 'Gargantua',
    summary: "Interstellar's black hole — a scientifically designed supermassive giant.",
    body: [
      'Gargantua is the fictional black hole at the heart of Christopher Nolan\'s Interstellar (2014), and the flagship of this explorer. Designed in collaboration with physicist Kip Thorne, it is a near-maximally spinning supermassive hole of about 100 million solar masses, wrapped in a cool, gold accretion disk.',
      "Its extreme spin (a ≈ 0.999) is what makes the film's plot work: it allows a stable orbit close enough for the ferocious time dilation on Miller's planet, where one hour costs seven years. Gargantua is fiction built on real equations.",
    ],
    deeper: [
      'Thorne set Gargantua\'s spin to within a hair of maximal (1 − a ≈ 10⁻¹⁴) so that a habitable planet could orbit near the horizon with the required 61,000-to-1 time dilation. The disk was chosen to be relatively cool and quiescent — no jet — implying it had not swallowed a star in ages.',
    ],
    facts: [
      { label: 'Mass', value: '100M M☉' },
      { label: 'Spin', value: 'a ≈ 0.999' },
      { label: "Miller's planet", value: '1 hr ≈ 7 yr' },
    ],
    related: ['dngr', 'millers-planet', 'thorne'],
    demo: { objectId: 'gargantua' },
  },
  {
    id: 'obj-sgra',
    section: 'real',
    title: 'Sagittarius A*',
    summary: "The Milky Way's own supermassive black hole, 27,000 light-years away.",
    body: [
      'Sagittarius A* is the supermassive black hole at the centre of our galaxy — about 4.3 million solar masses, some 27,000 light-years from Earth. It is a quiet eater, its faint disk a whisper compared with active giants, which is partly why it took so long to image.',
      'We know its mass with remarkable precision by watching stars whip around it on decades-long orbits — work that won the 2020 Nobel Prize. In 2022 the Event Horizon Telescope released its portrait: a glowing ring around a dark shadow.',
    ],
    deeper: [
      'The star S2 orbits Sgr A* every ~16 years, reaching ~3% of light speed at closest approach; its orbit confirmed the mass and revealed relativistic effects (perihelion precession, gravitational redshift). The 2022 EHT image showed a shadow consistent with a 4.3-million-solar-mass Kerr hole.',
    ],
    facts: [
      { label: 'Mass', value: '4.3M M☉' },
      { label: 'Distance', value: '27,000 ly' },
      { label: 'Imaged', value: 'EHT, 2022' },
    ],
    related: ['stellar-orbits', 'eht', 'supermassive'],
    demo: { objectId: 'sgra' },
  },
  {
    id: 'obj-m87',
    section: 'real',
    title: 'M87*',
    summary: 'The first black hole ever imaged, a jet-launching giant in Virgo.',
    body: [
      "M87* anchors the giant elliptical galaxy M87, about 53 million light-years away, at a colossal 6.5 billion solar masses. On 10 April 2019 it became the first black hole humanity ever directly imaged — a fuzzy orange ring that instantly became iconic.",
      'It also drives one of the sky\'s most famous relativistic jets, a beam of plasma some 5,000 light-years long, known since 1918. Load M87* to see twin jets streaming from its poles above the lensed disk.',
    ],
    deeper: [
      'The 2019 Event Horizon Telescope image resolved M87*\'s shadow at ~42 microarcseconds, matching a Kerr hole of 6.5×10⁹ M☉. Polarised follow-up images (2021) mapped the magnetic fields that collimate its jet, supporting the Blandford–Znajek mechanism.',
    ],
    facts: [
      { label: 'Mass', value: '6.5B M☉' },
      { label: 'Distance', value: '53M ly' },
      { label: 'Jet', value: '~5,000 ly' },
    ],
    related: ['jets', 'eht', 'supermassive'],
    demo: { objectId: 'm87' },
  },
  {
    id: 'obj-cygx1',
    section: 'real',
    title: 'Cygnus X-1',
    summary: 'The first widely accepted black hole — a stellar-mass X-ray furnace.',
    body: [
      'Cygnus X-1 is a 21-solar-mass black hole in a tight orbit with a blue supergiant companion, about 7,200 light-years away. It strips gas from its partner into a scorching disk that shines brilliantly in X-rays — the glow that revealed it in 1964 and made it, by the 1970s, the first object widely accepted as a black hole.',
      'It was also the stake in a famous bet between Stephen Hawking and Kip Thorne over whether it truly harboured a black hole. Hawking conceded in 1990. Load it to feel the difference between a compact stellar furnace and the galactic giants.',
    ],
    deeper: [
      'Cygnus X-1 spins near-maximally (a > 0.95) and its inner disk reaches millions of kelvin, peaking in X-rays. Precise 2021 parallax and mass measurements revised it upward to 21 M☉, straining models of how such a heavy stellar-mass hole forms without losing mass to stellar winds.',
    ],
    facts: [
      { label: 'Mass', value: '21 M☉' },
      { label: 'Distance', value: '7,200 ly' },
      { label: 'Confirmed', value: '~1971' },
    ],
    related: ['stellar-mass', 'xray-binaries', 'spaghettification'],
    demo: { objectId: 'cygx1' },
  },
  {
    id: 'obj-ton618',
    section: 'real',
    title: 'TON 618',
    summary: 'One of the most massive black holes known — an ultramassive quasar.',
    body: [
      'TON 618 powers a hyperluminous quasar more than 10 billion light-years away, harbouring an ultramassive black hole of roughly 40 billion solar masses — among the largest ever weighed. Its event horizon alone would swallow our entire solar system many times over.',
      'We see it as it was in the early universe, its disk blazing as it feeds voraciously. It is a reminder of just how large gravity\'s sinkholes can grow.',
    ],
    deeper: [
      'TON 618\'s mass is estimated from the broad emission lines of its quasar (reverberation-mapping-calibrated relations), giving ~4×10¹⁰ M☉ — a Schwarzschild radius of order 10¹¹ km, roughly 800 AU. Such ultramassive holes challenge models of how black holes grew so large so early.',
    ],
    facts: [
      { label: 'Mass', value: '~40B M☉' },
      { label: 'Distance', value: '10.4B ly' },
      { label: 'Type', value: 'Quasar' },
    ],
    related: ['supermassive', 'accretion-disk'],
    demo: { objectId: 'ton618' },
  },
  {
    id: 'gw150914',
    section: 'real',
    title: 'GW150914',
    summary: 'The first black-hole merger ever heard, in gravitational waves.',
    body: [
      'On 14 September 2015, the twin LIGO detectors recorded a rising chirp lasting a fifth of a second: two black holes, 36 and 29 solar masses, spiralling together and merging 1.3 billion light-years away. It was the first direct detection of gravitational waves and the first observation of a binary-black-hole merger — a discovery worth the 2017 Nobel Prize.',
      'You cannot load GW150914 in the viewer — it is a fleeting event, not a standing object — but it proved that black holes collide, ring, and settle exactly as Einstein\'s equations predict.',
    ],
    deeper: [
      'The merger radiated about 3 solar masses of energy as gravitational waves in ~0.2 s, peaking near 3.6×10⁴⁹ W. The signal\'s inspiral, merger, and ringdown matched numerical-relativity templates for a 62 M☉ spinning remnant, providing the first strong-field, dynamical test of general relativity.',
    ],
    facts: [
      { label: 'Detected', value: '14 Sep 2015' },
      { label: 'Merged', value: '36 + 29 → 62 M☉' },
      { label: 'Distance', value: '1.3B ly' },
    ],
    related: ['mergers', 'gw-astronomy'],
  },

  // ---- The Interstellar science ----
  {
    id: 'dngr',
    section: 'interstellar',
    title: 'Rendering Gargantua (DNGR)',
    summary: 'The film built a physics engine to trace light around a black hole.',
    body: [
      "To render Gargantua, the visual-effects team at Double Negative wrote a renderer called DNGR that traced beams of light — not single rays — along the curved paths of Kip Thorne's equations. The result was so accurate it revealed features the physicists hadn't anticipated, and produced two peer-reviewed papers.",
      'This explorer works in the same spirit: it integrates each photon\'s geodesic through Schwarzschild spacetime in real time, on your GPU, to reproduce the lensed disk that wraps the shadow.',
    ],
    deeper: [
      "DNGR mapped light-beam bundles (not just rays) to model gravitational lensing without aliasing, at IMAX resolution — some frames took ~100 hours to render. The work appeared in Classical and Quantum Gravity (James et al., 2015) and American Journal of Physics, making Interstellar's black hole the most scientifically grounded ever filmed.",
    ],
    facts: [
      { label: 'Renderer', value: 'DNGR (DNEG)' },
      { label: 'Papers', value: '2 peer-reviewed' },
    ],
    related: ['lensing', 'thorne', 'obj-gargantua'],
    demo: { objectId: 'gargantua', annotate: true },
  },
  {
    id: 'millers-planet',
    section: 'interstellar',
    title: "Miller's planet",
    summary: 'A world so close to Gargantua that one hour costs seven years.',
    body: [
      "Miller's planet, the ocean world in Interstellar, orbits perilously close to Gargantua — deep enough in its gravity well that time nearly stops relative to the outside universe. One hour on its surface passes while seven years elapse for those waiting above. The crew\'s brief visit ages a crewmate by 23 years.",
      'This is real physics, not a plot convenience. Only because Gargantua spins almost maximally can a stable orbit exist that close, making the extreme dilation — a factor of about 61,000 — physically possible.',
    ],
    deeper: [
      'Thorne worked out that the required time-dilation factor (~61,000) needs an orbit just outside the ISCO of a hole spinning within ~10⁻¹⁴ of maximal. The planet\'s mountainous "waves" are tidal bulges raised by Gargantua, sweeping around as the world rocks in the hole\'s fierce tidal field.',
    ],
    facts: [
      { label: 'Dilation', value: '~61,000×' },
      { label: 'Needs', value: 'Near-maximal spin' },
    ],
    related: ['time-dilation', 'obj-gargantua', 'thorne'],
    demo: { objectId: 'gargantua', preset: 'photon-ring' },
  },
  {
    id: 'thorne',
    section: 'interstellar',
    title: 'Kip Thorne & the science',
    summary: 'A Nobel laureate guided the film to keep it true to physics.',
    body: [
      'Kip Thorne — theoretical physicist, gravitational-wave pioneer, and 2017 Nobel laureate — served as executive producer and science advisor for Interstellar. He insisted the film respect real physics: nothing would violate established laws, and speculation would be flagged as such.',
      'His equations shaped Gargantua\'s appearance, Miller\'s planet\'s orbit, and the wormhole\'s geometry. He distilled the collaboration into the book The Science of Interstellar, and the visual work produced genuine research.',
    ],
    deeper: [
      'Thorne co-founded LIGO, whose 2015 detection of merging black holes (GW150914) earned him a share of the 2017 Nobel Prize in Physics — the same class of object the film had dramatised a year earlier. His guidelines for the film became a model for science-grounded cinema.',
    ],
    facts: [
      { label: 'Role', value: 'Science advisor' },
      { label: 'Nobel', value: 'Physics, 2017' },
    ],
    related: ['dngr', 'obj-gargantua', 'gw-astronomy'],
  },

  // ---- Observing black holes ----
  {
    id: 'eht',
    section: 'observing',
    title: 'The Event Horizon Telescope',
    summary: 'An Earth-sized virtual telescope that photographs black-hole shadows.',
    body: [
      'To image something as small on the sky as a black-hole shadow, you need a telescope the size of the Earth. The Event Horizon Telescope achieves it by linking radio dishes across the globe, combining their signals so they act as one planet-wide instrument with extraordinary sharpness.',
      'It delivered the first-ever image of a black hole (M87*, 2019) and, three years later, our own Sagittarius A* — glowing rings of light around the dark shadows this explorer renders.',
    ],
    deeper: [
      'The EHT uses very-long-baseline interferometry (VLBI) at 1.3 mm wavelength, achieving ~20 microarcsecond resolution — enough to read a newspaper in another city. Atomic clocks time-stamp each dish\'s data; petabytes are later correlated to reconstruct the image.',
    ],
    facts: [
      { label: 'Technique', value: 'Global VLBI' },
      { label: 'Resolution', value: '~20 µas' },
    ],
    related: ['shadow', 'obj-m87', 'obj-sgra'],
  },
  {
    id: 'xray-binaries',
    section: 'observing',
    title: 'X-ray binaries',
    summary: 'A black hole feeding on a companion star lights up in X-rays.',
    body: [
      'The first black holes we found gave themselves away not by darkness but by brilliance. When a black hole orbits a normal star and pulls gas from it, that gas spirals into a disk and heats to millions of degrees, blazing in X-rays. Cygnus X-1 was the archetype.',
      'By measuring the companion star\'s orbit, astronomers weigh the unseen object; if it exceeds the maximum possible neutron-star mass yet emits no starlight, a black hole is the only explanation.',
    ],
    deeper: [
      'Mass functions derived from the companion\'s radial-velocity curve set a firm lower bound on the compact object\'s mass. Above ~3 M☉ with no detectable surface (no thermonuclear bursts, no pulsations), the object is classified as a black hole. Disk-continuum and iron-line fitting further estimate spin.',
    ],
    facts: [
      { label: 'Signature', value: 'X-ray glow' },
      { label: 'Classic', value: 'Cygnus X-1' },
    ],
    related: ['obj-cygx1', 'stellar-mass', 'accretion-disk'],
  },
  {
    id: 'stellar-orbits',
    section: 'observing',
    title: 'Watching stars orbit',
    summary: 'Tracking stars around Sgr A* revealed the mass — and won a Nobel.',
    body: [
      'For three decades, astronomers tracked individual stars looping around the centre of our galaxy. Their tight, fast orbits could only be explained by an enormous, invisible, compact mass — 4.3 million suns packed into a region smaller than our solar system. Nothing but a black hole fits.',
      'This painstaking work, led by Reinhard Genzel and Andrea Ghez, earned the 2020 Nobel Prize in Physics and gave us the most direct evidence yet for a supermassive black hole.',
    ],
    deeper: [
      'The star S2\'s ~16-year orbit, resolved with adaptive optics and interferometry (GRAVITY at the VLT), reaches ~7,650 km/s at pericentre. Its measured gravitational redshift and Schwarzschild precession match general relativity, pinning down Sgr A*\'s mass to a few percent.',
    ],
    facts: [
      { label: 'Nobel', value: 'Physics, 2020' },
      { label: 'Key star', value: 'S2 (~16 yr orbit)' },
    ],
    related: ['obj-sgra', 'supermassive'],
    demo: { objectId: 'sgra' },
  },
  {
    id: 'gw-astronomy',
    section: 'observing',
    title: 'Gravitational-wave astronomy',
    summary: 'Listening to spacetime itself, a sense beyond light.',
    body: [
      "Since 2015, observatories like LIGO and Virgo have opened a completely new window on the universe — not light, but gravitational waves: ripples in spacetime from the most violent events, chiefly merging black holes and neutron stars. We now 'hear' dozens of black-hole collisions a year that no telescope could ever see.",
      'Each detection weighs the merging holes, tests general relativity in its most extreme regime, and slowly reveals the hidden population of black holes woven through the cosmos.',
    ],
    deeper: [
      'Detectors are kilometre-scale laser interferometers sensitive to length changes of ~10⁻¹⁹ m — a thousandth of a proton\'s width. The measured strain h ~ ΔL/L encodes the source\'s masses, spins, and distance. A growing catalogue now numbers in the hundreds of compact-binary mergers.',
    ],
    facts: [
      { label: 'First heard', value: '2015' },
      { label: 'Detectors', value: 'LIGO · Virgo · KAGRA' },
    ],
    related: ['mergers', 'gw150914', 'thorne'],
  },
]

export function getArticle(id: string): CodexArticle | undefined {
  return CODEX_ARTICLES.find((a) => a.id === id)
}
