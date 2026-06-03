import { createConfiguredDeepSeekClient } from '../clients/deepseekClient.js'
import { query } from '../db/client.js'
import { ApiError } from '../http/apiResponse.js'
import { createAiInsightRepository } from '../repositories/aiInsightRepository.js'
import { getCircuitCalendar, getCircuitDetail, getCircuitHistory } from './circuitService.js'

const insightFields = [
  'summary',
  'trackFeature',
  'carSetup',
  'tyreAndBrakeLoad',
  'overtakingAndRacePace',
  'driverRequirement',
  'strategyRisk',
  'dataConfidence',
  'dataNotes',
]
const dataConfidenceValues = ['高', '中', '低']
const defaultInsightType = 'track_engineering_v1'

export function createAiInsightService({
  repository = createDefaultAiInsightRepository(),
  deepseekClient = createDefaultDeepSeekClient(),
  getCircuitDetail: getDetail = getCircuitDetail,
  getCircuitHistory: getHistory = getCircuitHistory,
  getCircuitCalendar: getCalendar = getCircuitCalendar,
} = {}) {
  return {
    async getInsight(circuitId) {
      const cached = await repository.getInsight(circuitId, defaultInsightType)

      if (cached) {
        return createInsightResult(circuitId, normalizeCachedAiInsight(cached.content), {
          cached: true,
          modelName: cached.modelName,
          generatedAt: cached.createdAt,
          source: 'ai_insights',
        })
      }

      const detail = await getDetail(circuitId)
      const preview = createFallbackAiInsight(detail.data)
      return createInsightResult(circuitId, preview, {
        cached: false,
        modelName: '静态预览',
        generatedAt: '等待生成',
        source: 'static-preview',
      })
    },

    async generateInsight(circuitId) {
      const cached = await repository.getInsight(circuitId, defaultInsightType)

      if (cached) {
        return createInsightResult(circuitId, normalizeCachedAiInsight(cached.content), {
          cached: true,
          modelName: cached.modelName,
          generatedAt: cached.createdAt,
          source: 'ai_insights',
        })
      }

      if (!deepseekClient) {
        throw new ApiError(503, 'DEEPSEEK_NOT_CONFIGURED', 'DeepSeek API key 未配置')
      }

      const [detail, history, calendar] = await Promise.all([getDetail(circuitId), getHistory(circuitId), getCalendar(circuitId)])
      const messages = buildAiInsightPrompt({
        circuit: detail.data,
        history: history.data,
        calendar: calendar.data,
      })
      const completion = await deepseekClient.createJsonCompletion(messages)
      const insight = parseAndValidateAiInsight(completion.content)
      const cachedRecord = await repository.upsertInsight({
        circuitId,
        insightType: defaultInsightType,
        content: insight,
        modelName: completion.modelName,
      })

      return createInsightResult(circuitId, insight, {
        cached: false,
        modelName: cachedRecord?.modelName ?? completion.modelName,
        generatedAt: cachedRecord?.createdAt ?? new Date().toISOString(),
        source: 'deepseek',
      })
    },
  }
}

function createDefaultAiInsightRepository() {
  if (process.env.NODE_ENV === 'test') {
    return {
      getInsight: async () => null,
      upsertInsight: async (record) => ({
        ...record,
        insightType: record.insightType ?? defaultInsightType,
        createdAt: new Date().toISOString(),
      }),
    }
  }

  return createAiInsightRepository(query)
}

function createDefaultDeepSeekClient() {
  if (process.env.NODE_ENV === 'test') {
    return null
  }

  return createConfiguredDeepSeekClient()
}

