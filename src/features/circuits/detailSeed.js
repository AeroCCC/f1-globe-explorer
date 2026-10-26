import { CURRENT_SEASON } from './circuitSeed'

export const detailSeed = {
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
      tyreAndBrakeLoad: '低速重刹和高温环境会提高制动与冷却压力，轮胎管理直接影响长距离节奏。',
      overtakingAndRacePace: '超车机会有限，比赛节奏高度依赖赛道位置、安全车窗口和出弯牵引。',
      driverRequirement: '车手需要极强专注力、体能储备和贴墙精度，长距离比赛中失误成本很高。',
      strategyRisk: '安全车和进站窗口对比赛结果影响显著，过早或过晚进站都可能被赛道位置放大。',
      dataConfidence: '中',
      dataNotes: '历史冠军和安全车判断来自本地静态历史资料，调校判断基于赛道属性推断。',
    },
  },
}

export function createFallbackAiInsight(circuit) {
  return {
    modelName: '静态预览',
    generatedAt: '等待后端接入',
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
