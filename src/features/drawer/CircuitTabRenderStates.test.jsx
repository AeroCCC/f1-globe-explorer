import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CircuitAiTab } from './CircuitAiTab'
import { CircuitHistoryTab } from './CircuitHistoryTab'
import { CircuitOverviewTab } from './CircuitOverviewTab'

describe('drawer tab render states', () => {
  it('renders history empty state without touching missing table data', () => {
    const html = renderToStaticMarkup(
      <CircuitHistoryTab model={{ status: 'empty', title: '暂无历史数据', message: '等待后端接入。' }} />,
    )

    expect(html).toContain('暂无历史数据')
    expect(html).toContain('等待后端接入。')
  })

  it('renders overview empty state without touching missing overview data', () => {
    const html = renderToStaticMarkup(
      <CircuitOverviewTab
        model={{ status: 'empty', title: '未选择赛道', message: '请先在地球上选择一个赛道。' }}
        onTabChange={() => {}}
      />,
    )

    expect(html).toContain('未选择赛道')
  })

  it('renders AI empty state without touching missing insight data', () => {
    const html = renderToStaticMarkup(
      <CircuitAiTab model={{ status: 'empty', title: '暂无 AI 解读', message: '等待后端接入。' }} />,
    )

    expect(html).toContain('暂无 AI 解读')
  })

  it('renders AI retry action for error states', () => {
    const html = renderToStaticMarkup(
      <CircuitAiTab
        model={{ status: 'error', title: '生成失败', message: 'DeepSeek API key 未配置' }}
        onGenerate={() => {}}
      />,
    )

    expect(html).toContain('生成失败')
    expect(html).toContain('重试生成')
  })

  it('renders AI generation action for ready states', () => {
    const html = renderToStaticMarkup(
      <CircuitAiTab
        model={{
          status: 'ready',
          modelName: '静态预览',
          generatedAt: '等待后端接入',
          insight: {
            summary: '总结',
            trackFeature: '特点',
            carSetup: '调校',
            driverRequirement: '车手',
            strategyImpact: '策略',
          },
        }}
        onGenerate={() => {}}
      />,
    )

    expect(html).toContain('生成 AI 分析')
  })
})
