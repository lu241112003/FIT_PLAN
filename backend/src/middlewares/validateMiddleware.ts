// src/middlewares/validateMiddleware.ts

import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'
import { ApiError } from '../utils/apiError'

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.body)
      req.body = validated
      next()
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        throw ApiError.badRequest('Erro de validação: ' + messages[0].message)
      }
      throw error
    }
  }
}

export function validateQuery(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query)
      req.query = validated as any
      next()
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        throw ApiError.badRequest('Erro de validação: ' + messages[0].message)
      }
      throw error
    }
  }
}

export function validateParams(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.params)
      req.params = validated as any
      next()
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }))
        throw ApiError.badRequest('Erro de validação: ' + messages[0].message)
      }
      throw error
    }
  }
}
