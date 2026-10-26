import { circuitSeed, CURRENT_SEASON } from '../../src/features/circuits/circuitSeed.js'
import { createFallbackAiInsight, detailSeed } from '../../src/features/circuits/detailSeed.js'
import { normalizeCircuitDto } from '../dto/circuitDto.js'
import { ApiError } from '../http/apiResponse.js'
import { query } from '../db/client.js'
import { createCircuitRepository } from '../repositories/circuitRepository.js'
import { createRaceRepository } from '../repositories/raceRepository.js'

const DATA_SOURCE = 'static-seed'

export async function listCircuits(options = {}) {
  const { repository = createCircuitRepository(query), useDatabase = shouldUseDatabase() } = options

  if (useDatabase) {
    try {
      const circuits = await repository.listCircuits()
      if (circuits.length > 0) {
        const data = circuits.map(normalizeCircuitDto)
        return {
          data,
          meta: {
            source: 'database',
            season: CURRENT_SEASON,
            count: data.length,
          },
        }
      }
    } catch (error) {
      return createStaticCircuitListResult(error.message)
    }
  }

  return createStaticCircuitListResult()
}

function createStaticCircuitListResult(fallbackReason) {
  return {
    data: circuitSeed.map(normalizeCircuitDto),
    meta: {
      source: DATA_SOURCE,
      season: CURRENT_SEASON,
      count: circuitSeed.length,
      ...(fallbackReason ? { fallbackReason } : {}),
    },
  }
}

export async function getCircuitDetail(circuitId, options = {}) {
  const { repository = createCircuitRepository(query), useDatabase = shouldUseDatabase() } = options

  if (useDatabase) {
    try {
      const circuit = await repository.getCircuitById(circuitId)
      if (circuit) {
        return {
          data: normalizeCircuitDto(circuit),
          meta: {
            source: 'database',
            season: CURRENT_SEASON,
          },
        }
      }
    } catch {
      // Static seed fallback keeps the API available when local database setup is incomplete.
    }
  }

  const circuit = findCircuitOrThrow(circuitId)

  return {
    data: normalizeCircuitDto(circuit),
    meta: {
      source: DATA_SOURCE,
      season: CURRENT_SEASON,
    },
  }
}

export async function getCircuitHistory(circuitId, options = {}) {
  const { historyRepository = createRaceRepository(query), useDatabase = shouldUseDatabase() } = options
  const circuit = findCircuitOrThrow(circuitId)

  if (useDatabase) {
    try {
      const history = await historyRepository.getCircuitHistory(circuitId)
      if (history.status === 'ready' || history.status === 'empty') {
        return {
          data: history,
          meta: {
            source: 'database',
          },
        }
      }
    } catch {
      // Static preview fallback keeps the API available when local database setup is incomplete.
    }
  }

  const history = detailSeed[circuit.circuitId]?.history

  return {
    data: {
      circuitId,
      status: history ? 'ready' : 'empty',
      recentWinners: history?.recentWinners ?? [],
      constructorWins: history?.constructorWins ?? [],
      driverWins: history?.driverWins ?? [],
      records: history?.records ?? [],
      message: history ? undefined : '该赛道的历史结果将在后端接口接入后展示。',
    },
    meta: {
      source: DATA_SOURCE,
    },
  }
}

export function getCircuitCalendar(circuitId, season = CURRENT_SEASON) {
  const circuit = findCircuitOrThrow(circuitId)
  const calendar = detailSeed[circuit.circuitId]?.calendar
  const normalizedSeason = Number.parseInt(season, 10) || CURRENT_SEASON

  return {
    data: {
      circuitId,
      status: 'ready',
      season: calendar?.season ?? normalizedSeason,
      requestedSeason: normalizedSeason,
      round: calendar?.round ?? '待公布',
      raceName: calendar?.raceName ?? circuit.displayGrandPrixName,
      dateRange: calendar?.dateRange ?? '待公布',
      raceDate: calendar?.raceDate ?? '待公布',
      location: calendar?.location ?? `${circuit.displayCountry}，${circuit.city}`,
      raceStatus: calendar?.raceStatus ?? '待确认',
    },
    meta: {
      source: DATA_SOURCE,
    },
  }
}

export function getCircuitAiInsight(circuitId) {
  const circuit = findCircuitOrThrow(circuitId)
  const aiInsight = detailSeed[circuit.circuitId]?.aiInsight ?? createFallbackAiInsight(circuit)

  return {
    data: {
      circuitId,
      status: 'ready',
      cached: true,
      modelName: aiInsight.modelName,
      generatedAt: aiInsight.generatedAt,
      insight: {
        summary: aiInsight.summary,
        trackFeature: aiInsight.trackFeature,
        carSetup: aiInsight.carSetup,
        tyreAndBrakeLoad: aiInsight.tyreAndBrakeLoad,
        overtakingAndRacePace: aiInsight.overtakingAndRacePace,
        driverRequirement: aiInsight.driverRequirement,
        strategyRisk: aiInsight.strategyRisk,
        dataConfidence: aiInsight.dataConfidence,
        dataNotes: aiInsight.dataNotes,
      },
    },
    meta: {
      source: DATA_SOURCE,
    },
  }
}

function findCircuitOrThrow(circuitId) {
  const circuit = circuitSeed.find((item) => item.circuitId === circuitId)

  if (!circuit) {
    throw new ApiError(404, 'CIRCUIT_NOT_FOUND', '未找到赛道', { circuitId })
  }

  return circuit
}

function shouldUseDatabase() {
  return process.env.NODE_ENV !== 'test'
}
