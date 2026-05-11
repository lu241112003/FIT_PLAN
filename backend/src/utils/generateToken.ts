// src/utils/generateToken.ts

import jwt, { Secret, SignOptions } from 'jsonwebtoken'
import { env } from '../config/env'
import { TokenPayload } from '../types/auth'

export function generateToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as any,
  }
  return jwt.sign(payload, env.jwtSecret as Secret, options)
}

export function generateRefreshToken(payload: TokenPayload): string {
  const options: SignOptions = {
    expiresIn: env.jwtRefreshExpiresIn as any,
  }
  return jwt.sign(payload, env.jwtRefreshSecret as Secret, options)
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
