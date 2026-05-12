export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message)
    this.name = 'ApiError'
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static badRequest(message: string, code?: string): ApiError {
    return new ApiError(400, message, code)
  }

  static unauthorized(message: string = 'Não autorizado', code?: string): ApiError {
    return new ApiError(401, message, code)
  }

  static forbidden(message: string = 'Acesso forbidden', code?: string): ApiError {
    return new ApiError(403, message, code)
  }

  static notFound(message: string, code?: string): ApiError {
    return new ApiError(404, message, code)
  }

  static conflict(message: string, code?: string): ApiError {
    return new ApiError(409, message, code)
  }

  static unprocessableEntity(message: string, code?: string): ApiError {
    return new ApiError(422, message, code)
  }

  static internalServerError(message: string = 'Erro interno do servidor', code?: string): ApiError {
    return new ApiError(500, message, code)
  }

  static serviceUnavailable(message: string = 'Serviço indisponível', code?: string): ApiError {
    return new ApiError(503, message, code)
  }
}
