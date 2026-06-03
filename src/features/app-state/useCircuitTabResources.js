import { useEffect, useMemo, useState } from 'react'
import { getAiInsight, loadCircuitCalendar, loadCircuitHistory } from '../api/aiInsightClient'
import { attachCircuitResources } from '../api/circuitResourceState'
import { CURRENT_SEASON } from '../circuits/circuitSeed'

const loadableTabs = ['history', 'calendar', 'ai']
const settledResourceStatuses = ['ready', 'empty', 'loading']
const defaultCircuitTabLoaders = {
  history: loadCircuitHistory,
  calendar: (circuitId) => loadCircuitCalendar(circuitId, { season: CURRENT_SEASON }),
  ai: getAiInsight,
}

export function getCircuitTabResourceKey(activeDrawerTab) {
  if (activeDrawerTab === 'ai') {
    return 'aiInsight'
  }

  return loadableTabs.includes(activeDrawerTab) ? activeDrawerTab : null
}

export function shouldLoadCircuitTabResource(resourcesByCircuit, circuitId, activeDrawerTab) {
  const resourceKey = getCircuitTabResourceKey(activeDrawerTab)

  if (!circuitId || !resourceKey) {
    return false
  }

  return !settledResourceStatuses.includes(resourcesByCircuit[circuitId]?.[resourceKey]?.status)
}

export function mergeCircuitResource(resourcesByCircuit, circuitId, resourceKey, resource) {
  return {
    ...resourcesByCircuit,
    [circuitId]: {
      ...resourcesByCircuit[circuitId],
      [resourceKey]: resource,
    },
  }
}

export function createCircuitResourceError(error) {
  return {
    status: 'error',
    title: '加载失败',
    message: error instanceof Error ? error.message : '后端数据读取失败',
  }
}

export function createCircuitResourceLoading(activeDrawerTab) {
  return {
    status: 'loading',
    title: '正在加载',
    message: `${activeDrawerTab === 'ai' ? 'AI 解读' : '赛道数据'}读取中。`,
  }
}

export function useCircuitTabResources({
  selectedCircuit,
  selectedCircuitId,
  activeDrawerTab,
  onTabLoadMeta,
  onTabLoadError,
  loaders = defaultCircuitTabLoaders,
}) {
  const [resourcesByCircuit, setResourcesByCircuit] = useState({})

  useEffect(() => {
    const resourceKey = getCircuitTabResourceKey(activeDrawerTab)
    if (!shouldLoadCircuitTabResource(resourcesByCircuit, selectedCircuitId, activeDrawerTab)) {
      return
    }

    let cancelled = false
    loaders[activeDrawerTab](selectedCircuitId)
      .then((result) => {
        if (cancelled) {
          return
        }

        setResourcesByCircuit((current) => mergeCircuitResource(current, selectedCircuitId, resourceKey, result.data))
        onTabLoadMeta?.(result.meta)
      })
      .catch((error) => {
        if (cancelled) {
          return
        }

        setResourcesByCircuit((current) =>
          mergeCircuitResource(current, selectedCircuitId, resourceKey, createCircuitResourceError(error)),
        )
        onTabLoadError?.(error)
      })

    return () => {
      cancelled = true
    }
  }, [activeDrawerTab, loaders, onTabLoadError, onTabLoadMeta, resourcesByCircuit, selectedCircuitId])

  const selectedCircuitWithResources = useMemo(
    () => attachCircuitResources(selectedCircuit, resourcesByCircuit),
    [resourcesByCircuit, selectedCircuit],
  )

  return {
    resourcesByCircuit,
    selectedCircuit: selectedCircuitWithResources,
  }
}