export function buildAiInsightPrompt({ circuit, history, calendar }) {
  return [
    {
      role: 'system',
      content:
        '你是 Formula 1 赛道工程分析助手。必须输出合法 JSON，不要输出 Markdown。输出语言必须为中文。不要编造输入数据中不存在的具体冠军、年份、纪录、赛历日期或天气结论。必须区分事实、历史数据和基于赛道属性的工程推断。如果历史数据为空，必须降低 dataConfidence。不要使用夸张营销语言。',
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          task: '生成中文 F1 赛道工程分析 json',
          outputSchema: {
            summary: '整体工程判断，80 字以内',
            trackFeature: '赛道结构特点，100 字以内',
            carSetup: '赛车调校重点，100 字以内',
            tyreAndBrakeLoad: '轮胎与刹车负荷，100 字以内',
            overtakingAndRacePace: '超车难度与比赛节奏，100 字以内',
            driverRequirement: '车手要求，100 字以内',
            strategyRisk: '进站、安全车、天气或赛道位置风险，100 字以内',
            dataConfidence: '只能输出 高 / 中 / 低',
            dataNotes: '说明哪些判断来自真实数据，哪些是基于赛道属性的推断',
          },
          circuit,
          history,
          calendar,
        },
        null,
        2,
      ),
    },
  ]
}

export function parseAndValidateAiInsight(content) {
  let parsed

  try {
    parsed = JSON.parse(content)
  } catch {
    throw new ApiError(502, 'DEEPSEEK_INVALID_JSON', 'DeepSeek 返回的 JSON 无法解析')
  }

  for (const field of insightFields) {
    if (typeof parsed[field] !== 'string' || parsed[field].trim().length === 0) {
      throw new ApiError(502, 'DEEPSEEK_INVALID_SCHEMA', `DeepSeek 返回缺少字段：${field}`)
    }
  }

  if (!dataConfidenceValues.includes(parsed.dataConfidence.trim())) {
    throw new ApiError(502, 'DEEPSEEK_INVALID_SCHEMA', 'DeepSeek 返回的 dataConfidence 必须是 高 / 中 / 低')
  }

  return Object.fromEntries(insightFields.map((field) => [field, parsed[field].trim()]))
}

function normalizeCachedAiInsight(insight = {}) {
  return Object.fromEntries(insightFields.map((field) => [field, normalizeCachedAiInsightField(insight, field)]))
}

function normalizeCachedAiInsightField(insight, field) {
  if (typeof insight[field] === 'string' && insight[field].trim()) {
    return insight[field].trim()
  }

  const legacyFallbacks = {
    tyreAndBrakeLoad: insight.carSetup,
    overtakingAndRacePace: insight.strategyImpact,
    strategyRisk: insight.strategyImpact,
    dataConfidence: '低',
    dataNotes: '该缓存来自旧版 AI 解读结构，缺少新版工程分析字段；请重新生成以获得完整数据说明。',
  }

  const fallback = legacyFallbacks[field]
  if (typeof fallback === 'string' && fallback.trim()) {
    return fallback.trim()
  }

  return '旧缓存缺少该工程分析字段，请重新生成。'
}

function createInsightResult(circuitId, insight, { cached, modelName, generatedAt, source }) {
  return {
    data: {
      circuitId,
      status: 'ready',
      cached,
      modelName,
      generatedAt,
      insight,
    },
    meta: {
      source,
    },
  }
}

function createFallbackAiInsight(circuit) {
  return {
    summary: `${circuit.displayName}是一条${circuit.trackTypeLabel}，当前先展示基于静态赛道资料的预览解读。`,
    trackFeature: circuit.overview,
    carSetup: '正式 AI 模块接入后，将结合赛道结构、历史结果和赛历信息生成更完整的调校分析。',
    tyreAndBrakeLoad: '轮胎与刹车负荷会结合弯角数量、制动区和历史退化表现进一步分析。',
    overtakingAndRacePace: '超车难度和比赛节奏会在历史结果与赛历信息接入后进一步细化。',
    driverRequirement: '车手要求会根据赛道类型、弯道数量和比赛环境补充。',
    strategyRisk: '策略风险将在历史数据、赛道位置和当前赛季赛历接入后进一步细化。',
    dataConfidence: '低',
    dataNotes: '当前为静态预览，主要来自赛道基础字段和本地种子数据，不代表 DeepSeek 生成结论。',
  }
}
