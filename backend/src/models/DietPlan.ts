import { Objetivo } from './User'

export type TipoRefeicao =
  | 'cafe_manha'
  | 'lanche_manha'
  | 'almoco'
  | 'lanche_tarde'
  | 'jantar'
  | 'ceia'

export interface Alimento {
  id: string
  nome: string
  calorias: number | null
  proteinas_g: number | null
  carboidratos_g: number | null
  gorduras_g: number | null
}

export interface PlanoAlimentar {
  id: string
  user_id: string
  nome: string | null
  objetivo: Objetivo | null
  calorias_alvo: number | null
  criado_em: string
}

export interface Refeicao {
  id: string
  plano_id: string
  tipo: TipoRefeicao | null
  horario: string | null
  ordem: number | null
}

export interface RefeicaoAlimento {
  id: string
  refeicao_id: string
  alimento_id: string
  quantidade_g: number | null
}

export interface ProgressoUsuario {
  id: string
  user_id: string
  data_registro: string
  peso_kg: number | null
  observacao: string | null
}

// Relacionamentos

export type RefeicaoAlimentoComDetalhes = RefeicaoAlimento & {
  alimento: Alimento
  calorias_total: number | null
  proteinas_total: number | null
  carboidratos_total: number | null
  gorduras_total: number | null
}

export type RefeicaoComAlimentos = Refeicao & {
  alimentos: RefeicaoAlimentoComDetalhes[]
  totais: Macros
}

export type PlanoAlimentarCompleto = PlanoAlimentar & {
  refeicoes: RefeicaoComAlimentos[]
  totais_dia: Macros
}

// Tipos auxiliares

export type Macros = {
  calorias: number
  proteinas_g: number
  carboidratos_g: number
  gorduras_g: number
}

// DTOs de criação

export type CreateAlimentoDTO = {
  nome: string
  calorias?: number
  proteinas_g?: number
  carboidratos_g?: number
  gorduras_g?: number
}

export type CreatePlanoAlimentarDTO = {
  user_id: string
  nome?: string
  objetivo?: Objetivo
  calorias_alvo?: number
}

export type CreateRefeicaoDTO = {
  plano_id: string
  tipo?: TipoRefeicao
  horario?: string
  ordem?: number
}

export type CreateRefeicaoAlimentoDTO = {
  refeicao_id: string
  alimento_id: string
  quantidade_g: number
}

export type CreateProgressoDTO = {
  user_id: string
  data_registro: string
  peso_kg?: number
  observacao?: string
}

// DTOs de atualização

export type UpdateAlimentoDTO = Partial<{
  nome: string
  calorias: number
  proteinas_g: number
  carboidratos_g: number
  gorduras_g: number
}>

export type UpdatePlanoAlimentarDTO = Partial<{
  nome: string
  objetivo: Objetivo
  calorias_alvo: number
}>

export type UpdateRefeicaoDTO = Partial<{
  tipo: TipoRefeicao
  horario: string
  ordem: number
}>

export type UpdateRefeicaoAlimentoDTO = Partial<{
  alimento_id: string
  quantidade_g: number
}>

export type UpdateProgressoDTO = Partial<{
  data_registro: string
  peso_kg: number
  observacao: string
}>

// Filtros e relatórios

export type FiltroAlimentoDTO = Partial<{
  nome: string
}>

export type FiltroProgressoDTO = {
  user_id: string
  data_inicio?: string
  data_fim?: string
}

export type EvolucaoPeso = {
  data_registro: string
  peso_kg: number
}