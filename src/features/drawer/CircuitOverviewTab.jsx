import { DrawerStateRenderer } from './DrawerStateRenderer'

export function CircuitOverviewTab({ model, onTabChange }) {
  if (model.status !== 'ready') {
    return <DrawerStateRenderer model={model} />
  }

  return (
    <DrawerStateRenderer model={model}>
      <p className="overviewCopy">{model.overview}</p>
      <div className="characteristics">
        <h2>赛道特征</h2>
        {model.characteristics.map(([label, value]) => (
          <div key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
      <div className="drawerActions">
        {model.actions.map((action) => (
          <button key={action.targetTab} type="button" onClick={() => onTabChange(action.targetTab)}>
            {action.label}
          </button>
        ))}
      </div>
    </DrawerStateRenderer>
  )
}
