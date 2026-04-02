// src/utils/generateToken.ts

import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { TokenPayload } from '../types/auth'

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  })
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn,
  })
}

export function verifyToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.jwtSecret) as TokenPayload
  } catch (error) {
    throw new Error('Token inválido ou expirado')
  }
}

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as TokenPayload
  } catch (error) {
    throw new Error('Refresh token inválido ou expirado')
  }
}

export function decode(token: string): TokenPayload | null {
  try {
    return jwt.decode(token) as TokenPayload
  } catch (error) {
    return null
  }
}
