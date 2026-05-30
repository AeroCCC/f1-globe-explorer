const OPENF1_BASE_URL = 'https://api.openf1.org/v1'

export function createOpenF1Client({ fetchImpl = fetch, baseUrl = OPENF1_BASE_URL } = {}) {
  return {
    async getSessions(params = {}) {
      return fetchJson(fetchImpl, `${baseUrl}/sessions${toQueryString(params)}`)
    },
    async getWeather(params = {}) {
      return fetchJson(fetchImpl, `${baseUrl}/weather${toQueryString(params)}`)
    },
  }
}

async function fetchJson(fetchImpl, url) {
  const response = await fetchImpl(url)

  if (!response.ok) {
    throw new Error(`OpenF1 request failed: ${response.status}`)
  }

  return response.json()
}

function toQueryString(params) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}
