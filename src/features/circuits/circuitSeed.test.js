import { describe, expect, it } from 'vitest'
import { circuitSeed, CURRENT_SEASON } from './circuitSeed'

const requiredFields = [
  'circuitId',
  'name',
  'grandPrixName',
  'shortGrandPrixName',
  'country',
  'city',
  'region',
  'latitude',
  'longitude',
  'trackType',
  'lengthKm',
  'turns',
  'firstGrandPrix',
  'isCurrentSeason',
  'tags',
  'overview',
  'characteristics',
]

describe('circuitSeed', () => {
  it('contains the current official 2026 race circuits used by the globe', () => {
    expect(CURRENT_SEASON).toBe(2026)
    expect(circuitSeed).toHaveLength(22)
  })

  it('defines complete and unique circuit records for marker rendering', () => {
    const ids = new Set()

    for (const circuit of circuitSeed) {
      for (const field of requiredFields) {
        expect(circuit, `${circuit.circuitId} missing ${field}`).toHaveProperty(field)
      }

      expect(ids.has(circuit.circuitId)).toBe(false)
      ids.add(circuit.circuitId)
      expect(circuit.latitude).toBeGreaterThanOrEqual(-90)
      expect(circuit.latitude).toBeLessThanOrEqual(90)
      expect(circuit.longitude).toBeGreaterThanOrEqual(-180)
      expect(circuit.longitude).toBeLessThanOrEqual(180)
      expect(circuit.lengthKm).toBeGreaterThan(0)
      expect(circuit.turns).toBeGreaterThan(0)
      expect(circuit.tags.length).toBeGreaterThan(0)
      expect(circuit.characteristics.length).toBeGreaterThan(0)
    }
  })

  it('keeps Marina Bay as the default selected circuit', () => {
    expect(circuitSeed.find((circuit) => circuit.circuitId === 'marina_bay')).toMatchObject({
      name: 'Marina Bay Street Circuit',
      displayName: '滨海湾街道赛道',
      grandPrixName: 'Singapore Grand Prix',
      displayGrandPrixName: '新加坡大奖赛',
      shortDisplayGrandPrixName: '新加坡站',
      displayCountry: '新加坡',
      latitude: 1.2914,
      longitude: 103.864,
    })
  })

  it('provides localized display content for every visible circuit field', () => {
    for (const circuit of circuitSeed) {
      expect(circuit.displayName).toMatch(/[\u4e00-\u9fff]/)
      expect(circuit.displayGrandPrixName).toMatch(/[\u4e00-\u9fff]/)
      expect(circuit.shortDisplayGrandPrixName).toMatch(/[\u4e00-\u9fff]/)
      expect(circuit.displayCountry).toMatch(/[\u4e00-\u9fff]/)
      expect(circuit.trackTypeLabel).toMatch(/[\u4e00-\u9fff]/)
      expect(circuit.tags.every((tag) => /[\u4e00-\u9fff]/.test(tag))).toBe(true)
      expect(circuit.overview).toMatch(/[\u4e00-\u9fff]/)
      expect(circuit.characteristics.every(([label, value]) => /[\u4e00-\u9fff]/.test(label + value))).toBe(true)
    }
  })
})
