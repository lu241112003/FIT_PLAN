import supabase from '../config/database'
import {
User,
CreateUserDTO,
UpdateUserDTO,
UserResponse
}
from '../models/User'
import { promises } from 'dns'
import { id } from 'zod/v4/locales/index.js'

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

export async function updateByUser(id:string): Promise<UserResponse | null> {
    const {data, error} = await supabase
    .from('users')
    .update({ nome: 'Novo Nome' })
    .eq('id', id)
    .select('id, nome, email, criado_em')
    .single()

    if (error || !data) {
        console.error('Erro ao conectar no banco de dados!')
        return null
    }

    return data as UserResponse
}

export async function CreateByUser(id:string): Promise<UserResponse | null> {
    const {data, error} = await supabase
    .from('users')
    .insert({ nome: 'Novo Nome', email: 'novoemail@example.com' })
    .select('id, nome, email, criado_em')
    .single()

    if (error || !data) {
        console.error('Erro ao conectar no banco de dados!')
        return null
    }

    return data as UserResponse
}

export async function DeleteByUser(id:string): Promise<UserResponse | null> {
    const {data, error} = await supabase
    .delete('id, nome, email, criado_em')
    .single()

    if (error || !data) {
        console.error('Erro ao conectar no banco de dados!')
        return null
    }
    return data as User
}
