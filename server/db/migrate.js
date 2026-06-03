import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { query } from './client.js'

const currentDir = dirname(fileURLToPath(import.meta.url))
const migrationsDir = join(currentDir, 'migrations')

export function splitSqlStatements(sql) {
  return sql
    .split(';')
    .map((statement) => statement.trim())
    .filter(Boolean)
}

export async function runMigrations(queryFn = query) {
  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort((a, b) => a.localeCompare(b))

  for (const file of migrationFiles) {
    const sql = readFileSync(join(migrationsDir, file), 'utf8')
    for (const statement of splitSqlStatements(sql)) {
      await queryFn(statement)
    }
  }

  return migrationFiles
}

if (resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const migrationFiles = await runMigrations()
  console.log(`Applied ${migrationFiles.length} migration file(s).`)
}
