<<<<<<< HEAD
import supabase from '../config/database'
import {
    UserProfile,
    RestricaoAlimentar,
    CreateRestricaoDTO,
    UpdateUserProfileDTO,
    CreateUserProfileDTO,
    UserWithProfile
} from '../models/UserProfile'


export async function FindByUserProfile(id:string): Promise<UserWithProfile | null> {
    const {data, error} = await supabase
    .from('users')
    .select('id', 'nome', 'email', 'criado_em')
    .eq('id',id)
    .single()

    if (error || data) {
        console.log("Não foi possível completar essa ação")
    }
    
    return data as UserWithProfile
}
=======
import { error } from 'console'
import supabase from '../config/database'
import {
  UserProfile,
  RestricaoAlimentar,
  CreateUserProfileDTO,
  UpdateUserProfileDTO,
  CreateRestricaoDTO
} from '../models/UserProfile'

export async function FindByUserProfile(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('userProfile')
    .select('id, sexo, data_nascimento, peso_kg, altura_cm, objetivo, nivel, dias_disponiveis, tempo_treino_min, criado_em')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.log("Não foi possível se conectar ao banco de dados")
    return null
  }

  return data as UserProfile
}

export async function DeleteByUserProfile(id: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('userProfile')
    .delete()
    .eq('id', id)
    .single()

  if (error || !data) {
    console.log("Não foi possível se conectar ao banco de dados!")
    return null
  }

  return data as UserProfile
}

export async function UpdateByUserProfile(id: string): Promise<UserProfile | null> {
  const {data, error} = await supabase
  .from('UserProfile')
  .eq('id', id )
  .single()
  if (error || !data) {
    console.log("Não foi possível se conectar com o banco de dados!")
    return null
  }
  return data as UserProfile
  
}
>>>>>>> fe2612a5a370ff67b7722107fd195ed7157a0d39
