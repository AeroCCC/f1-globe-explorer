export function attachCircuitResources(circuit, resourcesByCircuit) {
  if (!circuit) {
    return null
  }

  const resources = resourcesByCircuit[circuit.circuitId] ?? {}

  return {
    ...circuit,
    ...(resources.history ? { history: resources.history } : {}),
    ...(resources.calendar ? { calendar: resources.calendar } : {}),
    ...(resources.aiInsight ? { aiInsight: resources.aiInsight } : {}),
  }
}

export function createStatusSnapshot({ dataSource, connectionStatus }) {
  return {
    dataSource,
    connectionStatus,
  }
}

export function keepGlobalDataSourceAfterTabLoad(currentState, tabMeta = {}) {
  return {
    dataSource: currentState.dataSource === 'database' ? 'database' : (tabMeta.source ?? currentState.dataSource),
    connectionStatus: 'ready',
  }
}
