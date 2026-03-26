import  {supabase} from './config/database'
import {
UserProfile,
RestricaoAlimentar,
CreateUserProfileDTO,
UpdateUserProfileDTO,
CreateRestricaoDTO
from './models/UserProfile'

export async function FindByUserProfile(id: string): Promisse<UserProfile | null> {
  const {data , error} = await supabase
  .from('userProfile')
  .select('id,
          sexo,
          data_nascimento,
          peso_kg,
          altura_cm,
          objetivo,
          nivel,
          dias_disponiveis,
          tempo_treino_min,
          criado_em')
  .eq('id',id)
  .single()

  if (error || !data) {
    console.log("Não foi possível se conectar ao banco de dados")
    return null
  }

  return data as UserProfile
}

export async function DeleteByUserProfile(dto: id): Promisse<UserProfile | null> {
  const {data, error} = await supabase 
  .from('userProfile')
  .delete('id,
          sexo,
          data_nascimento,
          peso_kg,
          altura_cm,
          objetivo,
          nivel,
          dias_disponiveis,
          tempo_treino_min,
          criado_em'
         )
  .eq(dto)
  .single()
}

if (error || !data) {
  console.log("Não foi possível se conectar ao banco de dados!")
}
