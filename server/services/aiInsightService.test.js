import { describe, expect, it, vi } from 'vitest'
import { circuitSeed } from '../../src/features/circuits/circuitSeed'
import { ApiError } from '../http/apiResponse'
import {
  buildAiInsightPrompt,
  createAiInsightService,
  parseAndValidateAiInsight,
} from './aiInsightService'

const marinaBay = circuitSeed.find((circuit) => circuit.circuitId === 'marina_bay')

const validInsight = {
  summary: '滨海湾是一条低速街道赛道，比赛节奏受安全车和赛道位置影响明显。',
  trackFeature: '赛道弯道密集且贴墙行驶，低速牵引和重刹区域连续出现。',
  carSetup: '赛车需要机械抓地力、刹车稳定性和冷却效率之间取得平衡。',
  driverRequirement: '车手必须保持专注，控制贴墙距离，并在长距离比赛中管理体能。',
  strategyImpact: '进站窗口和安全车时机会显著改变排名，赛道位置价值很高。',
}

describe('AI insight service', () => {
  it('validates required Chinese insight fields from JSON content', () => {
    expect(parseAndValidateAiInsight(JSON.stringify(validInsight))).toEqual(validInsight)
    expect(() => parseAndValidateAiInsight('not json')).toThrow('DeepSeek 返回的 JSON 无法解析')
    expect(() => parseAndValidateAiInsight(JSON.stringify({ ...validInsight, summary: '' }))).toThrow(
      'DeepSeek 返回缺少字段：summary',
    )
  })

  it('builds a prompt that includes only known circuit, history, and calendar facts', () => {
    const messages = buildAiInsightPrompt({
      circuit: marinaBay,
      history: {
        recentWinners: [['2025', '乔治·拉塞尔', '梅赛德斯']],
        records: [['安全车出动', '近年概率高']],
      },
      calendar: {
        season: 2026,
        raceName: '新加坡大奖赛',
        raceDate: '2026-10-11',
      },
    })

    expect(messages[0].role).toBe('system')
    expect(messages[0].content).toContain('必须输出合法 JSON')
    expect(messages[0].content).toContain('不要编造')
    expect(messages[1].content).toContain('滨海湾街道赛道')
    expect(messages[1].content).toContain('乔治·拉塞尔')
    expect(messages[1].content).toContain('2026-10-11')
  })

  it('returns cached insight before calling DeepSeek', async () => {
    const repository = {
      getInsight: vi.fn(async () => ({
        circuitId: 'marina_bay',
        insightType: 'track_summary',
        content: validInsight,
        modelName: 'deepseek-v4-flash',
        createdAt: '2026-05-30T00:00:00.000Z',
      })),
      upsertInsight: vi.fn(),
    }
    const deepseekClient = { createJsonCompletion: vi.fn() }
    const service = createAiInsightService({
      repository,
      deepseekClient,
      getCircuitDetail: async () => ({ data: marinaBay }),
      getCircuitHistory: async () => ({ data: { recentWinners: [] } }),
      getCircuitCalendar: async () => ({ data: { season: 2026 } }),
    })

    const result = await service.generateInsight('marina_bay')

    expect(result.data.cached).toBe(true)
    expect(result.data.insight.summary).toContain('滨海湾')
    expect(deepseekClient.createJsonCompletion).not.toHaveBeenCalled()
  })

  it('generates, validates, and caches a new insight when cache is empty', async () => {
    const repository = {
      getInsight: vi.fn(async () => null),
      upsertInsight: vi.fn(async (record) => record),
    }
    const deepseekClient = {
      createJsonCompletion: vi.fn(async () => ({
        content: JSON.stringify(validInsight),
        modelName: 'deepseek-v4-flash',
      })),
    }
    const service = createAiInsightService({
      repository,
      deepseekClient,
      getCircuitDetail: async () => ({ data: marinaBay }),
      getCircuitHistory: async () => ({ data: { recentWinners: [] } }),
      getCircuitCalendar: async () => ({ data: { season: 2026 } }),
    })

    const result = await service.generateInsight('marina_bay')

    expect(result.data.cached).toBe(false)
    expect(repository.upsertInsight).toHaveBeenCalledWith(
      expect.objectContaining({
        circuitId: 'marina_bay',
        insightType: 'track_summary',
        content: validInsight,
        modelName: 'deepseek-v4-flash',
      }),
    )
  })

  it('returns a clear service error when DeepSeek is not configured', async () => {
    const service = createAiInsightService({
      repository: { getInsight: async () => null },
      deepseekClient: null,
      getCircuitDetail: async () => ({ data: marinaBay }),
      getCircuitHistory: async () => ({ data: {} }),
      getCircuitCalendar: async () => ({ data: {} }),
    })

    await expect(service.generateInsight('marina_bay')).rejects.toMatchObject(
      new ApiError(503, 'DEEPSEEK_NOT_CONFIGURED', 'DeepSeek API key 未配置'),
    )
  })
})
