import { describe, expect, it } from 'vitest'
import { getMarkerVisualState } from './markerVisuals'

describe('marker visuals', () => {
  it('keeps selected markers visibly stronger than idle markers', () => {
    const selected = getMarkerVisualState({ selected: true, hovered: false, elapsed: 1.5 })
    const idle = getMarkerVisualState({ selected: false, hovered: false, elapsed: 1.5 })

    expect(selected.coreRadius).toBeGreaterThan(idle.coreRadius)
    expect(selected.haloOpacity).toBeGreaterThan(idle.haloOpacity)
    expect(selected.ringScale).toBeGreaterThan(1)
  })

  it('adds a smaller hover lift without matching the selected pulse', () => {
    const hovered = getMarkerVisualState({ selected: false, hovered: true, elapsed: 2 })
    const selected = getMarkerVisualState({ selected: true, hovered: true, elapsed: 2 })

    expect(hovered.coreRadius).toBeGreaterThan(0.032)
    expect(hovered.ringScale).toBeLessThan(selected.ringScale)
  })
})
