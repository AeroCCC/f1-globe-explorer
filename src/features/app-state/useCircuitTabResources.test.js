import { describe, expect, it } from 'vitest'
import {
  createCircuitResourceError,
  createCircuitResourceLoading,
  getCircuitTabResourceKey,
  mergeCircuitResource,
  shouldLoadCircuitTabResource,
} from './useCircuitTabResources'

describe('useCircuitTabResources state helpers', () => {
  it('maps drawer tabs to resource cache keys', () => {
    expect(getCircuitTabResourceKey('history')).toBe('history')
    expect(getCircuitTabResourceKey('calendar')).toBe('calendar')
    expect(getCircuitTabResourceKey('ai')).toBe('aiInsight')
    expect(getCircuitTabResourceKey('overview')).toBeNull()
  })

  it('does not reload ready, empty, or loading resources for the same circuit tab', () => {
    expect(
      shouldLoadCircuitTabResource(
        {
          marina_bay: {
            history: { status: 'ready' },
            calendar: { status: 'empty' },
            aiInsight: { status: 'loading' },
          },
        },
        'marina_bay',
        'history',
      ),
    ).toBe(false)
    expect(shouldLoadCircuitTabResource({ marina_bay: { history: { status: 'error' } } }, 'marina_bay', 'history')).toBe(
      true,
    )
  })

  it('merges tab resources without dropping other cached tabs', () => {
    expect(
      mergeCircuitResource(
        { marina_bay: { history: { status: 'ready' } } },
        'marina_bay',
        'calendar',
        { status: 'ready', round: 18 },
      ),
    ).toEqual({
      marina_bay: {
        history: { status: 'ready' },
        calendar: { status: 'ready', round: 18 },
      },
    })
  })

  it('creates stable loading and error models for drawer tabs', () => {
    expect(createCircuitResourceLoading('ai')).toMatchObject({
      status: 'loading',
      title: '正在加载',
      message: expect.stringContaining('AI 解读'),
    })
    expect(createCircuitResourceError(new Error('database unavailable'))).toEqual({
      status: 'error',
      title: '加载失败',
      message: 'database unavailable',
    })
  })
})
