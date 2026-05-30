import { CircuitAiTab } from './CircuitAiTab'
import { CircuitCalendarTab } from './CircuitCalendarTab'
import { CircuitHistoryTab } from './CircuitHistoryTab'
import { CircuitOverviewTab } from './CircuitOverviewTab'
import { drawerTabs, getCircuitTabModel } from './circuitTabContent'

function formatLength(value) {
  return `${value.toFixed(3)} 公里`
}

export function CircuitDrawer({ circuit, open, activeTab, onTabChange, onClose }) {
  if (!circuit) {
    return null
  }

  return (
    <aside className={`circuitDrawer ${open ? 'isOpen' : ''}`} aria-hidden={!open} inert={open ? undefined : true}>
      <div className="drawerTopRail" />

      <header className="drawerHeader">
        <div>
          <p className="drawerKicker">国家：{circuit.displayCountry}</p>
          <h1>{circuit.displayName}</h1>
          <p>{circuit.displayGrandPrixName}</p>
        </div>

        <button className="iconButton closeButton" type="button" onClick={onClose} aria-label="关闭赛道详情">
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </header>

      <dl className="circuitMetrics" aria-label="赛道指标">
        <div>
          <dt>类型</dt>
          <dd>{circuit.trackTypeLabel}</dd>
        </div>
        <div>
          <dt>长度</dt>
          <dd>{formatLength(circuit.lengthKm)}</dd>
        </div>
        <div>
          <dt>弯角</dt>
          <dd>{circuit.turns}</dd>
        </div>
      </dl>

      <div className="detailRows" aria-label="赛道摘要">
        <div>
          <span>首次办赛</span>
          <strong>{circuit.firstGrandPrix}</strong>
        </div>
        <div>
          <span>当前赛季</span>
          <strong>{circuit.isCurrentSeason ? '已确认' : '未启用'}</strong>
        </div>
      </div>

      <div className="tagList" aria-label="赛道标签">
        {circuit.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <nav className="drawerTabs" aria-label="赛道详情">
        {drawerTabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'isActive' : ''}
            type="button"
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section
        className="drawerPanel"
        aria-label={`${drawerTabs.find((tab) => tab.id === activeTab)?.label ?? '详情'}面板`}
      >
        <DrawerTabContent circuit={circuit} activeTab={activeTab} onTabChange={onTabChange} />
      </section>
    </aside>
  )
}

function DrawerTabContent({ circuit, activeTab, onTabChange }) {
  const model = getCircuitTabModel(circuit, activeTab)

  if (activeTab === 'overview') {
    return <CircuitOverviewTab model={model} onTabChange={onTabChange} />
  }

  if (activeTab === 'history') {
    return <CircuitHistoryTab model={model} />
  }

  if (activeTab === 'calendar') {
    return <CircuitCalendarTab model={model} />
  }

  if (activeTab === 'ai') {
    return <CircuitAiTab model={model} />
  }

  return <CircuitOverviewTab model={getCircuitTabModel(circuit, 'overview')} onTabChange={onTabChange} />
}
