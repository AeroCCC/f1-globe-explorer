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

  it('moves the camera back on narrow screens so the globe stays framed', () => {
    expect(getCameraPositionForViewport(1440, 900)).toEqual([0, 0.1, 6.05])
    expect(getCameraPositionForViewport(390, 844)).toEqual([0, 0.05, 14.2])
  })

  it('scales the globe down on phone-sized portrait screens', () => {
    expect(getGlobeScaleForViewport(1440, 900)).toBe(1)
    expect(getGlobeScaleForViewport(390, 844)).toBe(0.58)
  })
})
