import { describe, expect, it } from 'vitest'
import { createErrorBody, createSuccessBody, normalizeCircuitDto } from './circuitDto'

describe('circuit API DTO helpers', () => {
  it('normalizes missing circuit fields into a stable response shape', () => {
    const dto = normalizeCircuitDto({
      circuitId: 'test_circuit',
      name: 'Test Circuit',
      displayName: '测试赛道',
      grandPrixName: 'Test Grand Prix',
      displayGrandPrixName: '测试大奖赛',
      country: 'Testland',
      displayCountry: '测试国',
    })

    expect(dto).toMatchObject({
      circuitId: 'test_circuit',
      name: 'Test Circuit',
      chineseName: '测试赛道',
      displayName: '测试赛道',
      grandPrixName: 'Test Grand Prix',
      displayGrandPrixName: '测试大奖赛',
      country: 'Testland',
      displayCountry: '测试国',
      tags: [],
      characteristics: [],
      latitude: null,
      longitude: null,
      lengthKm: null,
      turns: null,
      firstGrandPrix: null,
      isCurrentSeason: false,
    })
  })

  it('wraps success and error payloads consistently', () => {
    expect(createSuccessBody({ circuitId: 'marina_bay' }, { source: 'static-seed' })).toEqual({
      ok: true,
      data: { circuitId: 'marina_bay' },
      meta: { source: 'static-seed' },
    })

    expect(createErrorBody('CIRCUIT_NOT_FOUND', '未找到赛道', { circuitId: 'missing' })).toEqual({
      ok: false,
      error: {
        code: 'CIRCUIT_NOT_FOUND',
        message: '未找到赛道',
        details: { circuitId: 'missing' },
      },
    })
  })
})
