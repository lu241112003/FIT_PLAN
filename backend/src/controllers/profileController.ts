import { Request, Response, NextFunction } from 'express'
import { profileService } from '../services/profileService'
import { ApiError } from '../utils/apiError'

export class ProfileController {
  async createOrUpdateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const profileData = req.body

      const profile = await profileService.createOrUpdateProfile(userId, profileData)

      res.status(201).json({
        message: 'Perfil criado/atualizado com sucesso',
        profile,
      })
    } catch (error) {
      next(error)
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const profile = await profileService.getProfile(userId)

      res.json(profile)
    } catch (error) {
      next(error)
    }
  }

  async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      await profileService.deleteProfile(userId)

      res.json({
        message: 'Perfil deletado com sucesso',
      })
    } catch (error) {
      next(error)
    }
  }

  async addFoodRestriction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const { restricao } = req.body

      if (!restricao) {
        throw ApiError.badRequest('Restrição é obrigatória')
      }

      const restriction = await profileService.addFoodRestriction(userId, restricao)

      res.status(201).json({
        message: 'Restrição adicionada com sucesso',
        restriction,
      })
    } catch (error) {
      next(error)
    }
  }

  async getFoodRestrictions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const restrictions = await profileService.getFoodRestrictions(userId)

      res.json(restrictions)
    } catch (error) {
      next(error)
    }
  }

  async removeFoodRestriction(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const { restrictionId } = req.params

      await profileService.removeFoodRestriction(restrictionId)

      res.json({
        message: 'Restrição removida com sucesso',
      })
    } catch (error) {
      next(error)
    }
  }
}

export const profileController = new ProfileController()
