import { CURRENT_SEASON } from '../circuits/circuitSeed'

const dataSourceLabels = {
  database: '数据库 / DeepSeek',
  ai_insights: '数据库 / DeepSeek',
  'static-seed': '静态种子',
  fallback: '静态种子',
}

const connectionStatusLabels = {
  ready: '在线就绪',
  loading: '连接中',
  fallback: '本地兜底',
  error: '连接异常',
}

export function BottomStatusBar({
  circuitCount,
  selectedCircuit,
  dataSource = 'static-seed',
  connectionStatus = 'fallback',
  drawerOpen,
  onSelectedClick,
}) {
  const dataLabel = dataSourceLabels[dataSource] ?? dataSource
  const statusLabel = connectionStatusLabels[connectionStatus] ?? connectionStatus

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
        数据：<strong>{dataLabel}</strong>
      </span>
      <span className="connectionStatus">
        <i aria-hidden="true" />
        状态：<strong>{statusLabel}</strong>
      </span>
    </footer>
  )
}
