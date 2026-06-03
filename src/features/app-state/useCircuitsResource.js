import { useCallback, useEffect, useState } from 'react'
import { loadCircuits } from '../api/aiInsightClient'
import { createStatusSnapshot, keepGlobalDataSourceAfterTabLoad } from '../api/circuitResourceState'
import { circuitSeed } from '../circuits/circuitSeed'

export const initialCircuitsDataState = {
  dataSource: 'static-seed',
  connectionStatus: 'loading',
}

export function resolveCircuitsLoadSuccess(currentCircuits, result) {
  return {
    circuits: Array.isArray(result.data) && result.data.length > 0 ? result.data : currentCircuits,
    dataState: {
      dataSource: result.meta?.source ?? 'api',
      connectionStatus: 'ready',
    },
  }
}

export function resolveCircuitsLoadError() {
  return {
    dataSource: 'static-seed',
    connectionStatus: 'fallback',
  }
}

export function useCircuitsResource({ loadCircuitsFn = loadCircuits, initialCircuits = circuitSeed } = {}) {
  const [circuits, setCircuits] = useState(initialCircuits)
  const [dataState, setDataState] = useState(initialCircuitsDataState)

  useEffect(() => {
    let cancelled = false

    loadCircuitsFn()
      .then((result) => {
        if (cancelled) {
          return
        }

        const nextState = resolveCircuitsLoadSuccess(initialCircuits, result)
        setCircuits(nextState.circuits)
        setDataState(nextState.dataState)
      })
      .catch(() => {
        if (cancelled) {
          return
        }

        setDataState(resolveCircuitsLoadError())
      })

    return () => {
      cancelled = true
    }
  }, [initialCircuits, loadCircuitsFn])

  const applyTabMeta = useCallback((tabMeta) => {
    setDataState((current) => keepGlobalDataSourceAfterTabLoad(current, tabMeta))
  }, [])

  const applyTabError = useCallback(() => {
    setDataState((current) => ({
      ...current,
      connectionStatus: current.dataSource === 'static-seed' ? 'fallback' : 'error',
    }))
  }, [])

  return {
    circuits,
    dataState,
    statusSnapshot: createStatusSnapshot(dataState),
    applyTabMeta,
    applyTabError,
  }
}
