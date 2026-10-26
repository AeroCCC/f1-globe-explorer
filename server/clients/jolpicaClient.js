const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1'

export function createJolpicaClient({ fetchImpl = fetch, baseUrl = JOLPICA_BASE_URL } = {}) {
  return {
    async getRaceSchedule(season) {
      return fetchJson(fetchImpl, `${baseUrl}/${season}.json`)
    },
    async getCircuitWinnerResults(circuitId, { limit = 100, offset = 0 } = {}) {
      const params = new URLSearchParams({
        limit: String(limit),
        offset: String(offset),
      })
      return fetchJson(fetchImpl, `${baseUrl}/circuits/${circuitId}/results/1.json?${params}`)
    },
  }
}

async function fetchJson(fetchImpl, url) {
  const response = await fetchImpl(url)

  if (!response.ok) {
    throw new Error(`Jolpica request failed: ${response.status}`)
  }

  return response.json()
}
