import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BottomStatusBar } from './BottomStatusBar'

describe('BottomStatusBar', () => {
  it('communicates the production data pipeline in the desktop status bar', () => {
    const html = renderToStaticMarkup(
      <BottomStatusBar
        circuitCount={22}
        selectedCircuit={{ shortDisplayGrandPrixName: '新加坡站' }}
        drawerOpen
        onSelectedClick={() => {}}
      />,
    )

    expect(html).toContain('Postgres')
    expect(html).toContain('DeepSeek')
    expect(html).toContain('在线就绪')
  })
})
