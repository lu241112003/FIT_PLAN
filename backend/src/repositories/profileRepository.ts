


import supabase from '../config/database'
import {
  UserProfile,
  CreateUserProfileDTO,
  UpdateUserProfileDTO,
  RestricaoAlimentar,
  CreateRestricaoDTO,
} from '../models/UserProfile'
import { ApiError } from '../utils/apiError'

export class ProfileRepository {
  async findByUserId(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as UserProfile
  }

  async create(dto: CreateUserProfileDTO): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([dto])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw ApiError.conflict('Perfil já existe para este usuário')
      }
      throw error
    }

    return data as UserProfile
  }

  async update(userId: string, dto: UpdateUserProfileDTO): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(dto)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data as UserProfile
  }

  async delete(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_profiles')
      .delete()
      .eq('user_id', userId)

    if (error) throw error
  }

  // Restrições alimentares
  async addRestriction(dto: CreateRestricaoDTO): Promise<RestricaoAlimentar> {
    const { data, error } = await supabase
      .from('restricoes_alimentares')
      .insert([dto])
      .select()
      .single()

    if (error) throw error
    return data as RestricaoAlimentar
  }

  async getRestrictions(userId: string): Promise<RestricaoAlimentar[]> {
    const { data, error } = await supabase
      .from('restricoes_alimentares')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error
    return (data as RestricaoAlimentar[]) || []
  }

  async removeRestriction(restrictionId: string): Promise<void> {
    const { error } = await supabase
      .from('restricoes_alimentares')
      .delete()
      .eq('id', restrictionId)

    if (error) throw error
  }
}

export const profileRepository = new ProfileRepository()
