// src/types/workout.ts

export interface Exercise {
  id: string
  nome: string
  descricao: string | null
  grupo_muscular_id: number | null
  equipamento: string | null
  nivel: 'iniciante' | 'intermediario' | 'avancado'
  criado_em: string
}

export interface WorkoutSession {
  id: string
  plano_treino_id: string
  nome: string | null
  dia_semana: string | null
  ordem: number | null
}

export interface WorkoutPlan {
  id: string
  user_id: string
  nome: string | null
  objetivo: string | null
  nivel: string | null
  duracao_semanas: number
  criado_em: string
  sessoes?: WorkoutSession[]
}

export interface WorkoutLog {
  id: string
  user_id: string
  plano_treino_id: string | null
  data_treino: string
  duracao_min: number | null
  observacao: string | null
}
