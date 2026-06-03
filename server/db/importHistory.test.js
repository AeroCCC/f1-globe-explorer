import { describe, expect, it } from 'vitest'
import { runHistoryImport } from './importHistory'

describe('history import CLI entry', () => {
  it('runs the Jolpica history import and returns its summary', async () => {
    const summary = {
      importedRaces: 1,
      circuits: [{ circuitId: 'marina_bay', jolpicaCircuitId: 'marina_bay', importedRaces: 1 }],
      skipped: [],
      errors: [],
    }
    const importHistories = async () => summary

    await expect(runHistoryImport({ importHistories })).resolves.toBe(summary)
  })
})
