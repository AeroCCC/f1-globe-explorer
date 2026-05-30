import { extractCircuitId, handleApiRoute, sendSuccess } from '../../server/http/apiResponse.js'
import { getCircuitDetail } from '../../server/services/circuitService.js'

export default function handler(req, res) {
  return handleApiRoute(req, res, ['GET'], async () => {
    const result = getCircuitDetail(extractCircuitId(req))
    sendSuccess(res, result.data, result.meta)
  })
}
