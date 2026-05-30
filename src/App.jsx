import { useMemo, useState } from 'react'
import { GlobeScene } from './globe/GlobeScene'
import { circuitSeed } from './features/circuits/circuitSeed'
import { CircuitDrawer } from './features/drawer/CircuitDrawer'
import { BottomStatusBar } from './features/status/BottomStatusBar'
import './App.css'

function App() {
  const [selectedCircuitId, setSelectedCircuitId] = useState('marina_bay')
  const [hoveredCircuitId, setHoveredCircuitId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(true)
  const [activeDrawerTab, setActiveDrawerTab] = useState('overview')
  const selectedCircuit = useMemo(
    () => circuitSeed.find((circuit) => circuit.circuitId === selectedCircuitId),
    [selectedCircuitId],
  )
  const handleSelectCircuit = (circuitId) => {
    setSelectedCircuitId(circuitId)
    setActiveDrawerTab('overview')
    setDrawerOpen(true)
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
          circuits={circuitSeed}
          selectedCircuitId={selectedCircuitId}
          hoveredCircuitId={hoveredCircuitId}
          onHoverCircuit={setHoveredCircuitId}
          onSelectCircuit={handleSelectCircuit}
        />
      </section>

      <CircuitDrawer
        circuit={selectedCircuit}
        open={drawerOpen}
        activeTab={activeDrawerTab}
        onTabChange={setActiveDrawerTab}
        onClose={() => setDrawerOpen(false)}
      />

      <BottomStatusBar
        circuitCount={circuitSeed.length}
        selectedCircuit={selectedCircuit}
        drawerOpen={drawerOpen}
        onSelectedClick={() => setDrawerOpen(true)}
      />
    </main>
  )
}

export default App
