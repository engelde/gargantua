/**
 * Scalar math + relativistic physics for the telemetry deck.
 * Distances are in Schwarzschild radii (rs = 1); physical scale (km, temperature,
 * tidal force) is derived from the active black hole's mass in solar masses.
 */

export const RS = 1
export const PHOTON_SPHERE = 1.5 // rs
export const ISCO_SCHWARZSCHILD = 3.0 // rs, innermost stable circular orbit (a = 0)
export const SHADOW_RADIUS = 2.598 // rs, apparent shadow (critical impact parameter)

export const AU_KM = 1.495978707e8
export const LY_KM = 9.4607304726e12
export const RS_KM_PER_SOLAR = 2.9532 // Schwarzschild radius (km) per solar mass, 2GM/c²
export const HAWKING_T_SOLAR = 6.169e-8 // K, Hawking temperature of a 1 M☉ hole (∝ 1/M)
// Tidal stretch (g per metre of body length) at the horizon of a 1 M☉ hole; ∝ 1/M².
export const TIDAL_G_PER_M_1MSUN = 1.05e9

export const clamp = (x: number, lo: number, hi: number): number =>
  x < lo ? lo : x > hi ? hi : x

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

export const invLerp = (a: number, b: number, v: number): number =>
  a === b ? 0 : (v - a) / (b - a)

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp(invLerp(edge0, edge1, x), 0, 1)
  return t * t * (3 - 2 * t)
}

export const toRadians = (deg: number): number => (deg * Math.PI) / 180
export const toDegrees = (rad: number): number => (rad * 180) / Math.PI

// ---- Relativistic physics (mass-independent, in rs units) ----

/** Gravitational time dilation: far-observer seconds per local second, 1/√(1−rs/r). */
export function timeDilation(r: number): number {
  if (r <= RS) return Infinity
  return 1 / Math.sqrt(1 - RS / r)
}

/** Locally-measured circular-orbit speed at r, as a fraction of c (→ c at 1.5 rs). */
export function orbitalVelocityFraction(r: number): number {
  if (r <= RS) return 1
  return clamp(Math.sqrt(RS / 2 / (r - RS)), 0, 1)
}

/** Escape velocity at r as a fraction of c: √(rs/r). */
export function escapeVelocityFraction(r: number): number {
  return clamp(Math.sqrt(RS / r), 0, 1)
}

/** Prograde Kerr ISCO in units of rs. spin a ∈ [0,1). a=0 → 3 rs, a→1 → 0.5 rs. */
export function kerrIscoRs(spin: number): number {
  const a = clamp(Math.abs(spin), 0, 0.9999)
  const z1 = 1 + Math.cbrt(1 - a * a) * (Math.cbrt(1 + a) + Math.cbrt(1 - a))
  const z2 = Math.sqrt(3 * a * a + z1 * z1)
  const rGrav = 3 + z2 - Math.sqrt((3 - z1) * (3 + z1 + 2 * z2)) // in GM/c²
  return rGrav / 2 // GM/c² → rs (rs = 2GM/c²)
}

// ---- Mass-dependent physical scale ----

/** Schwarzschild radius in km for a given mass (solar masses). */
export function schwarzschildRadiusKm(massSolar: number): number {
  return RS_KM_PER_SOLAR * massSolar
}

/** Hawking temperature in kelvin (∝ 1/M). All astrophysical holes are far below the CMB. */
export function hawkingTemperatureK(massSolar: number): number {
  return HAWKING_T_SOLAR / massSolar
}

/** Tidal stretch in g per metre of body length at radius r (rs). ∝ 1/(M² r³). */
export function tidalGravityPerMeter(massSolar: number, r: number): number {
  const rr = Math.max(r, RS)
  return TIDAL_G_PER_M_1MSUN / (massSolar * massSolar * rr * rr * rr)
}

