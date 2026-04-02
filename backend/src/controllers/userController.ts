// src/controllers/userController.ts

import { Request, Response, NextFunction } from 'express'
import { userService } from '../services/userService'
import { ApiError } from '../utils/apiError'

export class UserController {
  async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const user = await userService.getUserById(userId)

      res.json(user)
    } catch (error) {
      next(error)
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const { nome, email } = req.body

      const user = await userService.updateUser(userId, { nome, email })

      res.json({
        message: 'Usuário atualizado com sucesso',
        user,
      })
    } catch (error) {
      next(error)
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      await userService.deleteUser(userId)

      res.json({
        message: 'Usuário deletado com sucesso',
      })
    } catch (error) {
      next(error)
    }
  }

  async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const stats = await userService.getUserStats(userId)

      res.json(stats)
    } catch (error) {
      next(error)
    }
  }
}

export const userController = new UserController()
