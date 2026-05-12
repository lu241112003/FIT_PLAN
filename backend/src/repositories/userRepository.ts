import supabase from '../config/database'
import { User, CreateUserDTO, UpdateUserDTO } from '../models/User'
import { ApiError } from '../utils/apiError'

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as User
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    return data as User
  }

  async findAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')

    if (error) throw error
    return (data as User[]) || []
  }

  async create(dto: CreateUserDTO): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert([dto])
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw ApiError.conflict('Email já cadastrado')
      }
      throw error
    }

    return data as User
  }

  async update(id: string, dto: UpdateUserDTO): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(dto)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        throw ApiError.conflict('Email já cadastrado')
      }
      throw error
    }

    return data as User
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user !== null
  }
}

export const userRepository = new UserRepository()
