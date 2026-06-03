import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const guide = readFileSync(new URL('./DEMO_GUIDE.md', import.meta.url), 'utf8')

describe('demo guide', () => {
  it('documents a desktop-only portfolio recording flow', () => {
    expect(guide).toContain('1440x900')
    expect(guide).toContain('Web 桌面端')
    expect(guide).toContain('AI 解读')
    expect(guide).not.toContain('390x844')
  })
})
