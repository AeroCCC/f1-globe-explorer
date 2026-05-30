import { extractCircuitId, handleApiRoute, sendSuccess } from '../../../server/http/apiResponse.js'
import { getCircuitCalendar } from '../../../server/services/circuitService.js'

export default function handler(req, res) {
  return handleApiRoute(req, res, ['GET'], async () => {
    const result = getCircuitCalendar(extractCircuitId(req), req.query?.season)
    sendSuccess(res, result.data, result.meta)
  })
}
