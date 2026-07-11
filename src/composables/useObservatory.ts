import { inject, provide, type InjectionKey } from 'vue'
import { useSimulationParams } from './useSimulationParams'
import { useBlackHoleRenderer } from './useBlackHoleRenderer'
import { useCameraControls } from './useCameraControls'
import { useCameraDirector } from './useCameraDirector'
import { usePerformanceMonitor } from './usePerformanceMonitor'
import { useAmbientAudio } from './useAmbientAudio'
import { useObjects } from './useObjects'
import { useUiState } from './useUiState'

/**
 * The shared instrument context. Assembled once at the app root and handed to
 * every panel via provide/inject, so the HUD, control deck, presets, tour and
 * viewport all read and drive the same engine.
 */
export interface Observatory {
  params: ReturnType<typeof useSimulationParams>['params']
  applyMode: ReturnType<typeof useSimulationParams>['applyMode']
  resetParams: ReturnType<typeof useSimulationParams>['resetParams']
  renderer: ReturnType<typeof useBlackHoleRenderer>
  controls: ReturnType<typeof useCameraControls>
  director: ReturnType<typeof useCameraDirector>
  perf: ReturnType<typeof usePerformanceMonitor>
  audio: ReturnType<typeof useAmbientAudio>
  objects: ReturnType<typeof useObjects>
}

const KEY: InjectionKey<Observatory> = Symbol('gargantua-observatory')

export function createObservatory(): Observatory {
  const { params, applyMode, resetParams } = useSimulationParams()
  const renderer = useBlackHoleRenderer(params)
  const controls = useCameraControls(renderer.camera, params)
  const director = useCameraDirector(renderer.camera, controls, params)
  const perf = usePerformanceMonitor(params, renderer.fps)
  const audio = useAmbientAudio()
  const objects = useObjects(params)
  const ui = useUiState()

  // Let tour chapters switch the observed object, render mode, and anatomy overlay.
  director.configure({
    selectObject: (id) => objects.selectObject(id),
    applyMode,
    setAnnotate: (on) => {
      ui.anatomy = on
    },
  })

  return { params, applyMode, resetParams, renderer, controls, director, perf, audio, objects }
}

export function provideObservatory(): Observatory {
  const observatory = createObservatory()
  provide(KEY, observatory)
  return observatory
}

export function useObservatory(): Observatory {
  const observatory = inject(KEY)
  if (!observatory) throw new Error('Observatory context is not available')
  return observatory
}
