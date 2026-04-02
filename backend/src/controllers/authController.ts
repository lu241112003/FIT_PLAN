// src/controllers/authController.ts

import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'
import { userService } from '../services/userService'
import { ApiError } from '../utils/apiError'

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { nome, email, senha, confirmarSenha } = req.body

      if (!nome || !email || !senha || !confirmarSenha) {
        throw ApiError.badRequest('Nome, email, senha e confirmarSenha são obrigatórios')
      }

      if (senha !== confirmarSenha) {
        throw ApiError.badRequest('As senhas não coincidem')
      }

      if (senha.length < 6) {
        throw ApiError.badRequest('A senha deve ter no mínimo 6 caracteres')
      }

      const { user, token, refreshToken } = await authService.register(nome, email, senha)

      res.status(201).json({
        message: 'Usuário registrado com sucesso',
        token,
        refreshToken,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, senha } = req.body

      if (!email || !senha) {
        throw ApiError.badRequest('Email e senha são obrigatórios')
      }

      const { user, token, refreshToken } = await authService.login(email, senha)

      res.json({
        message: 'Login realizado com sucesso',
        token,
        refreshToken,
        user: {
          id: user.id,
          nome: user.nome,
          email: user.email,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const { senhaAtual, novaSenha, confirmarSenha } = req.body

      if (!senhaAtual || !novaSenha || !confirmarSenha) {
        throw ApiError.badRequest(
          'Senha atual, nova senha e confirmarSenha são obrigatórios'
        )
      }

      if (novaSenha !== confirmarSenha) {
        throw ApiError.badRequest('As nova senhas não coincidem')
      }

      if (novaSenha.length < 6) {
        throw ApiError.badRequest('A nova senha deve ter no mínimo 6 caracteres')
      }

      await authService.changePassword(userId, senhaAtual, novaSenha)

      res.json({
        message: 'Senha alterada com sucesso',
      })
    } catch (error) {
      next(error)
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.userId
      if (!userId) {
        throw ApiError.unauthorized('Usuário não autenticado')
      }

      const user = await userService.getUserById(userId)

      res.json({
        user,
      })
    } catch (error) {
      next(error)
    }
  }
}

export const authController = new AuthController()
