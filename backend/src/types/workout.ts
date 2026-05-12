import {
  PlanoTreinoCompleto,
  SessaoTreinoComExercicios,
} from '../models/WorkoutPlan'
import { Exercicio } from '../models/Exercicio'

export interface CreateWorkoutRequest {
  nome?: string
  objetivo?: 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'manutencao'
  nivel?: 'iniciante' | 'intermediario' | 'avancado'
  duracao_semanas?: number
}

export interface UpdateWorkoutRequest {
  nome?: string
  objetivo?: 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'manutencao'
  nivel?: 'iniciante' | 'intermediario' | 'avancado'
  duracao_semanas?: number
}

export interface CreateSessionRequest {
  plano_treino_id: string
  nome?: string
  dia_semana?:
    | 'segunda'
    | 'terca'
    | 'quarta'
    | 'quinta'
    | 'sexta'
    | 'sabado'
    | 'domingo'
  ordem?: number
}

export interface AddExerciseRequest {
  sessao_id: string
  exercicio_id: string
  series: number
  repeticoes: string
  descanso_s?: number
  ordem?: number
}

export interface RegisterTrainingRequest {
  plano_treino_id?: string
  duracao_min?: number
  observacao?: string
}

export interface WorkoutResponse {
  id: string
  nome: string | null
  objetivo: string | null
  nivel: string | null
  duracao_semanas: number
  sessoes: SessaoTreinoComExercicios[]
}

export interface GenerateWorkoutAIRequest {
  dias_disponiveis?: number
  tempo_treino_min?: number
  equipamentos?: string[]
  restricoes?: string[]
}

export interface ExerciseFilterRequest {
  nome?: string
  grupo_muscular_id?: number
  nivel?: 'iniciante' | 'intermediario' | 'avancado'
  equipamento?: string
}
