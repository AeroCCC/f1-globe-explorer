import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { importCircuitHistories } from '../services/jolpicaHistoryImport.js'

export async function runHistoryImport({ importHistories = importCircuitHistories } = {}) {
  return importHistories()
}

if (resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const summary = await runHistoryImport()
  console.log(JSON.stringify(summary, null, 2))
}
