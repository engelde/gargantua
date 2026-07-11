/** Easing functions for camera tweens and UI motion. Input/output in [0,1]. */

export type Easing = (t: number) => number

export const linear: Easing = (t) => t

export const easeInOutCubic: Easing = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

export const easeOutCubic: Easing = (t) => 1 - Math.pow(1 - t, 3)

export const easeOutExpo: Easing = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t))

export const easeInOutQuart: Easing = (t) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

export const easeInOutSine: Easing = (t) => -(Math.cos(Math.PI * t) - 1) / 2

/** Critically-damped smoothing toward a target — frame-rate independent. */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return target + (current - target) * Math.exp(-lambda * dt)
}
