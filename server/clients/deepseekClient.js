import { loadLocalEnv } from '../db/env.js'

const DEEPSEEK_BASE_URL = 'https://api.deepseek.com'
const DEFAULT_DEEPSEEK_MODEL = 'deepseek-v4-flash'

export function createDeepSeekClient({
  apiKey = process.env.DEEPSEEK_API_KEY,
  fetchImpl = fetch,
  baseUrl = DEEPSEEK_BASE_URL,
  model = process.env.DEEPSEEK_MODEL || DEFAULT_DEEPSEEK_MODEL,
} = {}) {
  if (!apiKey) {
    return null
  }

  return {
    async createJsonCompletion(messages) {
      const response = await fetchImpl(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          response_format: { type: 'json_object' },
          thinking: { type: 'disabled' },
          stream: false,
          temperature: 0.3,
          max_tokens: 1200,
        }),
      })

      if (!response.ok) {
        throw new Error(`DeepSeek request failed: ${response.status}`)
      }

      const body = await response.json()

      return {
        content: body.choices?.[0]?.message?.content ?? '',
        modelName: body.model ?? model,
        usage: body.usage,
      }
    },
  }
}

export function createConfiguredDeepSeekClient(options = {}) {
  loadLocalEnv()
  return createDeepSeekClient(options)
}
