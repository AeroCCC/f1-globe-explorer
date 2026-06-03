import { DrawerStateRenderer } from './DrawerStateRenderer'

const insightRows = [
  ['工程摘要', 'summary'],
  ['赛道特点', 'trackFeature'],
  ['调校重点', 'carSetup'],
  ['轮胎与刹车', 'tyreAndBrakeLoad'],
  ['超车与节奏', 'overtakingAndRacePace'],
  ['车手要求', 'driverRequirement'],
  ['策略风险', 'strategyRisk'],
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
        <span>可信度：{model.insight.dataConfidence}</span>
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
        <section>
          <h2>数据说明</h2>
          <p>{model.insight.dataNotes}</p>
        </section>
      </div>
    </DrawerStateRenderer>
  )
}