/** Human-scale verdict for the tidal stretch at r. */
export function tidalVerdict(massSolar: number, r: number): { label: string; lethal: boolean } {
  const g = tidalGravityPerMeter(massSolar, r)
  if (g > 1e3) return { label: 'Lethal', lethal: true }
  if (g > 1) return { label: 'Severe', lethal: true }
  if (g > 1e-3) return { label: 'Noticeable', lethal: false }
  return { label: 'Negligible', lethal: false }
}

// ---- Formatting for the mono readouts ----

const SUPERSCRIPT: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
}

/** Pretty scientific notation, e.g. 1.4e-14 → "1.4×10⁻¹⁴". */
export function toSciNotation(value: number, digits = 1): string {
  if (value === 0) return '0'
  if (!isFinite(value)) return '∞'
  const [mantissa, exp] = value.toExponential(digits).split('e')
  const sup = exp
    .split('')
    .map((c) => SUPERSCRIPT[c] ?? c)
    .join('')
  return `${mantissa}×10${sup}`
}

export function formatRs(r: number): string {
  if (!isFinite(r)) return '∞'
  if (r >= 100) return r.toFixed(0)
  if (r >= 10) return r.toFixed(1)
  return r.toFixed(2)
}

/** Mass in solar masses with K/M/B suffixes, e.g. 4.3M, 6.5B, 21. */
export function formatMassSolar(massSolar: number): string {
  if (massSolar >= 1e9) return `${(massSolar / 1e9).toFixed(massSolar >= 1e10 ? 0 : 1)}B M☉`
  if (massSolar >= 1e6) return `${(massSolar / 1e6).toFixed(massSolar >= 1e7 ? 0 : 1)}M M☉`
  if (massSolar >= 1e3) return `${(massSolar / 1e3).toFixed(0)}K M☉`
  return `${massSolar.toFixed(massSolar < 100 ? 1 : 0)} M☉`
}

/** Distance from a black-hole radius (rs) + its mass, auto-scaled km / AU / ly. */
export function formatDistance(r: number, massSolar: number): string {
  const km = r * schwarzschildRadiusKm(massSolar)
  const au = km / AU_KM
  if (au >= 1e4) return `${(km / LY_KM).toFixed(3)} ly`
  if (au >= 1) return `${au >= 100 ? au.toFixed(0) : au.toFixed(2)} AU`
  if (km >= 1e6) return `${toSciNotation(km)} km`
  return `${km >= 1000 ? (km / 1000).toFixed(0) + 'k' : km.toFixed(0)} km`
}

export function formatKm(km: number): string {
  if (km >= AU_KM) return `${(km / AU_KM).toFixed(2)} AU`
  if (km >= 1e6) return `${toSciNotation(km)} km`
  if (km >= 1000) return `${(km / 1000).toFixed(0)}k km`
  return `${km.toFixed(0)} km`
}

export function formatKelvin(k: number): string {
  if (k >= 1) return `${k.toFixed(1)} K`
  if (k >= 1e-3) return `${(k * 1e3).toFixed(1)} mK`
  if (k >= 1e-6) return `${(k * 1e6).toFixed(1)} µK`
  if (k >= 1e-9) return `${(k * 1e9).toFixed(1)} nK`
  return `${toSciNotation(k)} K`
}

export function formatDistanceLy(ly: number): string {
  if (ly >= 1e9) return `${(ly / 1e9).toFixed(1)} Bly`
  if (ly >= 1e6) return `${(ly / 1e6).toFixed(1)} Mly`
  if (ly >= 1e3) return `${(ly / 1e3).toFixed(0)},000 ly`
  return `${ly.toFixed(0)} ly`
}

export function formatDilation(factor: number): string {
  if (!isFinite(factor) || factor > 1e4) return '>10⁴×'
  if (factor >= 100) return `${factor.toFixed(0)}×`
  if (factor >= 10) return `${factor.toFixed(1)}×`
  return `${factor.toFixed(2)}×`
}

export function formatVelocityC(frac: number): string {
  return `${(frac * 100).toFixed(1)}% c`
}

export function formatFixed(value: number, digits = 2): string {
  return value.toFixed(digits)
}
