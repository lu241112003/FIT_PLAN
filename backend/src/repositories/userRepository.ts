import supabase from '../config/database'
import {
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserResponse
} from '../models/User'

export async function findUserById(id: string): Promise<UserResponse | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, nome, email, criado_em')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Erro ao buscar usuário no banco de dados!')
    return null
  }

  return data as UserResponse
}

export async function createUser(dto: CreateUserDTO): Promise<UserResponse | null> {
  const { data, error } = await supabase
    .from('users')
    .insert(dto)
    .select('id, nome, email, criado_em')
    .single()

  if (error || !data) {
    console.error('Não foi possível criar o usuário:', error)
    return null
  }

  return data as UserResponse
}

export async function deleteUserById(id: string): Promise<UserResponse | null> {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
    .select('id, nome, email, criado_em')
    .single()

  if (error || !data) {
    console.error('Não foi possível deletar o usuário:', error)
    return null
  }

  return data as UserResponse
}
