import { circuitSeed } from '../../src/features/circuits/circuitSeed.js'
import { createJolpicaClient } from '../clients/jolpicaClient.js'
import { query } from '../db/client.js'
import { createRaceRepository } from '../repositories/raceRepository.js'

export const JOLPICA_CIRCUIT_IDS = {
  albert_park: 'albert_park',
  shanghai: 'shanghai',
  suzuka: 'suzuka',
  bahrain: 'bahrain',
  jeddah: 'jeddah',
  miami: 'miami',
  gilles_villeneuve: 'villeneuve',
  monaco: 'monaco',
  barcelona_catalunya: 'catalunya',
  red_bull_ring: 'red_bull_ring',
  silverstone: 'silverstone',
  spa: 'spa',
  hungaroring: 'hungaroring',
  zandvoort: 'zandvoort',
  monza: 'monza',
  baku: 'baku',
  marina_bay: 'marina_bay',
  cota: 'americas',
  hermanos_rodriguez: 'rodriguez',
  interlagos: 'interlagos',
  las_vegas: 'vegas',
  lusail: 'losail',
  yas_marina: 'yas_marina',
}

export const JOLPICA_UNAVAILABLE_CIRCUITS = {
  madring: '2026 new venue; Jolpica/Ergast has no historical race winner results for this circuit yet',
}

const PAGE_LIMIT = 100

export async function importCircuitHistories({
  circuits = circuitSeed,
  circuitMap = JOLPICA_CIRCUIT_IDS,
  unavailableCircuitReasons = JOLPICA_UNAVAILABLE_CIRCUITS,
  jolpicaClient = createJolpicaClient(),
  raceRepository = createRaceRepository(query),
} = {}) {
  const summary = {
    importedRaces: 0,
    circuits: [],
    skipped: [],
    errors: [],
  }

  for (const circuit of circuits) {
    const unavailableReason = unavailableCircuitReasons[circuit.circuitId]
    if (unavailableReason) {
      summary.skipped.push({ circuitId: circuit.circuitId, reason: unavailableReason })
      continue
    }

    const jolpicaCircuitId = circuitMap[circuit.circuitId]
    if (!jolpicaCircuitId) {
      summary.skipped.push({ circuitId: circuit.circuitId, reason: 'missing-jolpica-mapping' })
      continue
    }

    try {
      const races = await fetchAllWinnerRaces(jolpicaClient, jolpicaCircuitId)
      const records = buildHistoricalWinnerRecords(circuit.circuitId, races)

      if (typeof raceRepository.upsertRaceWinners === 'function') {
        await raceRepository.upsertRaceWinners(records)
      } else {
        for (const record of records) {
          await raceRepository.upsertRaceWinner(record)
        }
      }

      summary.importedRaces += records.length
      summary.circuits.push({
        circuitId: circuit.circuitId,
        jolpicaCircuitId,
        importedRaces: records.length,
      })
    } catch (error) {
      summary.errors.push({
        circuitId: circuit.circuitId,
        jolpicaCircuitId,
        message: error.message,
      })
    }
  }

  return summary
}

export function buildHistoricalWinnerRecords(circuitId, races) {
  return races.map((race) => mapRaceToWinnerRecord(circuitId, race)).filter(Boolean)
}

async function fetchAllWinnerRaces(jolpicaClient, jolpicaCircuitId) {
  const races = []
  let offset = 0

  while (true) {
    const payload = await jolpicaClient.getCircuitWinnerResults(jolpicaCircuitId, {
      limit: PAGE_LIMIT,
      offset,
    })
    const batch = payload.MRData?.RaceTable?.Races ?? []
    races.push(...batch)

    const total = Number(payload.MRData?.total ?? races.length)
    if (races.length >= total || batch.length === 0) {
      break
    }

    offset += PAGE_LIMIT
  }

  return races
}

function mapRaceToWinnerRecord(circuitId, race) {
  const result = race.Results?.[0]
  if (!result) {
    return null
  }

  const driverName = [result.Driver?.givenName, result.Driver?.familyName].filter(Boolean).join(' ')
  const location = [race.Circuit?.Location?.locality, race.Circuit?.Location?.country].filter(Boolean).join(', ')

  return {
    circuitId,
    season: Number(race.season),
    round: Number(race.round),
    raceName: race.raceName,
    raceDate: race.date,
    location,
    raceStatus: 'completed',
    driverName,
    constructorName: result.Constructor?.name,
    position: Number(result.position ?? 1),
    source: 'jolpica',
  }
}
