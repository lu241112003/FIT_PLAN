// src/repositories/templateRepository.ts

import supabase from '../config/database'
import { Exercicio, GrupoMuscular } from '../models/Exercicio'
import { ApiError } from '../utils/apiError'

export class TemplateRepository {
  // Grupos musculares
  async getAllMuscleGroups(): Promise<GrupoMuscular[]> {
    const { data, error } = await supabase
      .from('grupos_musculares')
      .select('*')
      .order('nome')

    if (error) throw error
    return (data as GrupoMuscular[]) || []
  }

  async getMuscleGroupById(id: number): Promise<GrupoMuscular | null> {
    const { data, error } = await supabase
      .from('grupos_musculares')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return error.code === 'PGRST116' ? null : (() => { throw error })()
    return data as GrupoMuscular
  }

  // Exercícios
  async getExercisesByMuscleGroup(muscleGroupId: number): Promise<Exercicio[]> {
    const { data, error } = await supabase
      .from('exercicios')
      .select('*')
      .eq('grupo_muscular_id', muscleGroupId)
      .order('nome')

    if (error) throw error
    return (data as Exercicio[]) || []
  }

  async getExercisesByLevel(level: 'iniciante' | 'intermediario' | 'avancado'): Promise<Exercicio[]> {
    const { data, error } = await supabase
      .from('exercicios')
      .select('*')
      .eq('nivel', level)
      .order('nome')

    if (error) throw error
    return (data as Exercicio[]) || []
  }

  async searchExercises(searchTerm: string): Promise<Exercicio[]> {
    const { data, error } = await supabase
      .from('exercicios')
      .select('*')
      .ilike('nome', `%${searchTerm}%`)
      .limit(20)

    if (error) throw error
    return (data as Exercicio[]) || []
  }

  async createExercise(exercise: Partial<Exercicio>): Promise<Exercicio> {
    const { data, error } = await supabase
      .from('exercicios')
      .insert([exercise])
      .select()
      .single()

    if (error) throw error
    return data as Exercicio
  }

  async updateExercise(exerciseId: string, updates: Partial<Exercicio>): Promise<Exercicio> {
    const { data, error } = await supabase
      .from('exercicios')
      .update(updates)
      .eq('id', exerciseId)
      .select()
      .single()

    if (error) throw error
    return data as Exercicio
  }

  async deleteExercise(exerciseId: string): Promise<void> {
    const { error } = await supabase
      .from('exercicios')
      .delete()
      .eq('id', exerciseId)

    if (error) throw error
  }
}

export const templateRepository = new TemplateRepository()
