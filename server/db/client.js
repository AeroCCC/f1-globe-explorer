import { neon } from '@neondatabase/serverless'
import { getDatabaseUrl } from './env.js'

let cachedQuery

export function createQuery(connectionString = getDatabaseUrl()) {
  const sql = neon(connectionString)
  return (text, params = []) => sql.query(text, params)
}

export function getQuery() {
  if (!cachedQuery) {
    cachedQuery = createQuery()
  }

  return cachedQuery
}

export async function query(text, params = []) {
  return getQuery()(text, params)
}
