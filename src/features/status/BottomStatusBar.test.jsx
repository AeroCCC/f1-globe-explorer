import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BottomStatusBar } from './BottomStatusBar'

describe('BottomStatusBar', () => {
  it('communicates the actual data source and connection state in the desktop status bar', () => {
    const html = renderToStaticMarkup(
      <BottomStatusBar
        circuitCount={24}
        selectedCircuit={{ shortDisplayGrandPrixName: '新加坡站' }}
        dataSource="database"
        connectionStatus="ready"
        drawerOpen
        onSelectedClick={() => {}}
      />,
    )

    expect(html).toContain('数据库')
    expect(html).toContain('DeepSeek')
    expect(html).toContain('在线就绪')
    expect(html).toContain('已加载赛道：<strong>24</strong>')
  })

  it('shows a fallback state when the frontend is using static seed data', () => {
    const html = renderToStaticMarkup(
      <BottomStatusBar
        circuitCount={24}
        selectedCircuit={null}
        dataSource="static-seed"
        connectionStatus="fallback"
        drawerOpen={false}
        onSelectedClick={() => {}}
      />,
    )

    expect(html).toContain('静态种子')
    expect(html).toContain('本地兜底')
    expect(html).toContain('已加载赛道：<strong>24</strong>')
  })
})
