// src/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/apiError'
import { verifyToken } from '../utils/generateToken'

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Token não fornecido')
    }

    const token = authHeader.slice(7)
    const decoded = verifyToken(token)

    req.userId = decoded.id
    req.userEmail = decoded.email

    next()
  } catch (error: any) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json({
        error: error.message,
        code: error.code,
      })
    } else {
      res.status(401).json({
        error: 'Token inválido ou expirado',
      })
    }
  }
}

export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.slice(7)
      const decoded = verifyToken(token)

      req.userId = decoded.id
      req.userEmail = decoded.email
    }

    next()
  } catch (error) {
    // Token inválido, continua sem autenticação
    next()
  }
}
