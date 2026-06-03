import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const vercelConfig = JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))

describe('vercel deployment config', () => {
  it('declares the Vite build output and serverless API runtime', () => {
    expect(vercelConfig).toMatchObject({
      framework: 'vite',
      buildCommand: 'npm run build',
      outputDirectory: 'dist',
    })
    expect(vercelConfig.functions).toBeUndefined()
  })

  it('keeps secrets out of tracked deployment config', () => {
    const serialized = JSON.stringify(vercelConfig)

    expect(serialized).not.toMatch(/DATABASE_URL=/)
    expect(serialized).not.toMatch(/DEEPSEEK_API_KEY=/)
  })
})
