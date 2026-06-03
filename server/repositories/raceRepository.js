export function createRaceRepository(query) {
  return {
    async upsertRaceWinner(record) {
      await this.upsertRaceWinners([record])
    },

    async upsertRaceWinners(records) {
      if (records.length === 0) {
        return
      }

      const raceParams = records.flatMap((record) => [
        record.circuitId,
        record.season,
        record.round,
        record.raceName,
        record.raceDate,
        record.location,
        record.raceStatus,
        record.source,
      ])
      const raceValues = createValuePlaceholders(records.length, 8)
      const raceRows = await query(
        `INSERT INTO races (
           circuit_id,
           season,
           round,
           race_name,
           race_date,
           location,
           race_status,
           source
         )
         VALUES ${raceValues}
         ON CONFLICT (circuit_id, season, round) DO UPDATE SET
           race_name = EXCLUDED.race_name,
           race_date = EXCLUDED.race_date,
           location = EXCLUDED.location,
           race_status = EXCLUDED.race_status,
           source = EXCLUDED.source,
           updated_at = NOW()
         RETURNING race_id, circuit_id, season, round`,
        raceParams,
      )
      const raceIdsByKey = new Map(
        raceRows.map((row) => [createRaceKey(row.circuit_id, row.season, row.round), row.race_id]),
      )
      const resultRows = records.map((record) => ({
        raceId: raceIdsByKey.get(createRaceKey(record.circuitId, record.season, record.round)),
        record,
      }))
      const resultParams = resultRows.flatMap(({ raceId, record }) => [
        raceId,
        record.season,
        record.driverName,
        record.constructorName,
        record.position,
        record.source,
      ])
      const resultValues = createValuePlaceholders(resultRows.length, 6)

      await query(
        `INSERT INTO race_results (
           race_id,
           season,
           driver_name,
           constructor_name,
           position,
           source
         )
         VALUES ${resultValues}
         ON CONFLICT (race_id, position) DO UPDATE SET
           driver_name = EXCLUDED.driver_name,
           constructor_name = EXCLUDED.constructor_name,
           source = EXCLUDED.source`,
        resultParams,
      )
    },

    async getCircuitHistory(circuitId) {
      const rows = await query(
        `SELECT
           races.season,
           race_results.driver_name,
           race_results.constructor_name
         FROM races
         INNER JOIN race_results ON race_results.race_id = races.race_id
         WHERE races.circuit_id = $1
           AND race_results.position = 1
         ORDER BY races.season DESC, races.round DESC`,
        [circuitId],
      )

      return mapWinnerRowsToHistory(circuitId, rows)
    },
  }
}

function createValuePlaceholders(rowCount, columnCount) {
  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const placeholders = Array.from({ length: columnCount }, (_, columnIndex) => {
      return `$${rowIndex * columnCount + columnIndex + 1}`
    })
    return `(${placeholders.join(', ')})`
  }).join(', ')
}

function createRaceKey(circuitId, season, round) {
  return `${circuitId}:${season}:${round}`
}

export function mapWinnerRowsToHistory(circuitId, rows) {
  if (rows.length === 0) {
    return {
      circuitId,
      status: 'empty',
      recentWinners: [],
      constructorWins: [],
      driverWins: [],
      records: [],
      message: '该赛道暂未导入历史正赛冠军数据。',
    }
  }

  const constructorWins = countWins(rows, 'constructor_name')
  const driverWins = countWins(rows, 'driver_name')
  const latestSeason = rows[0]?.season

  return {
    circuitId,
    status: 'ready',
    recentWinners: rows.slice(0, 5).map((row) => [
      String(row.season),
      row.driver_name,
      row.constructor_name,
    ]),
    constructorWins,
    driverWins,
    records: [
      ['数据来源', 'Jolpica 历史正赛结果'],
      ['已导入分站', `${rows.length} 场`],
      ['最近赛季', String(latestSeason)],
    ],
  }
}

function countWins(rows, key) {
  const counts = new Map()
  for (const row of rows) {
    counts.set(row[key], (counts.get(row[key]) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([name, wins]) => ({ name, wins }))
    .sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name))
}
