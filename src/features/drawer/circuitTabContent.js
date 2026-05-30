import { CURRENT_SEASON } from '../circuits/circuitSeed'

export const drawerTabs = [
  { id: 'overview', label: '概览' },
  { id: 'history', label: '历史' },
  { id: 'calendar', label: '赛历' },
  { id: 'ai', label: 'AI 解读' },
]

const detailSeed = {
  marina_bay: {
    history: {
      recentWinners: [
        ['2025', '乔治·拉塞尔', '梅赛德斯'],
        ['2024', '兰多·诺里斯', '迈凯伦'],
        ['2023', '卡洛斯·塞恩斯', '法拉利'],
        ['2022', '塞尔吉奥·佩雷兹', '红牛'],
        ['2019', '塞巴斯蒂安·维特尔', '法拉利'],
      ],
      constructorWins: [
        { name: '法拉利', wins: 5 },
        { name: '梅赛德斯', wins: 4 },
        { name: '红牛', wins: 4 },
      ],
      records: [
        ['安全车出动', '近年概率高'],
        ['排位价值', '非常高'],
        ['比赛负荷', '全年最高梯队'],
      ],
    },
    calendar: {
      season: CURRENT_SEASON,
      round: 15,
      raceName: '新加坡大奖赛',
      dateRange: '2026-10-09 至 2026-10-11',
      raceDate: '2026-10-11',
      location: '新加坡，新加坡',
      raceStatus: '未开始',
    },
    aiInsight: {
      modelName: '静态预览',
      generatedAt: '等待后端接入',
      summary: '滨海湾是一条典型低速街道赛道，弯道密集、节奏压迫感强，赛车很难长时间散热。',
      trackFeature: '赛道以低速牵引、重刹和贴墙行驶为核心，单圈容错率低，交通和黄旗会放大排位重要性。',
      carSetup: '赛车调校更强调机械抓地力、刹车稳定性和冷却效率，同时不能完全牺牲直道尾速。',
      driverRequirement: '车手需要极强专注力、体能储备和贴墙精度，长距离比赛中失误成本很高。',
      strategyImpact: '安全车和进站窗口对比赛结果影响显著，过早或过晚进站都可能被赛道位置放大。',
    },
  },
}

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

    return {
      status: 'ready',
      title: 'AI 解读',
      modelName: aiInsight.modelName,
      generatedAt: aiInsight.generatedAt,
      insight: {
        summary: aiInsight.summary,
        trackFeature: aiInsight.trackFeature,
        carSetup: aiInsight.carSetup,
        driverRequirement: aiInsight.driverRequirement,
        strategyImpact: aiInsight.strategyImpact,
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

function createFallbackAiInsight(circuit) {
  return {
    modelName: '静态预览',
    generatedAt: '等待后端接入',
    summary: `${circuit.displayName}是一条${circuit.trackTypeLabel}，当前先展示基于静态赛道资料的预览解读。`,
    trackFeature: circuit.overview,
    carSetup: '正式 AI 模块接入后，将结合赛道结构、历史结果和赛历信息生成更完整的调校分析。',
    driverRequirement: '车手要求会根据赛道类型、弯道数量和比赛环境补充。',
    strategyImpact: '策略影响将在历史数据和当前赛季赛历接入后进一步细化。',
  }
}
