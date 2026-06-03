import { describe, expect, it } from 'vitest'
import { circuitSeed } from '../../src/features/circuits/circuitSeed'
import { listCircuits, getCircuitDetail, getCircuitHistory } from './circuitService'

describe('circuit service database integration boundary', () => {
  it('uses database results when a repository is available', async () => {
    const repository = {
      listCircuits: async () => [
        {
          ...circuitSeed[0],
          circuitId: 'db_circuit',
          displayName: '数据库赛道',
        },
      ],
    }

    const result = await listCircuits({ repository, useDatabase: true })

    expect(result.meta.source).toBe('database')
    expect(result.data).toHaveLength(1)
    expect(result.data[0]).toMatchObject({
      circuitId: 'db_circuit',
      chineseName: '数据库赛道',
    })
  })

  it('falls back to static seed data when database reads fail', async () => {
    const repository = {
      listCircuits: async () => {
        throw new Error('database unavailable')
      },
    }

    const result = await listCircuits({ repository, useDatabase: true })

    expect(result.meta.source).toBe('static-seed')
    expect(result.meta.fallbackReason).toBe('database unavailable')
    expect(result.meta).toMatchObject({
      season: 2026,
      count: circuitSeed.length,
    })
    expect(result.data).toHaveLength(circuitSeed.length)
  })

  it('uses database detail results before static seed data', async () => {
    const repository = {
      getCircuitById: async () => ({
        ...circuitSeed[0],
        circuitId: 'marina_bay',
        displayName: '数据库滨海湾',
      }),
    }

    const result = await getCircuitDetail('marina_bay', { repository, useDatabase: true })

    expect(result.meta.source).toBe('database')
    expect(result.data.chineseName).toBe('数据库滨海湾')
  })

  it('uses database history aggregation before static preview data', async () => {
    const historyRepository = {
      getCircuitHistory: async (circuitId) => ({
        circuitId,
        status: 'ready',
        recentWinners: [['2025', '马克斯·维斯塔潘', '红牛']],
        constructorWins: [{ name: '红牛', wins: 1 }],
        driverWins: [{ name: '马克斯·维斯塔潘', wins: 1 }],
        records: [['已导入分站', '1 场']],
      }),
    }

    const result = await getCircuitHistory('marina_bay', {
      historyRepository,
      useDatabase: true,
    })

    expect(result.meta.source).toBe('database')
    expect(result.data).toMatchObject({
      circuitId: 'marina_bay',
      status: 'ready',
      recentWinners: [['2025', '马克斯·维斯塔潘', '红牛']],
      driverWins: [{ name: '马克斯·维斯塔潘', wins: 1 }],
    })
  })

  it('keeps database empty history responses instead of showing stale integration copy', async () => {
    const historyRepository = {
      getCircuitHistory: async (circuitId) => ({
        circuitId,
        status: 'empty',
        recentWinners: [],
        constructorWins: [],
        driverWins: [],
        records: [],
        message: '该赛道暂未导入历史正赛冠军数据。',
      }),
    }

    const result = await getCircuitHistory('madring', {
      historyRepository,
      useDatabase: true,
    })

    expect(result.meta.source).toBe('database')
    expect(result.data).toMatchObject({
      circuitId: 'madring',
      status: 'empty',
      message: '该赛道暂未导入历史正赛冠军数据。',
    })
  })
})
