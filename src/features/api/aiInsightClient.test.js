import { describe, expect, it, vi } from 'vitest'
import { generateAiInsight } from './aiInsightClient'

describe('AI insight browser client', () => {
  it('posts to the selected circuit AI endpoint and returns data', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        ok: true,
        data: {
          circuitId: 'marina_bay',
          status: 'ready',
          insight: { summary: '生成完成' },
        },
      }),
    }))

    const result = await generateAiInsight('marina_bay', { fetchImpl })

    expect(fetchImpl).toHaveBeenCalledWith('/api/circuits/marina_bay/ai-insight', { method: 'POST' })
    expect(result.insight.summary).toBe('生成完成')
  })

  it('throws the server error message when generation fails', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      json: async () => ({
        ok: false,
        error: { message: 'DeepSeek API key 未配置' },
      }),
    }))

    await expect(generateAiInsight('marina_bay', { fetchImpl })).rejects.toThrow('DeepSeek API key 未配置')
  })

  it('throws a clear message when the API route is unavailable in plain Vite dev', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      json: async () => {
        throw new SyntaxError('Unexpected token <')
      },
    }))

    await expect(generateAiInsight('marina_bay', { fetchImpl })).rejects.toThrow(
      'AI API 服务不可用，请使用 Vercel Dev 或部署环境',
    )
  })
})
