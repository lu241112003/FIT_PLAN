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