import supabase from '../config/database'
import {
  PlanoTreino,
  SessaoTreino,
  SessaoExercicio,
  TreinoRealizado,
} from '../models/WorkoutPlan'
import { Exercicio } from '../models/Exercicio'

export class WorkoutRepository {
  // Planos de treino
  async getPlanById(planId: string): Promise<PlanoTreino | null> {
    const { data, error } = await supabase
      .from('planos_treino')
      .select('*')
      .eq('id', planId)
      .single()

    if (error) return error.code === 'PGRST116' ? null : (() => { throw error })()
    return data as PlanoTreino
  }

  async getUserPlans(userId: string): Promise<PlanoTreino[]> {
    const { data, error } = await supabase
      .from('planos_treino')
      .select('*')
      .eq('user_id', userId)
      .order('criado_em', { ascending: false })

    if (error) throw error
    return (data as PlanoTreino[]) || []
  }

  async createPlan(plan: Partial<PlanoTreino>): Promise<PlanoTreino> {
    const { data, error } = await supabase
      .from('planos_treino')
      .insert([plan])
      .select()
      .single()

    if (error) throw error
    return data as PlanoTreino
  }

  async updatePlan(planId: string, updates: Partial<PlanoTreino>): Promise<PlanoTreino> {
    const { data, error } = await supabase
      .from('planos_treino')
      .update(updates)
      .eq('id', planId)
      .select()
      .single()

    if (error) throw error
    return data as PlanoTreino
  }

  async deletePlan(planId: string): Promise<void> {
    const { error } = await supabase
      .from('planos_treino')
      .delete()
      .eq('id', planId)

    if (error) throw error
  }

  // Sessões de treino
  async getSessionsByPlan(planId: string): Promise<SessaoTreino[]> {
    const { data, error } = await supabase
      .from('sessoes_treino')
      .select('*')
      .eq('plano_treino_id', planId)
      .order('ordem', { ascending: true })

    if (error) throw error
    return (data as SessaoTreino[]) || []
  }

  async createSession(session: Partial<SessaoTreino>): Promise<SessaoTreino> {
    const { data, error } = await supabase
      .from('sessoes_treino')
      .insert([session])
      .select()
      .single()

    if (error) throw error
    return data as SessaoTreino
  }

  async deleteSession(sessionId: string): Promise<void> {
    const { error } = await supabase
      .from('sessoes_treino')
      .delete()
      .eq('id', sessionId)

    if (error) throw error
  }

  // Exercícios em sessões
  async addExerciseToSession(
    sessionExercise: Partial<SessaoExercicio>
  ): Promise<SessaoExercicio> {
    const { data, error } = await supabase
      .from('sessoes_exercicios')
      .insert([sessionExercise])
      .select()
      .single()

    if (error) throw error
    return data as SessaoExercicio
  }

  async removeExerciseFromSession(sessionExerciseId: string): Promise<void> {
    const { error } = await supabase
      .from('sessoes_exercicios')
      .delete()
      .eq('id', sessionExerciseId)

    if (error) throw error
  }

  async getSessionExercises(sessionId: string): Promise<SessaoExercicio[]> {
    const { data, error } = await supabase
      .from('sessoes_exercicios')
      .select('*')
      .eq('sessao_id', sessionId)
      .order('ordem', { ascending: true })

    if (error) throw error
    return (data as SessaoExercicio[]) || []
  }

  // Exercícios
  async getAllExercises(): Promise<Exercicio[]> {
    const { data, error } = await supabase
      .from('exercicios')
      .select('*')
      .order('nome')

    if (error) throw error
    return (data as Exercicio[]) || []
  }

  async getExerciseById(exerciseId: string): Promise<Exercicio | null> {
    const { data, error } = await supabase
      .from('exercicios')
      .select('*')
      .eq('id', exerciseId)
      .single()

    if (error) return error.code === 'PGRST116' ? null : (() => { throw error })()
    return data as Exercicio
  }

  async filterExercises(filters: {
    nivel?: string
    grupo_muscular_id?: number
    equipamento?: string
  }): Promise<Exercicio[]> {
    let query = supabase.from('exercicios').select('*')

    if (filters.nivel) query = query.eq('nivel', filters.nivel)
    if (filters.grupo_muscular_id) query = query.eq('grupo_muscular_id', filters.grupo_muscular_id)
    if (filters.equipamento) query = query.eq('equipamento', filters.equipamento)

    const { data, error } = await query.order('nome')

    if (error) throw error
    return (data as Exercicio[]) || []
  }

  // Treinos realizados
  async registerWorkout(workout: Partial<TreinoRealizado>): Promise<TreinoRealizado> {
    const { data, error } = await supabase
      .from('treinos_realizados')
      .insert([workout])
      .select()
      .single()

    if (error) throw error
    return data as TreinoRealizado
  }

  async getUserWorkouts(userId: string, limit: number = 30): Promise<TreinoRealizado[]> {
    const { data, error } = await supabase
      .from('treinos_realizados')
      .select('*')
      .eq('user_id', userId)
      .order('data_treino', { ascending: false })
      .limit(limit)

    if (error) throw error
    return (data as TreinoRealizado[]) || []
  }

  async getWorkoutById(workoutId: string): Promise<TreinoRealizado | null> {
    const { data, error } = await supabase
      .from('treinos_realizados')
      .select('*')
      .eq('id', workoutId)
      .single()

    if (error) return error.code === 'PGRST116' ? null : (() => { throw error })()
    return data as TreinoRealizado
  }
}

export const workoutRepository = new WorkoutRepository()
