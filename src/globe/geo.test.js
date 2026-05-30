import { describe, expect, it } from 'vitest'
import { Euler, Vector3 } from 'three'
import { getFocusedGlobeRotation, latLngToVector3 } from './geo'

function vectorLength([x, y, z]) {
  return Math.sqrt(x * x + y * y + z * z)
}

describe('latLngToVector3', () => {
  it('places every coordinate on the requested sphere radius', () => {
    expect(vectorLength(latLngToVector3(1.2914, 103.864, 2.05))).toBeCloseTo(2.05, 5)
    expect(vectorLength(latLngToVector3(51.5, -0.1, 3))).toBeCloseTo(3, 5)
  })

  it('maps the north pole to the positive y axis', () => {
    expect(latLngToVector3(90, 0, 2.05)).toEqual([0, 2.05, 0])
  })

  it('maps latitude zero and longitude zero onto the x axis convention used by the globe', () => {
    const [x, y, z] = latLngToVector3(0, 0, 2.05)

    expect(x).toBeCloseTo(2.05, 5)
    expect(y).toBeCloseTo(0, 5)
    expect(z).toBeCloseTo(0, 5)
  })
})

describe('getFocusedGlobeRotation', () => {
  it('rotates the selected coordinate toward the camera-facing side of the globe', () => {
    const point = new Vector3(...latLngToVector3(31.3389, 121.22, 2.05))
    const rotation = new Euler(...getFocusedGlobeRotation(31.3389, 121.22))

    point.applyEuler(rotation)

    expect(point.x).toBeCloseTo(0, 4)
    expect(point.y).toBeCloseTo(0, 4)
    expect(point.z).toBeGreaterThan(2.04)
  })

  it('keeps southern hemisphere circuits camera-facing without flipping the globe behind the camera', () => {
    const point = new Vector3(...latLngToVector3(-37.8497, 144.968, 2.05))
    const rotation = new Euler(...getFocusedGlobeRotation(-37.8497, 144.968))

    point.applyEuler(rotation)

    expect(point.x).toBeCloseTo(0, 4)
    expect(point.y).toBeCloseTo(0, 4)
    expect(point.z).toBeGreaterThan(2.04)
  })
})
