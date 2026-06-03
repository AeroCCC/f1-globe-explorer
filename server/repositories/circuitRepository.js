import { normalizeCircuitDto } from '../dto/circuitDto.js'

const circuitColumns = [
  'circuit_id',
  'name',
  'display_name',
  'grand_prix_name',
  'display_grand_prix_name',
  'short_grand_prix_name',
  'short_display_grand_prix_name',
  'country',
  'display_country',
  'city',
  'region',
  'latitude',
  'longitude',
  'track_type',
  'track_type_label',
  'length_km',
  'turns',
  'first_grand_prprix',
  'is_current_season',
  'tags',
  'overview',
  'characteristics',
]

const selectColumns = circuitColumns
  .map((column) => (column === 'first_grand_prprix' ? 'first_grand_prix' : column))
  .join(', ')

const insertColumns = circuitColumns.map((column) => (column === 'first_grand_prprix' ? 'first_grand_prix' : column))

export function createCircuitRepository(query) {
  return {
    async listCircuits() {
      const rows = await query(
        `SELECT ${selectColumns}
         FROM circuits
         ORDER BY is_current_season DESC, region ASC, display_grand_prix_name ASC`,
      )
      return rows.map(mapCircuitRowToDto)
    },

    async getCircuitById(circuitId) {
      const rows = await query(
        `SELECT ${selectColumns}
         FROM circuits
         WHERE circuit_id = $1
         LIMIT 1`,
        [circuitId],
      )
      return rows[0] ? mapCircuitRowToDto(rows[0]) : null
    },

    async upsertCircuits(circuits) {
      for (const circuit of circuits) {
        const row = mapCircuitToRow(circuit)
        const params = insertColumns.map((column) => row[column])
        const placeholders = params.map((_, index) => `$${index + 1}`).join(', ')

        await query(
          `INSERT INTO circuits (${insertColumns.join(', ')})
           VALUES (${placeholders})
           ON CONFLICT (circuit_id) DO UPDATE SET
             name = EXCLUDED.name,
             display_name = EXCLUDED.display_name,
             grand_prix_name = EXCLUDED.grand_prix_name,
             display_grand_prix_name = EXCLUDED.display_grand_prix_name,
             short_grand_prix_name = EXCLUDED.short_grand_prix_name,
             short_display_grand_prix_name = EXCLUDED.short_display_grand_prix_name,
             country = EXCLUDED.country,
             display_country = EXCLUDED.display_country,
             city = EXCLUDED.city,
             region = EXCLUDED.region,
             latitude = EXCLUDED.latitude,
             longitude = EXCLUDED.longitude,
             track_type = EXCLUDED.track_type,
             track_type_label = EXCLUDED.track_type_label,
             length_km = EXCLUDED.length_km,
             turns = EXCLUDED.turns,
             first_grand_prix = EXCLUDED.first_grand_prix,
             is_current_season = EXCLUDED.is_current_season,
             tags = EXCLUDED.tags,
             overview = EXCLUDED.overview,
             characteristics = EXCLUDED.characteristics,
             updated_at = NOW()`,
          params,
        )
      }
    },
  }
}

export function mapCircuitToRow(circuit) {
  return {
    circuit_id: circuit.circuitId,
    name: circuit.name,
    display_name: circuit.displayName,
    grand_prix_name: circuit.grandPrixName,
    display_grand_prix_name: circuit.displayGrandPrixName,
    short_grand_prix_name: circuit.shortGrandPrixName,
    short_display_grand_prix_name: circuit.shortDisplayGrandPrixName,
    country: circuit.country,
    display_country: circuit.displayCountry,
    city: circuit.city,
    region: circuit.region,
    latitude: circuit.latitude,
    longitude: circuit.longitude,
    track_type: circuit.trackType,
    track_type_label: circuit.trackTypeLabel,
    length_km: circuit.lengthKm,
    turns: circuit.turns,
    first_grand_prix: circuit.firstGrandPrix,
    is_current_season: circuit.isCurrentSeason,
    tags: JSON.stringify(circuit.tags ?? []),
    overview: circuit.overview,
    characteristics: JSON.stringify(circuit.characteristics ?? []),
  }
}

export function mapCircuitRowToDto(row) {
  return normalizeCircuitDto({
    circuitId: row.circuit_id,
    name: row.name,
    displayName: row.display_name,
    grandPrixName: row.grand_prix_name,
    displayGrandPrixName: row.display_grand_prix_name,
    shortGrandPrixName: row.short_grand_prix_name,
    shortDisplayGrandPrixName: row.short_display_grand_prix_name,
    country: row.country,
    displayCountry: row.display_country,
    city: row.city,
    region: row.region,
    latitude: row.latitude,
    longitude: row.longitude,
    trackType: row.track_type,
    trackTypeLabel: row.track_type_label,
    lengthKm: Number(row.length_km),
    turns: row.turns,
    firstGrandPrix: row.first_grand_prix,
    isCurrentSeason: row.is_current_season,
    tags: parseJsonArray(row.tags),
    overview: row.overview,
    characteristics: parseJsonArray(row.characteristics),
  })
}

function parseJsonArray(value) {
  if (Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    return JSON.parse(value)
  }

  return []
}
