import { describe, expect, it, vi } from 'vitest'
import { createJolpicaClient } from './jolpicaClient'
import { createOpenF1Client } from './openF1Client'

function createFetchMock(payload = {}) {
  return vi.fn(async () => ({
    ok: true,
    status: 200,
    json: async () => payload,
  }))
}

describe('F1 external API clients', () => {
  it('builds Jolpica schedule and result URLs behind a server-side client', async () => {
    const fetchImpl = createFetchMock({ MRData: {} })
    const client = createJolpicaClient({ fetchImpl, baseUrl: 'https://example.test/f1' })

    await client.getRaceSchedule(2026)
    await client.getCircuitResults(2026, 15)

    expect(fetchImpl).toHaveBeenNthCalledWith(1, 'https://example.test/f1/2026.json')
    expect(fetchImpl).toHaveBeenNthCalledWith(2, 'https://example.test/f1/2026/15/results.json')
  })

  it('builds OpenF1 URLs with encoded query parameters', async () => {
    const fetchImpl = createFetchMock([])
    const client = createOpenF1Client({ fetchImpl, baseUrl: 'https://example.test/openf1' })

    await client.getSessions({ year: 2026, country_name: 'Singapore' })
    await client.getWeather({ session_key: 123, meeting_key: null })

    expect(fetchImpl).toHaveBeenNthCalledWith(
      1,
      'https://example.test/openf1/sessions?year=2026&country_name=Singapore',
    )
    expect(fetchImpl).toHaveBeenNthCalledWith(2, 'https://example.test/openf1/weather?session_key=123')
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
    await expect(createOpenF1Client({ fetchImpl }).getSessions()).rejects.toThrow('OpenF1 request failed: 503')
  })
})
