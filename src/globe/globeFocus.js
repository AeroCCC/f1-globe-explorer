export function getNextFocusedCircuitId(currentFocusedCircuitId, action) {
  if (action.type === 'select-circuit') {
    return action.circuitId
  }

  if (action.type === 'user-control-start') {
    return null
  }

  return currentFocusedCircuitId
}
