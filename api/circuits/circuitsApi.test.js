import { describe, expect, it } from 'vitest'
import aiInsightHandler from './[circuitId]/ai-insight'
import calendarHandler from './[circuitId]/calendar'
import historyHandler from './[circuitId]/history'
import circuitDetailHandler from './[circuitId]'
import circuitsHandler from './index'

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    setHeader(name, value) {
      this.headers[name] = value
      return this
    },
    json(payload) {
      this.body = payload
      return this
    },
    end(payload) {
      this.body = payload
      return this
    },
  }
}

async function callHandler(handler, req) {
  const res = createResponse()
  await handler(req, res)
  return res
}

describe('circuits serverless API handlers', () => {
  it('returns the current circuit list from GET /api/circuits', async () => {
    const res = await callHandler(circuitsHandler, { method: 'GET', query: {} })

    expect(res.statusCode).toBe(200)
    expect(res.body.ok).toBe(true)
    expect(res.body.data).toHaveLength(22)
    expect(res.body.data[0]).toHaveProperty('chineseName')
    expect(res.body.meta).toMatchObject({ source: 'static-seed', count: 22 })
  })

  it('returns one circuit detail from GET /api/circuits/:circuitId', async () => {
    const res = await callHandler(circuitDetailHandler, {
      method: 'GET',
      query: { circuitId: 'marina_bay' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.data).toMatchObject({
      circuitId: 'marina_bay',
      chineseName: '滨海湾街道赛道',
      displayGrandPrixName: '新加坡大奖赛',
    })
  })

  it('returns a clear error body for an unknown circuit', async () => {
    const res = await callHandler(circuitDetailHandler, {
      method: 'GET',
      query: { circuitId: 'unknown_circuit' },
    })

    expect(res.statusCode).toBe(404)
    expect(res.body).toEqual({
      ok: false,
      error: {
        code: 'CIRCUIT_NOT_FOUND',
        message: '未找到赛道',
        details: { circuitId: 'unknown_circuit' },
      },
    })
  })

  it('returns history, calendar, and cached AI preview endpoints independently', async () => {
    const history = await callHandler(historyHandler, {
      method: 'GET',
      query: { circuitId: 'marina_bay' },
    })
    const calendar = await callHandler(calendarHandler, {
      method: 'GET',
      query: { circuitId: 'marina_bay', season: '2026' },
    })
    const aiInsight = await callHandler(aiInsightHandler, {
      method: 'GET',
      query: { circuitId: 'marina_bay' },
    })

    expect(history.statusCode).toBe(200)
    expect(history.body.data).toMatchObject({
      circuitId: 'marina_bay',
      status: 'ready',
      recentWinners: expect.arrayContaining([['2025', '乔治·拉塞尔', '梅赛德斯']]),
      driverWins: [],
    })

    expect(calendar.statusCode).toBe(200)
    expect(calendar.body.data).toMatchObject({
      circuitId: 'marina_bay',
      season: 2026,
      raceName: '新加坡大奖赛',
      raceStatus: '未开始',
    })

    expect(aiInsight.statusCode).toBe(200)
    expect(aiInsight.body.data).toMatchObject({
      circuitId: 'marina_bay',
      status: 'ready',
      cached: true,
      insight: {
        summary: expect.stringContaining('低速街道赛道'),
      },
    })
  })

  it('rejects unsupported methods with the same error envelope', async () => {
    const res = await callHandler(historyHandler, {
      method: 'POST',
      query: { circuitId: 'marina_bay' },
    })

    expect(res.statusCode).toBe(405)
    expect(res.headers.Allow).toBe('GET')
    expect(res.body).toMatchObject({
      ok: false,
      error: {
        code: 'METHOD_NOT_ALLOWED',
        message: '当前接口不支持该请求方法',
      },
    })
  })

  it('keeps AI generation explicit until the DeepSeek phase is implemented', async () => {
    const res = await callHandler(aiInsightHandler, {
      method: 'POST',
      query: { circuitId: 'marina_bay' },
    })

    expect(res.statusCode).toBe(501)
    expect(res.body).toMatchObject({
      ok: false,
      error: {
        code: 'AI_GENERATION_NOT_IMPLEMENTED',
        message: 'AI 生成将在 DeepSeek 阶段接入',
      },
    })
  })
})
