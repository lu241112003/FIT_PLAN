export type Sexo = 'masculino' | 'feminino' | 'outro'

export type Objetivo =
  | 'emagrecimento'
  | 'hipertrofia'
  | 'condicionamento'
  | 'manutencao'

export type Nivel = 'iniciante' | 'intermediario' | 'avancado'

export interface User {
  id: string
  nome: string
  email: string
  senha_hash: string
  criado_em: string
}

export type CreateUserDTO = {
  nome: string
  email: string
  senha_hash: string
}

export type UpdateUserDTO = Partial<{
  nome: string
  email: string
  senha_hash: string
}>

export type UserResponse = Omit<User, 'senha_hash'>