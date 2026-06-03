import { CURRENT_SEASON } from '../circuits/circuitSeed'

export function BottomStatusBar({ circuitCount, selectedCircuit, drawerOpen, onSelectedClick }) {
  return (
    <footer className="bottomStatusBar" aria-label="应用状态">
      <span className="copyright">© 2026 F1 全球赛道探索器</span>
      <span>
        赛季：<strong>{CURRENT_SEASON}</strong>
      </span>
      <span>
        已加载赛道：<strong>{circuitCount}</strong>
      </span>
      <button
        className="selectedStatus"
        type="button"
        onClick={onSelectedClick}
        aria-expanded={drawerOpen}
        disabled={!selectedCircuit}
      >
        当前选中：<strong>{selectedCircuit?.shortDisplayGrandPrixName ?? '无'}</strong>
      </button>
      <span>
        数据：<strong>Postgres / DeepSeek</strong>
      </span>
      <span className="connectionStatus">
        <i aria-hidden="true" />
        状态：<strong>在线就绪</strong>
      </span>
    </footer>
  )
}
