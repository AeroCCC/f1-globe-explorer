const DEFAULT_INSIGHT_TYPE = 'track_summary'

export function createAiInsightRepository(query) {
  return {
    async getInsight(circuitId, insightType = DEFAULT_INSIGHT_TYPE) {
      const rows = await query(
        `SELECT circuit_id, insight_type, content, model_name, created_at
         FROM ai_insights
         WHERE circuit_id = $1 AND insight_type = $2
         LIMIT 1`,
        [circuitId, insightType],
      )
      return rows[0] ? mapAiInsightRowToDto(rows[0]) : null
    },

    async upsertInsight({ circuitId, insightType = DEFAULT_INSIGHT_TYPE, content, modelName }) {
      const rows = await query(
        `INSERT INTO ai_insights (circuit_id, insight_type, content, model_name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (circuit_id, insight_type) DO UPDATE SET
           content = EXCLUDED.content,
           model_name = EXCLUDED.model_name,
           updated_at = NOW()
         RETURNING circuit_id, insight_type, content, model_name, created_at`,
        [circuitId, insightType, JSON.stringify(content), modelName],
      )
      return rows[0] ? mapAiInsightRowToDto(rows[0]) : null
    },
  }
}

export function mapAiInsightRowToDto(row) {
  return {
    circuitId: row.circuit_id,
    insightType: row.insight_type,
    content: parseJsonObject(row.content),
    modelName: row.model_name,
    createdAt: normalizeDate(row.created_at),
  }
}

function parseJsonObject(value) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value
  }

  if (typeof value === 'string') {
    return JSON.parse(value)
  }

  return {}
}

function normalizeDate(value) {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return value
}
