import { describe, expect, it, vi } from 'vitest'
import { createJolpicaClient } from './jolpicaClient'

function createFetchMock(payload = {}) {
  return vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => payload,
  }))
}

describe('F1 external API clients', () => {
  it('builds Jolpica schedule and winner-result URLs behind a server-side client', async () => {
    const fetchImpl = createFetchMock({ MRData: {} })
    const client = createJolpicaClient({ fetchImpl, baseUrl: 'https://example.test/f1' })

    await client.getRaceSchedule(2026)
    await client.getCircuitWinnerResults('marina_bay')

    expect(fetchImpl).toHaveBeenNthCalledWith(1, 'https://example.test/f1/2026.json')
    expect(fetchImpl).toHaveBeenNthCalledWith(
      2,
      'https://example.test/f1/circuits/marina_bay/results/1.json?limit=100&offset=0',
    )
  })

  it('raises explicit errors when an upstream client receives a non-2xx response', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: false,
      status: 503,
      json: async () => ({}),
    }))

    await expect(createJolpicaClient({ fetchImpl }).getRaceSchedule(2026)).rejects.toThrow(
      'Jolpica request failed: 503',
    )
  })
})
