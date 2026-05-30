export function LoadingState({ title = '正在加载', message = '请稍候，数据正在准备中。' }) {
  return (
    <div className="stateBlock stateBlockLoading" role="status">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  )
}
