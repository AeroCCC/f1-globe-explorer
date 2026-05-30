import { DrawerStateRenderer } from './DrawerStateRenderer'

const insightRows = [
  ['整体总结', 'summary'],
  ['赛道特点', 'trackFeature'],
  ['赛车调校', 'carSetup'],
  ['车手要求', 'driverRequirement'],
  ['策略影响', 'strategyImpact'],
]

export function CircuitAiTab({ model }) {
  if (model.status !== 'ready') {
    return <DrawerStateRenderer model={model} />
  }

  return (
    <DrawerStateRenderer model={model}>
      <div className="aiMeta">
        <span>模型：{model.modelName}</span>
        <span>{model.generatedAt}</span>
      </div>
      <div className="aiInsightList">
        {insightRows.map(([label, key]) => (
          <section key={key}>
            <h2>{label}</h2>
            <p>{model.insight[key]}</p>
          </section>
        ))}
      </div>
    </DrawerStateRenderer>
  )
}
