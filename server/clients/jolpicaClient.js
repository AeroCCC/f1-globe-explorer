const JOLPICA_BASE_URL = 'https://api.jolpi.ca/ergast/f1'

export function createJolpicaClient({ fetchImpl = fetch, baseUrl = JOLPICA_BASE_URL } = {}) {
  return {
    async getRaceSchedule(season) {
      return fetchJson(fetchImpl, `${baseUrl}/${season}.json`)
    },
    async getCircuitResults(season, round) {
      return fetchJson(fetchImpl, `${baseUrl}/${season}/${round}/results.json`)
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
