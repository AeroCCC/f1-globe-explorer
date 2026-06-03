import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export function loadLocalEnv(filePath = resolve(process.cwd(), '.env.local')) {
  if (!existsSync(filePath)) {
    return {}
  }

  const parsed = {}
  const lines = readFileSync(filePath, 'utf8').split(/\r?\n/)

  for (const line of lines) {
    const match = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)\s*$/)
    if (!match) {
      continue
    }

    const [, key, rawValue] = match
    const value = rawValue.replace(/^['"]|['"]$/g, '')
    parsed[key] = value

    if (!process.env[key]) {
      process.env[key] = value
    }
  }

  return parsed
}

export function getDatabaseUrl() {
  loadLocalEnv()

  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_URL_NON_POOLING

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for database operations')
  }

  return databaseUrl
}
