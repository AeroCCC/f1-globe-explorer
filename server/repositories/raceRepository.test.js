import { describe, expect, it } from 'vitest'
import { createRaceRepository, mapWinnerRowsToHistory } from './raceRepository'

const winnerRecord = {
  circuitId: 'red_bull_ring',
  season: 2020,
  round: 2,
  raceName: 'Styrian Grand Prix',
  raceDate: '2020-07-12',
  location: 'Spielberg, Austria',
  raceStatus: 'completed',
  driverName: 'Lewis Hamilton',
  constructorName: 'Mercedes',
  position: 1,
  source: 'jolpica',
}

describe('race repository', () => {
  it('upserts historical race winners by circuit, season, and round', async () => {
    const calls = []
    const query = async (text, params = []) => {
      calls.push({ text, params })
      if (/RETURNING race_id/i.test(text)) {
        return [{ race_id: 42, circuit_id: 'red_bull_ring', season: 2020, round: 2 }]
      }
      return []
    }
    const repository = createRaceRepository(query)

    await repository.upsertRaceWinner(winnerRecord)

    expect(calls[0].text).toMatch(/INSERT INTO races/i)
    expect(calls[0].text).toMatch(/ON CONFLICT \(circuit_id, season, round\) DO UPDATE/i)
    expect(calls[0].text).not.toContain(winnerRecord.driverName)
    expect(calls[0].params).toEqual([
      'red_bull_ring',
      2020,
      2,
      'Styrian Grand Prix',
      '2020-07-12',
      'Spielberg, Austria',
      'completed',
      'jolpica',
    ])

    expect(calls[1].text).toMatch(/INSERT INTO race_results/i)
    expect(calls[1].text).toMatch(/ON CONFLICT \(race_id, position\) DO UPDATE/i)
    expect(calls[1].text).not.toContain(winnerRecord.constructorName)
    expect(calls[1].params).toEqual([42, 2020, 'Lewis Hamilton', 'Mercedes', 1, 'jolpica'])
  })

  it('upserts batches of historical race winners without per-record round trips', async () => {
    const calls = []
    const query = async (text, params = []) => {
      calls.push({ text, params })
      if (/RETURNING race_id/i.test(text)) {
        return [
          { race_id: 42, circuit_id: 'red_bull_ring', season: 2020, round: 2 },
          { race_id: 43, circuit_id: 'red_bull_ring', season: 2020, round: 1 },
        ]
      }
      return []
    }
    const repository = createRaceRepository(query)

    await repository.upsertRaceWinners([
      winnerRecord,
      { ...winnerRecord, round: 1, raceName: 'Austrian Grand Prix', raceDate: '2020-07-05' },
    ])

    expect(calls).toHaveLength(2)
    expect(calls[0].text).toMatch(/INSERT INTO races/i)
    expect(calls[0].text).toMatch(/\(\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8\)/)
    expect(calls[0].text).toMatch(/\(\$9, \$10, \$11, \$12, \$13, \$14, \$15, \$16\)/)
    expect(calls[1].text).toMatch(/INSERT INTO race_results/i)
    expect(calls[1].params).toEqual([
      42,
      2020,
      'Lewis Hamilton',
      'Mercedes',
      1,
      'jolpica',
      43,
      2020,
      'Lewis Hamilton',
      'Mercedes',
      1,
      'jolpica',
    ])
  })

  it('maps winner rows into the drawer history presentation model', () => {
    const history = mapWinnerRowsToHistory('marina_bay', [
      { season: 2025, driver_name: 'George Russell', constructor_name: 'Mercedes' },
      { season: 2024, driver_name: 'Lando Norris', constructor_name: 'McLaren' },
      { season: 2023, driver_name: 'Carlos Sainz', constructor_name: 'Ferrari' },
      { season: 2022, driver_name: 'Sergio Perez', constructor_name: 'Red Bull' },
      { season: 2019, driver_name: 'Sebastian Vettel', constructor_name: 'Ferrari' },
      { season: 2018, driver_name: 'Lewis Hamilton', constructor_name: 'Mercedes' },
    ])

    expect(history).toMatchObject({
      circuitId: 'marina_bay',
      status: 'ready',
      recentWinners: [
        ['2025', 'George Russell', 'Mercedes'],
        ['2024', 'Lando Norris', 'McLaren'],
        ['2023', 'Carlos Sainz', 'Ferrari'],
        ['2022', 'Sergio Perez', 'Red Bull'],
        ['2019', 'Sebastian Vettel', 'Ferrari'],
      ],
      constructorWins: [
        { name: 'Ferrari', wins: 2 },
        { name: 'Mercedes', wins: 2 },
        { name: 'McLaren', wins: 1 },
        { name: 'Red Bull', wins: 1 },
      ],
      driverWins: [
        { name: 'Carlos Sainz', wins: 1 },
        { name: 'George Russell', wins: 1 },
        { name: 'Lando Norris', wins: 1 },
        { name: 'Lewis Hamilton', wins: 1 },
        { name: 'Sebastian Vettel', wins: 1 },
        { name: 'Sergio Perez', wins: 1 },
      ],
    })
    expect(history.records).toEqual([
      ['数据来源', 'Jolpica 历史正赛结果'],
      ['已导入分站', '6 场'],
      ['最近赛季', '2025'],
    ])
  })
})
