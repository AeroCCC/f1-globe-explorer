import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const documentText = readFileSync(new URL('./F1_Globe_Explorer_SPA_Document.md', import.meta.url), 'utf8')

describe('SPA document product boundary', () => {
  it('keeps acceptance and implementation scope desktop web only', () => {
    expect(documentText).toContain('Web 桌面端')
    expect(documentText).not.toMatch(/移动端|390x844|bottom sheet|\bmobile\b/i)
  })
})
