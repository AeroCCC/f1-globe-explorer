import { describe, expect, it } from 'vitest'
import { circuitSeed } from '../circuits/circuitSeed'
import { attachCircuitResources, createStatusSnapshot, keepGlobalDataSourceAfterTabLoad } from './circuitResourceState'

const marinaBay = circuitSeed.find((circuit) => circuit.circuitId === 'marina_bay')

describe('circuit resource state', () => {
  it('attaches backend history, calendar, and AI resources to the selected circuit', () => {
    const circuit = attachCircuitResources(marinaBay, {
      marina_bay: {
        history: {
          status: 'ready',
          recentWinners: [['2025', 'George Russell', 'Mercedes']],
        },
        calendar: {
          status: 'ready',
          round: 16,
          raceName: 'Singapore Grand Prix',
        },
        aiInsight: {
          status: 'ready',
          modelName: 'deepseek-v4-flash',
          insight: { summary: '缓存总结' },
        },
      },
    })

    expect(circuit.history.recentWinners[0]).toEqual(['2025', 'George Russell', 'Mercedes'])
    expect(circuit.calendar.round).toBe(16)
    expect(circuit.aiInsight.modelName).toBe('deepseek-v4-flash')
  })

  it('creates status bar props from the latest frontend data source state', () => {
    expect(createStatusSnapshot({ dataSource: 'database', connectionStatus: 'ready' })).toEqual({
      dataSource: 'database',
      connectionStatus: 'ready',
    })
    expect(createStatusSnapshot({ dataSource: 'static-seed', connectionStatus: 'fallback' })).toEqual({
      dataSource: 'static-seed',
      connectionStatus: 'fallback',
    })
  })

  it('does not downgrade the global database source after a static calendar tab load', () => {
    expect(
      keepGlobalDataSourceAfterTabLoad(
        { dataSource: 'database', connectionStatus: 'ready' },
        { source: 'static-seed' },
      ),
    ).toEqual({
      dataSource: 'database',
      connectionStatus: 'ready',
    })
  })
})
