import { describe, expect, it } from 'vitest'
import { circuitSeed } from '../circuits/circuitSeed'
import { initialCircuitsDataState, resolveCircuitsLoadError, resolveCircuitsLoadSuccess } from './useCircuitsResource'

describe('useCircuitsResource state helpers', () => {
  it('uses database circuit data and meta after a successful API load', () => {
    const result = resolveCircuitsLoadSuccess(circuitSeed, {
      data: [{ circuitId: 'monza' }],
      meta: { source: 'database' },
    })

    expect(result).toEqual({
      circuits: [{ circuitId: 'monza' }],
      dataState: {
        dataSource: 'database',
        connectionStatus: 'ready',
      },
    })
  })

  it('keeps the current seed list when the API returns an empty list', () => {
    const result = resolveCircuitsLoadSuccess(circuitSeed, {
      data: [],
      meta: { source: 'database' },
    })

    expect(result.circuits).toBe(circuitSeed)
    expect(result.dataState.connectionStatus).toBe('ready')
  })

  it('falls back to static seed state after a circuit API failure', () => {
    expect(initialCircuitsDataState).toEqual({
      dataSource: 'static-seed',
      connectionStatus: 'loading',
    })
    expect(resolveCircuitsLoadError()).toEqual({
      dataSource: 'static-seed',
      connectionStatus: 'fallback',
    })
  })
})
