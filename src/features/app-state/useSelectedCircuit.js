import { useMemo, useState } from 'react'

export function getSelectedCircuit(circuits, selectedCircuitId) {
  return circuits.find((circuit) => circuit.circuitId === selectedCircuitId) ?? null
}

export function getSelectionStateAfterCircuitSelect(circuitId) {
  return {
    selectedCircuitId: circuitId,
    drawerOpen: true,
    activeDrawerTab: 'overview',
  }
}

export function useSelectedCircuit(circuits, { initialCircuitId = 'marina_bay' } = {}) {
  const [selectedCircuitId, setSelectedCircuitId] = useState(initialCircuitId)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview')

  const selectedCircuit = useMemo(
    () => getSelectedCircuit(circuits, selectedCircuitId),
    [circuits, selectedCircuitId],
  )

  const selectCircuit = (circuitId) => {
    const nextState = getSelectionStateAfterCircuitSelect(circuitId)
    setSelectedCircuitId(nextState.selectedCircuitId)
    setActiveDrawerTab(nextState.activeDrawerTab)
    setDrawerOpen(nextState.drawerOpen)
  }

  return {
    selectedCircuitId,
    selectedCircuit,
    drawerOpen,
    activeDrawerTab,
    setActiveDrawerTab,
    selectCircuit,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
  }
}
