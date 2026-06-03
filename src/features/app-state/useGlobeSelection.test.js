import { describe, expect, it } from 'vitest'
import { getGlobeSelectionStateAfterAction } from './useGlobeSelection'

describe('useGlobeSelection state helpers', () => {
  it('focuses the selected marker even when the selected circuit id is unchanged', () => {
    expect(getGlobeSelectionStateAfterAction(null, { type: 'select-circuit', circuitId: 'marina_bay' })).toBe(
      'marina_bay',
    )
  })

  it('releases automatic focus when the user starts controlling the globe', () => {
    expect(getGlobeSelectionStateAfterAction('suzuka', { type: 'user-control-start' })).toBeNull()
  })
})
