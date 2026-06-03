import { extractCircuitId, handleApiRoute, sendSuccess } from '../../../server/http/apiResponse.js'
import { createAiInsightService } from '../../../server/services/aiInsightService.js'

export default function handler(req, res) {
  return handleApiRoute(req, res, ['GET', 'POST'], async () => {
    const service = createAiInsightService()

    if (req.method === 'POST') {
      const result = await service.generateInsight(extractCircuitId(req))
      sendSuccess(res, result.data, result.meta)
      return
    }

    const result = await service.getInsight(extractCircuitId(req))
    sendSuccess(res, result.data, result.meta)
  })
}
