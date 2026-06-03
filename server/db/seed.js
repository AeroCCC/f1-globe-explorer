import { circuitSeed } from '../../src/features/circuits/circuitSeed.js'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createCircuitRepository } from '../repositories/circuitRepository.js'
import { query } from './client.js'

export async function seedCircuits(repository = createCircuitRepository(query)) {
  await repository.upsertCircuits(circuitSeed)
  return circuitSeed.length
}

if (resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const count = await seedCircuits()
  console.log(`Seeded ${count} circuit(s).`)
}
