import { describe, expect, it } from 'vitest'
import { circuitSeed } from '../circuits/circuitSeed'
import { getSelectedCircuit, getSelectionStateAfterCircuitSelect } from './useSelectedCircuit'

describe('useSelectedCircuit state helpers', () => {
  it('derives the selected circuit from the current circuit list', () => {
    expect(getSelectedCircuit(circuitSeed, 'marina_bay')).toMatchObject({
      circuitId: 'marina_bay',
      displayName: '滨海湾街道赛道',
    })
  })

  it('returns null when the selected circuit is not in the current list', () => {
    expect(getSelectedCircuit(circuitSeed, 'missing')).toBeNull()
  })

  it('resets the drawer to overview when a new circuit is selected', () => {
    expect(getSelectionStateAfterCircuitSelect('suzuka')).toEqual({
      selectedCircuitId: 'suzuka',
      drawerOpen: true,
      activeDrawerTab: 'overview',
    })
  })
})
