// src/types/auth.ts

export interface TokenPayload {
  id: string
  email: string
  iat?: number
  exp?: number
}

export interface AuthRequest {
  email: string
  senha: string
}

export interface AuthResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    nome: string
  }
}

export interface LoginResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    email: string
    nome: string
  }
}

export interface RegisterRequest {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface ChangePasswordRequest {
  senhaAtual: string
  novaSenha: string
  confirmarSenha: string
}
