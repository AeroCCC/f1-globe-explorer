import { useState } from 'react'
import { getNextFocusedCircuitId } from '../../globe/globeFocus'

export function getGlobeSelectionStateAfterAction(currentFocusedCircuitId, action) {
  return getNextFocusedCircuitId(currentFocusedCircuitId, action)
}

export function useGlobeSelection({ initialFocusedCircuitId = 'marina_bay' } = {}) {
  const [focusedCircuitId, setFocusedCircuitId] = useState(initialFocusedCircuitId)
  const [hoveredCircuitId, setHoveredCircuitId] = useState(null)

  const focusCircuit = (circuitId) => {
    setFocusedCircuitId((currentFocusedCircuitId) =>
      getGlobeSelectionStateAfterAction(currentFocusedCircuitId, { type: 'select-circuit', circuitId }),
    )
  }

  const releaseFocusForUserControl = () => {
    setFocusedCircuitId((currentFocusedCircuitId) =>
      getGlobeSelectionStateAfterAction(currentFocusedCircuitId, { type: 'user-control-start' }),
    )
  }

  return {
    focusedCircuitId,
    hoveredCircuitId,
    setHoveredCircuitId,
    focusCircuit,
    releaseFocusForUserControl,
  }
}
