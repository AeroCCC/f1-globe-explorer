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
})
