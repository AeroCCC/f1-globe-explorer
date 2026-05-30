import { DrawerStateRenderer } from './DrawerStateRenderer'

export function CircuitHistoryTab({ model }) {
  if (model.status !== 'ready') {
    return <DrawerStateRenderer model={model} />
  }

  return (
    <DrawerStateRenderer model={model}>
      <div className="drawerSection">
        <h2>近年冠军</h2>
        <div className="dataTable" role="table" aria-label="近年冠军">
          {model.recentWinners.map(([season, driver, constructor]) => (
            <div key={season} role="row">
              <span>{season}</span>
              <strong>{driver}</strong>
              <em>{constructor}</em>
            </div>
          ))}
        </div>
      </div>

      <div className="drawerSection">
        <h2>车队胜场</h2>
        <div className="barList">
          {model.constructorWins.map((constructor) => (
            <div key={constructor.name}>
              <span>{constructor.name}</span>
              <i style={{ '--bar-size': `${Math.min(constructor.wins * 16, 100)}%` }} aria-hidden="true" />
              <strong>{constructor.wins}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="drawerSection">
        <h2>关键纪录</h2>
        <div className="detailRows compactRows">
          {model.records.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </DrawerStateRenderer>
  )
}
