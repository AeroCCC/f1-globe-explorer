import { describe, expect, it } from 'vitest'
import { circuitSeed } from '../../src/features/circuits/circuitSeed'
import {
  JOLPICA_CIRCUIT_IDS,
  buildHistoricalWinnerRecords,
  importCircuitHistories,
} from './jolpicaHistoryImport'

const racePayload = {
  season: '2025',
  round: '18',
  raceName: 'Singapore Grand Prix',
  date: '2025-10-05',
  Circuit: {
    Location: {
      locality: 'Singapore',
      country: 'Singapore',
    },
  },
  Results: [
    {
      position: '1',
      Driver: {
        givenName: 'George',
        familyName: 'Russell',
      },
      Constructor: {
        name: 'Mercedes',
      },
    },
  ],
}

describe('Jolpica history import service', () => {
  it('keeps a Jolpica circuit ID mapping for every current seed circuit', () => {
    expect(Object.keys(JOLPICA_CIRCUIT_IDS).sort()).toEqual(circuitSeed.map((circuit) => circuit.circuitId).sort())
  })

  it('builds normalized historical winner records from Jolpica races', () => {
    const records = buildHistoricalWinnerRecords('marina_bay', [racePayload])

    expect(records).toEqual([
      {
        circuitId: 'marina_bay',
        season: 2025,
        round: 18,
        raceName: 'Singapore Grand Prix',
        raceDate: '2025-10-05',
        location: 'Singapore, Singapore',
        raceStatus: 'completed',
        driverName: 'George Russell',
        constructorName: 'Mercedes',
        position: 1,
        source: 'jolpica',
      },
    ])
  })

  it('paginates Jolpica winner results and imports them without fabricating empty circuits', async () => {
    const requested = []
    const imported = []
    const jolpicaClient = {
      getCircuitWinnerResults: async (jolpicaCircuitId, { limit, offset }) => {
        requested.push({ jolpicaCircuitId, limit, offset })
        return {
          MRData: {
            total: '101',
            RaceTable: {
              Races: offset === 0 ? Array.from({ length: 100 }, () => racePayload) : [racePayload],
            },
          },
        }
      },
    }
    const raceRepository = {
      upsertRaceWinner: async (record) => {
        imported.push(record)
      },
    }

    const result = await importCircuitHistories({
      circuits: [{ circuitId: 'marina_bay' }, { circuitId: 'madring' }],
      circuitMap: { marina_bay: 'marina_bay', madring: 'madring' },
      jolpicaClient,
      raceRepository,
    })

    expect(requested).toEqual([
      { jolpicaCircuitId: 'marina_bay', limit: 100, offset: 0 },
      { jolpicaCircuitId: 'marina_bay', limit: 100, offset: 100 },
      { jolpicaCircuitId: 'madring', limit: 100, offset: 0 },
      { jolpicaCircuitId: 'madring', limit: 100, offset: 100 },
    ])
    expect(imported).toHaveLength(202)
    expect(result).toEqual({
      importedRaces: 202,
      circuits: [
        { circuitId: 'marina_bay', jolpicaCircuitId: 'marina_bay', importedRaces: 101 },
        { circuitId: 'madring', jolpicaCircuitId: 'madring', importedRaces: 101 },
      ],
      skipped: [],
      errors: [],
    })
  })
})
