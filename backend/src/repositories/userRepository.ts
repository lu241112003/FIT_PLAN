import { promise } from 'zod'
import supabase from '../config/database'
import {
User,
CreateUserDTO,
UpdateUserDTO,
UserResponse
}
from '../models/User'
import { promises } from 'dns'

export async function findUserById(id: string): Promise<UserResponse | null> {
    const {data, error} = await supabase
    .from('users')
    .select('id, nome, email, criado_em')
    .eq('id', id)
    .single()

    if (error || !data) {
        console.error('Erro ao conectar no banco de dados!')
        return null
    }
    return data as UserResponse
    
}

