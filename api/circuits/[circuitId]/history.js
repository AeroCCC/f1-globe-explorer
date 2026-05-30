import { extractCircuitId, handleApiRoute, sendSuccess } from '../../../server/http/apiResponse.js'
import { getCircuitHistory } from '../../../server/services/circuitService.js'

export default function handler(req, res) {
  return handleApiRoute(req, res, ['GET'], async () => {
    const result = getCircuitHistory(extractCircuitId(req))
    sendSuccess(res, result.data, result.meta)
  })
}
