export function ErrorState({ title = '加载失败', message = '数据暂时不可用，请稍后重试。', onRetry, retryLabel = '重试' }) {
  return (
    <div className="stateBlock stateBlockError" role="alert">
      <h2>{title}</h2>
      <p>{message}</p>
      {onRetry ? (
        <button type="button" onClick={onRetry}>
          {retryLabel}
        </button>
      ) : null}
    </div>
  )
}
