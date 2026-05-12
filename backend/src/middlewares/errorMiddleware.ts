import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiError'

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Erro:', err)

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    })
    return
  }

  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    res.status(400).json({
      error: 'Erro de validação',
      details: err.errors || err.message,
    })
    return
  }

  res.status(500).json({
    error: 'Erro interno do servidor',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Um erro inesperado ocorreu',
  })
}
