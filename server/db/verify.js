import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { query } from './client.js'

export async function verifyDatabase() {
  const result = await query('SELECT COUNT(*)::int AS count FROM circuits')
  return result[0]?.count ?? 0
}

if (resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const count = await verifyDatabase()
  console.log(`circuits=${count}`)
}
