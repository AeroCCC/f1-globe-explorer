import { CURRENT_SEASON } from '../circuits/circuitSeed'
import { createFallbackAiInsight, detailSeed } from '../circuits/detailSeed'

export const drawerTabs = [
  { id: 'overview', label: '概览' },
  { id: 'history', label: '历史' },
  { id: 'calendar', label: '赛历' },
  { id: 'ai', label: 'AI 解读' },
]

export function getCircuitTabModel(circuit, tabId) {
  if (!circuit) {
    return createEmptyModel('未选择赛道', '请先在地球上选择一个赛道。')
  }

  if (tabId === 'overview') {
    return {
      status: 'ready',
      title: '概览',
      overview: circuit.overview,
      characteristics: circuit.characteristics,
      actions: [
        { label: '查看历史', targetTab: 'history' },
        { label: '生成 AI 解读', targetTab: 'ai' },
      ],
    }
  }

  if (tabId === 'history') {
    const history = Object.hasOwn(circuit, 'history') ? circuit.history : detailSeed[circuit.circuitId]?.history

    if (!history) {
      return createEmptyModel('暂无历史数据', '该赛道的历史结果将在后端接口接入后展示。')
    }

    return {
      status: 'ready',
      title: '历史',
      ...history,
    }
  }

  if (tabId === 'calendar') {
    const calendar = circuit.calendar ?? detailSeed[circuit.circuitId]?.calendar ?? createFallbackCalendar(circuit)

    return {
      status: 'ready',
      title: '赛历',
      ...calendar,
    }
  }

  if (tabId === 'ai') {
    const aiInsight = circuit.aiInsight ?? detailSeed[circuit.circuitId]?.aiInsight ?? createFallbackAiInsight(circuit)
    const insight = aiInsight.insight ?? aiInsight

    return {
      status: aiInsight.status ?? 'ready',
      title: 'AI 解读',
      modelName: aiInsight.modelName,
      generatedAt: aiInsight.generatedAt,
      insight: {
        summary: insight.summary ?? '暂无工程摘要。',
        trackFeature: insight.trackFeature ?? '暂无赛道特点。',
        carSetup: insight.carSetup ?? '暂无调校重点。',
        tyreAndBrakeLoad: insight.tyreAndBrakeLoad ?? insight.carSetup ?? '暂无轮胎与刹车分析。',
        overtakingAndRacePace: insight.overtakingAndRacePace ?? insight.strategyImpact ?? '暂无超车与节奏分析。',
        driverRequirement: insight.driverRequirement ?? '暂无车手要求分析。',
        strategyRisk: insight.strategyRisk ?? insight.strategyImpact ?? '暂无策略风险分析。',
        dataConfidence: insight.dataConfidence ?? '低',
        dataNotes: insight.dataNotes ?? '该内容来自旧版 AI 解读或静态预览，缺少完整数据来源说明。',
      },
    }
  }

  return createEmptyModel('暂无内容', '该标签页暂未定义展示内容。')
}

function createEmptyModel(title, message) {
  return {
    status: 'empty',
    title,
    message,
  }
}

function createFallbackCalendar(circuit) {
  return {
    season: CURRENT_SEASON,
    round: '待公布',
    raceName: circuit.displayGrandPrixName,
    dateRange: '待公布',
    raceDate: '待公布',
    location: `${circuit.displayCountry}，${circuit.city}`,
    raceStatus: '待确认',
  }
}
