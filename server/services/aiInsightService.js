import { createConfiguredDeepSeekClient } from '../clients/deepseekClient.js'
import { query } from '../db/client.js'
import { ApiError } from '../http/apiResponse.js'
import { createAiInsightRepository } from '../repositories/aiInsightRepository.js'
import { getCircuitCalendar, getCircuitDetail, getCircuitHistory } from './circuitService.js'

const insightFields = ['summary', 'trackFeature', 'carSetup', 'driverRequirement', 'strategyImpact']
const defaultInsightType = 'track_summary'

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
        return createInsightResult(circuitId, cached.content, {
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
        return createInsightResult(circuitId, cached.content, {
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
        '你是 Formula 1 赛道数据分析助手。必须输出合法 JSON，不要输出 Markdown。不要编造输入数据中不存在的具体冠军、年份、纪录或赛历日期。只能基于用户提供的数据做中文分析。',
    },
    {
      role: 'user',
      content: JSON.stringify(
        {
          task: '生成中文 F1 赛道 AI 解读 json',
          outputSchema: {
            summary: '整体总结，80 字以内',
            trackFeature: '赛道特点，100 字以内',
            carSetup: '赛车调校重点，100 字以内',
            driverRequirement: '车手要求，100 字以内',
            strategyImpact: '策略影响，100 字以内',
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

  return Object.fromEntries(insightFields.map((field) => [field, parsed[field].trim()]))
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
    driverRequirement: '车手要求会根据赛道类型、弯道数量和比赛环境补充。',
    strategyImpact: '策略影响将在历史数据和当前赛季赛历接入后进一步细化。',
  }
}
