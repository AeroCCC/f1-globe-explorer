import { DrawerStateRenderer } from './DrawerStateRenderer'

export function CircuitCalendarTab({ model }) {
  return (
    <DrawerStateRenderer model={model}>
      <div className="calendarCard">
        <div>
          <span>{model.season} 赛季</span>
          <strong>第 {model.round} 站</strong>
        </div>
        <h2>{model.raceName}</h2>
        <dl>
          <div>
            <dt>比赛周</dt>
            <dd>{model.dateRange}</dd>
          </div>
          <div>
            <dt>正赛日期</dt>
            <dd>{model.raceDate}</dd>
          </div>
          <div>
            <dt>举办地点</dt>
            <dd>{model.location}</dd>
          </div>
          <div>
            <dt>比赛状态</dt>
            <dd>{model.raceStatus}</dd>
          </div>
        </dl>
      </div>
    </DrawerStateRenderer>
  )
}
