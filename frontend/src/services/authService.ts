// src/services/authService.ts

import api from './api'
import { User, LoginCredentials, RegisterCredentials } from '../types/auth'

export async function login(credentials: LoginCredentials): Promise<{
  user: User
  token: string
  refreshToken: string
}> {
  const { data } = await api.post('/auth/login', credentials)
  return data
}

export async function register(credentials: RegisterCredentials): Promise<{
  user: User
  token: string
  refreshToken: string
}> {
  const { data } = await api.post('/auth/register', credentials)
  return data
}

export async function changePassword(
  senhaAtual: string,
  novaSenha: string,
  confirmarSenha: string
): Promise<void> {
  await api.post('/auth/change-password', {
    senhaAtual,
    novaSenha,
    confirmarSenha,
  })
}

export async function getCurrentUser(): Promise<User> {
  const { data } = await api.get('/auth/me')
  return data.user
}
