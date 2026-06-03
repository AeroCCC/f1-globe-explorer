import { useState } from 'react'
import { generateAiInsight } from '../api/aiInsightClient'
import { CircuitAiTab } from './CircuitAiTab'
import { CircuitCalendarTab } from './CircuitCalendarTab'
import { CircuitHistoryTab } from './CircuitHistoryTab'
import { CircuitOverviewTab } from './CircuitOverviewTab'
import { drawerTabs, getCircuitTabModel } from './circuitTabContent'

function formatLength(value) {
  return `${value.toFixed(3)} 公里`
}

export function CircuitDrawer({ circuit, open, activeTab, onTabChange, onClose }) {
  const [generatedAiInsight, setGeneratedAiInsight] = useState(null)
  const [aiGenerationState, setAiGenerationState] = useState({ status: 'idle', message: '' })

  if (!circuit) {
    return null
  }

  const handleGenerateAiInsight = async () => {
    setAiGenerationState({
      circuitId: circuit.circuitId,
      status: 'loading',
      message: '正在请求 DeepSeek 生成中文赛道分析。',
    })

    try {
      const result = await generateAiInsight(circuit.circuitId)
      setGeneratedAiInsight(result)
      setAiGenerationState({ circuitId: circuit.circuitId, status: 'ready', message: '' })
    } catch (error) {
      setAiGenerationState({
        circuitId: circuit.circuitId,
        status: 'error',
        message: error instanceof Error ? error.message : 'AI 分析生成失败',
      })
    }
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
        <DrawerTabContent
          circuit={circuit}
          activeTab={activeTab}
          onTabChange={onTabChange}
          generatedAiInsight={generatedAiInsight?.circuitId === circuit.circuitId ? generatedAiInsight : null}
          aiGenerationState={aiGenerationState}
          onGenerateAiInsight={handleGenerateAiInsight}
        />
      </section>
    </aside>
  )
}

function DrawerTabContent({ circuit, activeTab, onTabChange, generatedAiInsight, aiGenerationState, onGenerateAiInsight }) {
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
    return (
      <CircuitAiTab
        model={createAiModel(model, circuit.circuitId, generatedAiInsight, aiGenerationState)}
        onGenerate={onGenerateAiInsight}
      />
    )
  }

  return <CircuitOverviewTab model={getCircuitTabModel(circuit, 'overview')} onTabChange={onTabChange} />
}

function createAiModel(baseModel, circuitId, generatedAiInsight, generationState) {
  if (generatedAiInsight?.circuitId === circuitId) {
    return {
      status: 'ready',
      modelName: generatedAiInsight.modelName,
      generatedAt: generatedAiInsight.generatedAt,
      insight: generatedAiInsight.insight,
    }
  }

  if (generationState.circuitId === circuitId && generationState.status === 'loading') {
    return {
      status: 'loading',
      title: '正在生成 AI 分析',
      message: generationState.message,
    }
  }

  if (generationState.circuitId === circuitId && generationState.status === 'error') {
    return {
      status: 'error',
      title: '生成失败',
      message: generationState.message,
    }
  }

  return baseModel
}
