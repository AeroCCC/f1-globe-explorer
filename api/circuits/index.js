import { handleApiRoute, sendSuccess } from '../../server/http/apiResponse.js'
import { listCircuits } from '../../server/services/circuitService.js'

export default function handler(req, res) {
  return handleApiRoute(req, res, ['GET'], async () => {
    const result = listCircuits()
    sendSuccess(res, result.data, result.meta)
  })
}
