import { DrawerStateRenderer } from './DrawerStateRenderer'

const insightRows = [
  ['整体总结', 'summary'],
  ['赛道特点', 'trackFeature'],
  ['赛车调校', 'carSetup'],
  ['车手要求', 'driverRequirement'],
  ['策略影响', 'strategyImpact'],
]

export function CircuitAiTab({ model, onGenerate }) {
  if (model.status !== 'ready') {
    return <DrawerStateRenderer model={model} onRetry={onGenerate} retryLabel="重试生成" />
  }

  return (
    <DrawerStateRenderer model={model}>
      <div className="aiMeta">
        <span>模型：{model.modelName}</span>
        <span>{model.generatedAt}</span>
      </div>
      {onGenerate ? (
        <div className="aiActions">
          <button type="button" onClick={onGenerate} disabled={model.isGenerating}>
            {model.isGenerating ? '生成中' : '生成 AI 分析'}
          </button>
        </div>
      ) : null}
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
