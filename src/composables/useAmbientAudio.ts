import { ref } from 'vue'

/**
 * A synthesized deep-space drone — no copyrighted material, no audio files.
 * Low detuned oscillators + filtered noise bed + a slow LFO swell, mixed under
 * a master gain that ramps smoothly. Must be started from a user gesture.
 */
export function useAmbientAudio() {
  const enabled = ref(false)
  const volume = ref(0.4)
  const available = ref(typeof window !== 'undefined' && 'AudioContext' in window)

  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let built = false

  function build() {
    if (built || !ctx) return
    built = true
    master = ctx.createGain()
    master.gain.value = 0
    master.connect(ctx.destination)

    const now = ctx.currentTime

    // Low harmonic drone — root, fifth, octave, slightly detuned for beating.
    const voices = [43.65, 65.41, 87.31, 130.81]
    const detunes = [-4, 5, -6, 3]
    voices.forEach((freq, i) => {
      const osc = ctx!.createOscillator()
      osc.type = i < 2 ? 'sine' : 'triangle'
      osc.frequency.value = freq
      osc.detune.value = detunes[i]
      const g = ctx!.createGain()
      g.gain.value = i === 0 ? 0.5 : 0.22 / (i + 1)
      osc.connect(g).connect(master!)
      osc.start(now)
    })

    // Rumble bed: looping noise through a low-pass.
    const noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate)
    const data = noiseBuf.getChannelData(0)
    let last = 0
    for (let i = 0; i < data.length; i++) {
      // brown-ish noise (integrated white) for a deep, soft floor
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 3.2
    }
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuf
    noise.loop = true
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 220
    lp.Q.value = 0.7
    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.5
    noise.connect(lp).connect(noiseGain).connect(master)
    noise.start(now)

    // Slow LFO swelling the filter + master for a breathing feel.
    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.05
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 90
    lfo.connect(lfoGain).connect(lp.frequency)
    lfo.start(now)
  }

  function ensureContext() {
    if (!available.value) return
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new Ctor()
    }
    void ctx.resume()
    build()
  }

  function ramp(target: number) {
    if (!ctx || !master) return
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(target, now + 1.4)
  }

  function enable() {
    ensureContext()
    enabled.value = true
    ramp(volume.value)
  }

  function disable() {
    enabled.value = false
    ramp(0)
  }

  function toggle() {
    if (enabled.value) disable()
    else enable()
  }

  function setVolume(v: number) {
    volume.value = v
    if (enabled.value) ramp(v)
  }

  function dispose() {
    ramp(0)
    setTimeout(() => void ctx?.close(), 200)
  }

  return { enabled, volume, available, toggle, enable, disable, setVolume, dispose }
}
