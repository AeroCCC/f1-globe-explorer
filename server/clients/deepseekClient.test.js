import { describe, expect, it, vi } from 'vitest'
import { createDeepSeekClient } from './deepseekClient'

describe('DeepSeek client', () => {
  it('calls chat completions with server-side auth and JSON output enabled', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: '{"summary":"中文总结"}' } }],
        model: 'deepseek-v4-flash',
        usage: { total_tokens: 128 },
      }),
    }))
    const client = createDeepSeekClient({
      apiKey: 'test-key',
      fetchImpl,
      baseUrl: 'https://deepseek.test',
      model: 'deepseek-v4-flash',
    })

    const result = await client.createJsonCompletion([
      { role: 'system', content: '只输出 json。' },
      { role: 'user', content: '生成赛道分析 json。' },
    ])

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://deepseek.test/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          Authorization: 'Bearer test-key',
          'Content-Type': 'application/json',
        }),
      }),
    )

    const requestBody = JSON.parse(fetchImpl.mock.calls[0][1].body)
    expect(requestBody).toMatchObject({
      model: 'deepseek-v4-flash',
      response_format: { type: 'json_object' },
      thinking: { type: 'disabled' },
      stream: false,
    })
    expect(result.content).toBe('{"summary":"中文总结"}')
    expect(result.modelName).toBe('deepseek-v4-flash')
  })

  it('throws a redacted upstream error when DeepSeek returns a non-2xx response', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 401,
      text: async () => 'invalid api key',
    }))
    const client = createDeepSeekClient({ apiKey: 'secret-key', fetchImpl })

    await expect(client.createJsonCompletion([{ role: 'user', content: 'json' }])).rejects.toThrow(
      'DeepSeek request failed: 401',
    )
  })
})
