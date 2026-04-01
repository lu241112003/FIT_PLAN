import supabase from '../config/database'
import {
<<<<<<< HEAD
User,
CreateUserDTO,
UpdateUserDTO,
UserResponse
}
from '../models/User'
import { promises } from 'dns'
import { id } from 'zod/v4/locales/index.js'
=======
  User,
  CreateUserDTO,
  UpdateUserDTO,
  UserResponse
} from '../models/User'
>>>>>>> fe2612a5a370ff67b7722107fd195ed7157a0d39

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

<<<<<<< HEAD
export async function updateByUser(id:string): Promise<UserResponse | null> {
    const {data, error} = await supabase
    .from('users')
    .update({ nome: 'Novo Nome' })
=======
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
>>>>>>> fe2612a5a370ff67b7722107fd195ed7157a0d39
    .eq('id', id)
    .select('id, nome, email, criado_em')
    .single()

<<<<<<< HEAD
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
=======
  if (error || !data) {
    console.error('Não foi possível deletar o usuário:', error)
    return null
  }

  return data as UserResponse
}
>>>>>>> fe2612a5a370ff67b7722107fd195ed7157a0d39
