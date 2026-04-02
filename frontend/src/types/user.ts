// src/types/user.ts

export interface UserProfile {
  id: string
  user_id: string
  sexo: 'masculino' | 'feminino' | 'outro'
  data_nascimento: string
  peso_kg: number
  altura_cm: number
  objetivo: 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'manutencao'
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  dias_disponiveis: number
  tempo_treino_min: number
  criado_em: string
  imc?: number
  imcCategory?: string
  idade?: number
  tmb?: number
  tdee?: number
}

export interface FoodRestriction {
  id: string
  user_id: string
  restricao: string
}

export interface UserStats {
  user: {
    id: string
    nome: string
    email: string
  }
  profile: UserProfile | null
}
