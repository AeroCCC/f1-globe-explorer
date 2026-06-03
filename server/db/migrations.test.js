import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const initSql = readFileSync(new URL('./migrations/001_init.sql', import.meta.url), 'utf8')
const historyMigrationUrl = new URL('./migrations/002_history_import.sql', import.meta.url)
const resultUniquenessMigrationUrl = new URL('./migrations/003_race_result_winner_uniqueness.sql', import.meta.url)
const circuitSeasonRoundMigrationUrl = new URL('./migrations/004_circuit_season_round.sql', import.meta.url)
const aiInsightEngineeringTypeMigrationUrl = new URL(
  './migrations/005_ai_insight_engineering_type.sql',
  import.meta.url,
)

describe('database migrations', () => {
  it('creates the required Postgres tables idempotently', () => {
    expect(initSql).toMatch(/CREATE TABLE IF NOT EXISTS circuits/i)
    expect(initSql).toMatch(/CREATE TABLE IF NOT EXISTS races/i)
    expect(initSql).toMatch(/CREATE TABLE IF NOT EXISTS race_results/i)
    expect(initSql).toMatch(/CREATE TABLE IF NOT EXISTS ai_insights/i)
    expect(initSql).toMatch(/UNIQUE \(circuit_id, insight_type\)/i)
    expect(initSql).toMatch(/insight_type TEXT NOT NULL DEFAULT 'track_engineering_v1'/i)
    expect(initSql).toMatch(/season_round INTEGER/i)
  })

  it('does not contain destructive schema operations', () => {
    expect(initSql).not.toMatch(/\bDROP\s+TABLE\b/i)
    expect(initSql).not.toMatch(/\bTRUNCATE\b/i)
    expect(initSql).not.toMatch(/\bDELETE\s+FROM\b/i)
  })

  it('allows multiple races at the same circuit in one season for historical imports', () => {
    expect(existsSync(historyMigrationUrl)).toBe(true)

    const historySql = readFileSync(historyMigrationUrl, 'utf8')
    expect(historySql).toMatch(/DROP CONSTRAINT IF EXISTS races_circuit_id_season_key/i)
    expect(historySql).toMatch(/UNIQUE INDEX IF NOT EXISTS races_circuit_season_round_unique/i)
    expect(historySql).toMatch(/\(circuit_id, season, round\)/i)
    expect(historySql).not.toMatch(/\bDROP\s+TABLE\b/i)
    expect(historySql).not.toMatch(/\bTRUNCATE\b/i)
    expect(historySql).not.toMatch(/\bDELETE\s+FROM\b/i)
  })

  it('keeps one imported winner per race position when upstream data changes', () => {
    expect(existsSync(resultUniquenessMigrationUrl)).toBe(true)

    const resultSql = readFileSync(resultUniquenessMigrationUrl, 'utf8')
    expect(resultSql).toMatch(/DROP CONSTRAINT IF EXISTS race_results_race_id_driver_name_position_key/i)
    expect(resultSql).toMatch(/UNIQUE INDEX IF NOT EXISTS race_results_race_position_unique/i)
    expect(resultSql).toMatch(/\(race_id, position\)/i)
    expect(resultSql).not.toMatch(/\bDROP\s+TABLE\b/i)
    expect(resultSql).not.toMatch(/\bTRUNCATE\b/i)
    expect(resultSql).not.toMatch(/\bDELETE\s+FROM\b/i)
  })

  it('adds current-season round ordering without destructive schema operations', () => {
    expect(existsSync(circuitSeasonRoundMigrationUrl)).toBe(true)

    const roundSql = readFileSync(circuitSeasonRoundMigrationUrl, 'utf8')
    expect(roundSql).toMatch(/ADD COLUMN IF NOT EXISTS season_round INTEGER/i)
    expect(roundSql).toMatch(/idx_circuits_current_round/i)
    expect(roundSql).not.toMatch(/\bDROP\s+TABLE\b/i)
    expect(roundSql).not.toMatch(/\bTRUNCATE\b/i)
    expect(roundSql).not.toMatch(/\bDELETE\s+FROM\b/i)
  })

  it('defaults new AI insight records to the engineering analysis type', () => {
    expect(existsSync(aiInsightEngineeringTypeMigrationUrl)).toBe(true)

    const aiInsightTypeSql = readFileSync(aiInsightEngineeringTypeMigrationUrl, 'utf8')
    expect(aiInsightTypeSql).toMatch(/ALTER COLUMN insight_type SET DEFAULT 'track_engineering_v1'/i)
    expect(aiInsightTypeSql).not.toMatch(/\bDROP\s+TABLE\b/i)
    expect(aiInsightTypeSql).not.toMatch(/\bTRUNCATE\b/i)
    expect(aiInsightTypeSql).not.toMatch(/\bDELETE\s+FROM\b/i)
  })
})
