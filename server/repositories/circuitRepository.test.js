import { describe, expect, it } from 'vitest'
import { circuitSeed } from '../../src/features/circuits/circuitSeed'
import { createCircuitRepository, mapCircuitRowToDto, mapCircuitToRow } from './circuitRepository'

describe('circuit repository', () => {
  it('maps seed circuits into database rows and back into DTOs', () => {
    const row = mapCircuitToRow(circuitSeed[0])
    const dto = mapCircuitRowToDto(row)

    expect(row).toMatchObject({
      circuit_id: circuitSeed[0].circuitId,
      display_name: circuitSeed[0].displayName,
      display_grand_prix_name: circuitSeed[0].displayGrandPrixName,
      is_current_season: true,
    })
    expect(dto).toMatchObject({
      circuitId: circuitSeed[0].circuitId,
      chineseName: circuitSeed[0].displayName,
      displayGrandPrixName: circuitSeed[0].displayGrandPrixName,
      tags: circuitSeed[0].tags,
    })
  })

  it('reads ordered circuit rows from Postgres', async () => {
    const calls = []
    const query = async (text, params = []) => {
      calls.push({ text, params })
      return [mapCircuitToRow(circuitSeed[0])]
    }
    const repository = createCircuitRepository(query)

    const circuits = await repository.listCircuits()

    expect(calls[0].text).toMatch(/FROM circuits/i)
    expect(calls[0].text).toMatch(/ORDER BY is_current_season DESC, region ASC, display_grand_prix_name ASC/i)
    expect(circuits[0]).toMatchObject({ circuitId: circuitSeed[0].circuitId })
  })

  it('upserts seed circuits without exposing raw values in SQL text', async () => {
    const calls = []
    const query = async (text, params = []) => {
      calls.push({ text, params })
      return []
    }
    const repository = createCircuitRepository(query)

    await repository.upsertCircuits([circuitSeed[0]])

    expect(calls[0].text).toMatch(/INSERT INTO circuits/i)
    expect(calls[0].text).toMatch(/ON CONFLICT \(circuit_id\) DO UPDATE/i)
    expect(calls[0].text).toContain('$1')
    expect(calls[0].text).not.toContain(circuitSeed[0].displayName)
    expect(calls[0].params[0]).toBe(circuitSeed[0].circuitId)
  })
})
