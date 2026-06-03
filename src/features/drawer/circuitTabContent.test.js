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
        tyreAndBrakeLoad: expect.stringContaining('制动'),
        overtakingAndRacePace: expect.stringContaining('超车'),
        driverRequirement: expect.stringContaining('专注力'),
        strategyRisk: expect.stringContaining('安全车'),
        dataConfidence: '中',
        dataNotes: expect.stringContaining('历史冠军'),
      },
    })
  })

  it('returns cached AI insight data attached from the backend API', () => {
    expect(
      getCircuitTabModel(
        {
          ...marinaBay,
          aiInsight: {
            status: 'ready',
            modelName: 'deepseek-v4-flash',
            generatedAt: '2026-06-03T00:00:00.000Z',
            insight: {
              summary: '数据库缓存总结',
              trackFeature: '数据库缓存特点',
              carSetup: '数据库缓存调校',
              tyreAndBrakeLoad: '数据库缓存轮胎',
              overtakingAndRacePace: '数据库缓存超车',
              driverRequirement: '数据库缓存车手',
              strategyRisk: '数据库缓存策略',
              dataConfidence: '高',
              dataNotes: '数据库缓存说明',
            },
          },
        },
        'ai',
      ),
    ).toMatchObject({
      status: 'ready',
      modelName: 'deepseek-v4-flash',
      insight: {
        summary: '数据库缓存总结',
        tyreAndBrakeLoad: '数据库缓存轮胎',
        strategyRisk: '数据库缓存策略',
        dataConfidence: '高',
        dataNotes: '数据库缓存说明',
      },
    })
  })

  it('keeps legacy AI insight cache content renderable with fallback engineering fields', () => {
    expect(
      getCircuitTabModel(
        {
          ...marinaBay,
          aiInsight: {
            status: 'ready',
            modelName: 'deepseek-v4-flash',
            generatedAt: '2026-06-03T00:00:00.000Z',
            insight: {
              summary: '旧缓存总结',
              trackFeature: '旧缓存特点',
              carSetup: '旧缓存调校',
              driverRequirement: '旧缓存车手',
              strategyImpact: '旧缓存策略',
            },
          },
        },
        'ai',
      ),
    ).toMatchObject({
      status: 'ready',
      insight: {
        summary: '旧缓存总结',
        tyreAndBrakeLoad: '旧缓存调校',
        strategyRisk: '旧缓存策略',
        dataConfidence: '低',
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
