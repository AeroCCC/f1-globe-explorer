import { describe, expect, it } from 'vitest'
import { createAiInsightRepository, mapAiInsightRowToDto } from './aiInsightRepository'

const insight = {
  summary: '总结',
  trackFeature: '特点',
  carSetup: '调校',
  tyreAndBrakeLoad: '轮胎刹车',
  overtakingAndRacePace: '超车节奏',
  driverRequirement: '车手',
  strategyRisk: '策略风险',
  dataConfidence: '高',
  dataNotes: '数据说明',
}

describe('AI insight repository', () => {
  it('maps ai_insights rows into stable DTOs', () => {
    expect(
      mapAiInsightRowToDto({
        circuit_id: 'marina_bay',
        insight_type: 'track_engineering_v1',
        content: JSON.stringify(insight),
        model_name: 'deepseek-v4-flash',
        created_at: new Date('2026-05-30T00:00:00.000Z'),
      }),
    ).toEqual({
      circuitId: 'marina_bay',
      insightType: 'track_engineering_v1',
      content: insight,
      modelName: 'deepseek-v4-flash',
      createdAt: '2026-05-30T00:00:00.000Z',
    })
  })

  it('reads and upserts cached insights with parameterized SQL', async () => {
    const calls = []
    const query = async (text, params = []) => {
      calls.push({ text, params })
      if (text.includes('SELECT')) {
        return []
      }
      return []
    }
    const repository = createAiInsightRepository(query)

    await repository.getInsight('marina_bay')
    await repository.upsertInsight({
      circuitId: 'marina_bay',
      insightType: 'track_engineering_v1',
      content: insight,
      modelName: 'deepseek-v4-flash',
    })

    expect(calls[0].text).toMatch(/FROM ai_insights/i)
    expect(calls[0].params).toEqual(['marina_bay', 'track_engineering_v1'])
    expect(calls[1].text).toMatch(/ON CONFLICT \(circuit_id, insight_type\) DO UPDATE/i)
    expect(calls[1].text).not.toContain('总结')
    expect(calls[1].params[2]).toBe(JSON.stringify(insight))
  })
})
