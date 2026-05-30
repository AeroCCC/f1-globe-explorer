import { describe, expect, it } from 'vitest'
import { circuitSeed } from '../circuits/circuitSeed'
import { getCircuitTabModel } from './circuitTabContent'

const marinaBay = circuitSeed.find((circuit) => circuit.circuitId === 'marina_bay')

describe('getCircuitTabModel', () => {
  it('returns a complete overview model for the selected circuit', () => {
    expect(getCircuitTabModel(marinaBay, 'overview')).toMatchObject({
      status: 'ready',
      title: '概览',
      overview: expect.stringContaining('夜间街道赛道'),
      characteristics: expect.arrayContaining([['安全车概率', '高']]),
      actions: [
        { label: '查看历史', targetTab: 'history' },
        { label: '生成 AI 解读', targetTab: 'ai' },
      ],
    })
  })

  it('returns history data without relying on a future API', () => {
    const model = getCircuitTabModel(marinaBay, 'history')

    expect(model.status).toBe('ready')
    expect(model.recentWinners).toHaveLength(5)
    expect(model.constructorWins[0]).toMatchObject({ name: '法拉利', wins: 5 })
    expect(model.records).toContainEqual(['安全车出动', '近年概率高'])
  })

  it('returns current season calendar data', () => {
    expect(getCircuitTabModel(marinaBay, 'calendar')).toMatchObject({
      status: 'ready',
      season: 2026,
      round: 15,
      raceName: '新加坡大奖赛',
      dateRange: '2026-10-09 至 2026-10-11',
      location: '新加坡，新加坡',
      raceStatus: '未开始',
    })
  })

  it('returns Chinese AI insight content', () => {
    expect(getCircuitTabModel(marinaBay, 'ai')).toMatchObject({
      status: 'ready',
      modelName: '静态预览',
      insight: {
        summary: expect.stringContaining('低速街道赛道'),
        carSetup: expect.stringContaining('机械抓地力'),
        driverRequirement: expect.stringContaining('专注力'),
        strategyImpact: expect.stringContaining('安全车'),
      },
    })
  })

  it('returns an empty state for unsupported or missing tab data', () => {
    expect(getCircuitTabModel({ ...marinaBay, history: null }, 'history')).toMatchObject({
      status: 'empty',
      title: '暂无历史数据',
    })
    expect(getCircuitTabModel(marinaBay, 'unknown')).toMatchObject({
      status: 'empty',
      title: '暂无内容',
    })
  })
})
