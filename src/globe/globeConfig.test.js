import { describe, expect, it } from 'vitest'
import {
  getCameraPositionForViewport,
  getGlobeScaleForViewport,
  globeConfig,
} from './globeConfig'

describe('globeConfig', () => {
  it('defines a globe-first camera and orbit interaction model', () => {
    expect(globeConfig.camera).toEqual({
      position: [0, 0.1, 6.05],
      fov: 42,
    })
    expect(globeConfig.initialRotation).toEqual([0.04, 2.85, 0])

    expect(globeConfig.controls).toMatchObject({
      enablePan: false,
      enableDamping: true,
      minDistance: 3.2,
      maxDistance: 8,
    })
  })

  it('uses local Earth texture assets for the globe surface', () => {
    expect(globeConfig.textures).toEqual({
      color: '/textures/earth-day.jpg',
      bump: '/textures/earth-bump.jpg',
      clouds: '/textures/earth-clouds.png',
    })
  })

  it('keeps the desktop camera framing for the web desktop product boundary', () => {
    expect(getCameraPositionForViewport(1440, 900)).toEqual([0, 0.1, 6.05])
    expect(getCameraPositionForViewport(800, 900)).toEqual([0, 0.1, 6.05])
  })

  it('keeps the desktop globe scale for the web desktop product boundary', () => {
    expect(getGlobeScaleForViewport(1440, 900)).toBe(1)
    expect(getGlobeScaleForViewport(800, 900)).toBe(1)
  })
})
