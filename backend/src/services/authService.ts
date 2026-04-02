// src/services/authService.ts

import { User } from '../models/User'
import { userRepository } from '../repositories/userRepository'
import { hashPassword, comparePassword } from '../utils/hashPassword'
import { generateToken, generateRefreshToken } from '../utils/generateToken'
import { ApiError } from '../utils/apiError'

export class AuthService {
  async register(nome: string, email: string, senha: string): Promise<{ user: User; token: string; refreshToken: string }> {
    // Validar se email já existe
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      throw ApiError.conflict('Email já cadastrado')
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha)

    // Criar usuário
    const user = await userRepository.create({
      nome,
      email,
      senha_hash: senhaHash,
    })

    // Gerar tokens
    const token = generateToken({ id: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

    return { user, token, refreshToken }
  }

  async login(email: string, senha: string): Promise<{ user: User; token: string; refreshToken: string }> {
    // Buscar usuário
    const user = await userRepository.findByEmail(email)
    if (!user) {
      throw ApiError.unauthorized('Email ou senha inválidos')
    }

    // Validar senha
    const isPasswordCorrect = await comparePassword(senha, user.senha_hash)
    if (!isPasswordCorrect) {
      throw ApiError.unauthorized('Email ou senha inválidos')
    }

    // Gerar tokens
    const token = generateToken({ id: user.id, email: user.email })
    const refreshToken = generateRefreshToken({ id: user.id, email: user.email })

    return { user, token, refreshToken }
  }

  async changePassword(userId: string, senhaAtual: string, novaSenha: string): Promise<void> {
    // Buscar usuário
    const user = await userRepository.findById(userId)
    if (!user) {
      throw ApiError.notFound('Usuário não encontrado')
    }

    // Validar senha atual
    const isPasswordCorrect = await comparePassword(senhaAtual, user.senha_hash)
    if (!isPasswordCorrect) {
      throw ApiError.unauthorized('Senha atual incorreta')
    }

    // Hash da nova senha
    const novaSehaHash = await hashPassword(novaSenha)

    // Atualizar senha
    await userRepository.update(userId, {
      senha_hash: novaSehaHash,
    })
  }
}

export const authService = new AuthService()
