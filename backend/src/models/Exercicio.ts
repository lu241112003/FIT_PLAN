import { Nivel } from './User'

export interface GrupoMuscular {
  id: number
  nome: string
}

export interface Exercicio {
  id: string
  nome: string
  descricao: string | null
  grupo_muscular_id: number | null
  equipamento: string | null
  nivel: Nivel
  criado_em: string
}

export type ExercicioComGrupo = Exercicio & {
  grupo_muscular: GrupoMuscular | null
}

export type CreateExercicioDTO = {
  nome: string
  descricao?: string
  grupo_muscular_id?: number
  equipamento?: string
  nivel?: Nivel
}

export type UpdateExercicioDTO = Partial<{
  nome: string
  descricao: string
  grupo_muscular_id: number
  equipamento: string
  nivel: Nivel
}>

export type FiltroExercicioDTO = Partial<{
  nome: string
  grupo_muscular_id: number
  nivel: Nivel
  equipamento: string
}>