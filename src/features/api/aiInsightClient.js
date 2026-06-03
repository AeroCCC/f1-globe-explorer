export async function generateAiInsight(circuitId, { fetchImpl = fetch } = {}) {
  const response = await fetchImpl(`/api/circuits/${encodeURIComponent(circuitId)}/ai-insight`, {
    method: 'POST',
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

  return body.data
}
