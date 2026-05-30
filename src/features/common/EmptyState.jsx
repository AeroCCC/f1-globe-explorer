export function EmptyState({ title = '暂无数据', message = '该模块暂时没有可展示内容。' }) {
  return (
    <div className="stateBlock">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  )
}
