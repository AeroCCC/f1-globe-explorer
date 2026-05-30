import { createErrorBody, createSuccessBody } from '../dto/circuitDto.js'

export class ApiError extends Error {
  constructor(statusCode, code, message, details) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
  }
}

export function sendSuccess(res, data, meta) {
  res.status(200).json(createSuccessBody(data, meta))
}

export function sendError(res, error) {
  const statusCode = error instanceof ApiError ? error.statusCode : 500
  const code = error instanceof ApiError ? error.code : 'INTERNAL_SERVER_ERROR'
  const message = error instanceof ApiError ? error.message : '接口服务暂时不可用'
  const details = error instanceof ApiError ? error.details : undefined

  res.status(statusCode).json(createErrorBody(code, message, details))
}

export function enforceMethod(req, res, allowedMethods) {
  if (allowedMethods.includes(req.method)) {
    return
  }

  res.setHeader('Allow', allowedMethods.join(', '))
  throw new ApiError(405, 'METHOD_NOT_ALLOWED', '当前接口不支持该请求方法', {
    method: req.method,
    allowedMethods,
  })
}

export function extractCircuitId(req) {
  const rawCircuitId = req.query?.circuitId
  return Array.isArray(rawCircuitId) ? rawCircuitId[0] : rawCircuitId
}

export async function handleApiRoute(req, res, allowedMethods, handler) {
  try {
    enforceMethod(req, res, allowedMethods)
    await handler(req, res)
  } catch (error) {
    sendError(res, error)
  }
}
