// src/models/UserProfile.ts

import { Sexo, Objetivo, Nivel, UserResponse } from './User'

export interface UserProfile {
  id: string
  user_id: string
  sexo: Sexo
  data_nascimento: string
  peso_kg: number
  altura_cm: number
  objetivo: Objetivo
  nivel: Nivel
  dias_disponiveis: number
  tempo_treino_min: number
  criado_em: string
}

export interface RestricaoAlimentar {
  id: string
  user_id: string
  restricao: string
}

export type CreateUserProfileDTO = {
  user_id: string
  sexo: Sexo
  data_nascimento: string
  peso_kg: number
  altura_cm: number
  objetivo: Objetivo
  nivel?: Nivel
  dias_disponiveis?: number
  tempo_treino_min?: number
}

export type UpdateUserProfileDTO = Partial<{
  sexo: Sexo
  data_nascimento: string
  peso_kg: number
  altura_cm: number
  objetivo: Objetivo
  nivel: Nivel
  dias_disponiveis: number
  tempo_treino_min: number
}>

export type CreateRestricaoDTO = {
  user_id: string
  restricao: string
}

export type UserWithProfile = UserResponse & {
  profile: UserProfile | null
  restricoes: RestricaoAlimentar[]
}