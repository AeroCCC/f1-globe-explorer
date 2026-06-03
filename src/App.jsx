import { GlobeScene } from './globe/GlobeScene'
import { useCircuitTabResources } from './features/app-state/useCircuitTabResources'
import { useCircuitsResource } from './features/app-state/useCircuitsResource'
import { useGlobeSelection } from './features/app-state/useGlobeSelection'
import { useSelectedCircuit } from './features/app-state/useSelectedCircuit'
import { CircuitDrawer } from './features/drawer/CircuitDrawer'
import { BottomStatusBar } from './features/status/BottomStatusBar'
import './App.css'

function App() {
  const circuitsResource = useCircuitsResource()
  const selection = useSelectedCircuit(circuitsResource.circuits)
  const globeSelection = useGlobeSelection()
  const tabResources = useCircuitTabResources({
    selectedCircuit: selection.selectedCircuit,
    selectedCircuitId: selection.selectedCircuitId,
    activeDrawerTab: selection.activeDrawerTab,
    onTabLoadMeta: circuitsResource.applyTabMeta,
    onTabLoadError: circuitsResource.applyTabError,
  })

  const handleSelectCircuit = (circuitId) => {
    selection.selectCircuit(circuitId)
    globeSelection.focusCircuit(circuitId)
  }

  return (
    <main className="appShell">
      <header className="brandRail" aria-label="F1 全球赛道探索器">
        <a className="brand" href="/" aria-label="F1 全球赛道探索器首页">
          <span className="brandMark" aria-hidden="true" />
          <span>F1 全球赛道探索器</span>
        </a>
      </header>

      <section className="globeStage" aria-label="可交互 3D 地球">
        <GlobeScene
          circuits={circuitsResource.circuits}
          selectedCircuitId={selection.selectedCircuitId}
          focusedCircuitId={globeSelection.focusedCircuitId}
          hoveredCircuitId={globeSelection.hoveredCircuitId}
          onHoverCircuit={globeSelection.setHoveredCircuitId}
          onSelectCircuit={handleSelectCircuit}
          onUserControlGlobe={globeSelection.releaseFocusForUserControl}
        />
      </section>

      <CircuitDrawer
        circuit={tabResources.selectedCircuit}
        open={selection.drawerOpen}
        activeTab={selection.activeDrawerTab}
        onTabChange={selection.setActiveDrawerTab}
        onClose={selection.closeDrawer}
      />

      <BottomStatusBar
        circuitCount={circuitsResource.circuits.length}
        selectedCircuit={tabResources.selectedCircuit}
        dataSource={circuitsResource.statusSnapshot.dataSource}
        connectionStatus={circuitsResource.statusSnapshot.connectionStatus}
        drawerOpen={selection.drawerOpen}
        onSelectedClick={selection.openDrawer}
      />
    </main>
  )
}

export default App
