import { extractCircuitId, handleApiRoute, sendSuccess } from '../../../server/http/apiResponse.js'
import { createCircuitAiInsight, getCircuitAiInsight } from '../../../server/services/circuitService.js'

export default function handler(req, res) {
  return handleApiRoute(req, res, ['GET', 'POST'], async () => {
    if (req.method === 'POST') {
      createCircuitAiInsight(extractCircuitId(req))
      return
    }

    const result = getCircuitAiInsight(extractCircuitId(req))
    sendSuccess(res, result.data, result.meta)
  })
}
