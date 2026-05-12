import {
  PlanoAlimentarCompleto,
  Alimento,
  RefeicaoComAlimentos,
  TipoRefeicao,
} from '../models/DietPlan'

export interface CreateDietRequest {
  nome?: string
  objetivo: 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'manutencao'
  calorias_alvo?: number
}

export interface UpdateDietRequest {
  nome?: string
  objetivo?: 'emagrecimento' | 'hipertrofia' | 'condicionamento' | 'manutencao'
  calorias_alvo?: number
}

export interface AddFoodRequest {
  refeicao_id: string
  alimento_id: string
  quantidade_g: number
}

export interface RemoveFoodRequest {
  refeicao_alimento_id: string
}

export interface CreateMealRequest {
  plano_id: string
  tipo: TipoRefeicao
  horario?: string
  ordem?: number
}

export interface DietResponse {
  id: string
  nome: string | null
  objetivo: string | null
  calorias_alvo: number | null
  refeicoes: RefeicaoComAlimentos[]
  totais_dia: {
    calorias: number
    proteinas_g: number
    carboidratos_g: number
    gorduras_g: number
  }
}

export interface FoodProgressRequest {
  peso_kg: number
  observacao?: string
}

export interface GenerateDietAIRequest {
  nDias?: number
  preferencias?: string
  restricoes?: string[]
}
