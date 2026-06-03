export async function loadCircuits({ fetchImpl = fetch } = {}) {
  return requestApi('/api/circuits', { fetchImpl })
}

export async function loadCircuitHistory(circuitId, { fetchImpl = fetch } = {}) {
  return requestApi(`/api/circuits/${encodeURIComponent(circuitId)}/history`, { fetchImpl })
}

export async function loadCircuitCalendar(circuitId, { season, fetchImpl = fetch } = {}) {
  const params = season ? `?season=${encodeURIComponent(season)}` : ''
  return requestApi(`/api/circuits/${encodeURIComponent(circuitId)}/calendar${params}`, { fetchImpl })
}

export async function getAiInsight(circuitId, { fetchImpl = fetch } = {}) {
  return requestApi(`/api/circuits/${encodeURIComponent(circuitId)}/ai-insight`, { fetchImpl })
}

export async function generateAiInsight(circuitId, { fetchImpl = fetch } = {}) {
  const result = await requestApi(`/api/circuits/${encodeURIComponent(circuitId)}/ai-insight`, {
    fetchImpl,
    method: 'POST',
  })

  return result.data
}

async function requestApi(path, { fetchImpl, method = 'GET' }) {
  const response = await fetchImpl(path, {
    method,
  })
  let body

  try {
    body = await response.json()
  } catch {
    throw new Error('AI API 服务不可用，请使用 Vercel Dev 或部署环境')
  }

  if (!response.ok || body.ok === false) {
    throw new Error(body.error?.message ?? 'AI 分析生成失败')
  }

  return {
    data: body.data,
    meta: body.meta ?? {},
  }
}
