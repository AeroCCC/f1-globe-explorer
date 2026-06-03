import { describe, expect, it } from 'vitest'
import config from './vite.config'

describe('vite production config', () => {
  it('splits heavy 3D dependencies into a stable vendor chunk', () => {
    const manualChunks = config.build.rollupOptions.output.manualChunks

    expect(manualChunks('E:/repo/node_modules/three/build/three.module.js')).toBe('three')
    expect(manualChunks('E:/repo/node_modules/@react-three/fiber/dist/index.js')).toBe('three')
    expect(manualChunks('E:/repo/node_modules/react/index.js')).toBe('react')
  })
})
