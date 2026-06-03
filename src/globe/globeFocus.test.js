import { describe, expect, it } from 'vitest'
import { getNextFocusedCircuitId } from './globeFocus'

describe('globe focus state', () => {
  it('focuses the selected circuit after marker selection', () => {
    expect(getNextFocusedCircuitId(null, { type: 'select-circuit', circuitId: 'suzuka' })).toBe('suzuka')
  })

  it('releases automatic focus when the user starts controlling the globe', () => {
    expect(getNextFocusedCircuitId('suzuka', { type: 'user-control-start' })).toBeNull()
  })

  it('keeps the previous focus for unknown actions', () => {
    expect(getNextFocusedCircuitId('monza', { type: 'unknown' })).toBe('monza')
  })
})
