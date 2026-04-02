// src/config/database-mock.ts
// Mock Supabase client para modo desenvolvimento (em memoria)

import { randomUUID } from 'crypto'

type Row = Record<string, any>

const now = () => new Date().toISOString()

const mockDatabase: Record<string, Row[]> = {
  users: [
    {
      id: 'admin-user-uuid',
      nome: 'Admin FitPlan',
      email: 'admin@fitplan.com',
      // Hash bcrypt de admin123
      senha_hash: '$2a$10$bVAX1lBQF949gth/XtZ99u7hadsd8rLhJlwgh1UGtfEghUs3IViT.',
      criado_em: now(),
    },
  ],
  user_profiles: [],
  restricoes_alimentares: [],
  planos_alimentares: [],
  refeicoes: [],
  refeicao_alimentos: [],
  alimentos: [
    { id: randomUUID(), nome: 'Frango grelhado', calorias: 165, proteinas_g: 31, carboidratos_g: 0, gorduras_g: 3.6 },
    { id: randomUUID(), nome: 'Arroz integral', calorias: 124, proteinas_g: 2.6, carboidratos_g: 25.8, gorduras_g: 1 },
    { id: randomUUID(), nome: 'Banana', calorias: 89, proteinas_g: 1.1, carboidratos_g: 22.8, gorduras_g: 0.3 },
  ],
  progresso_usuario: [],
  planos_treino: [],
  sessoes_treino: [],
  sessoes_exercicios: [],
  exercicios: [
    { id: randomUUID(), nome: 'Supino reto', descricao: 'Peito', grupo_muscular_id: 1, equipamento: 'barra', nivel: 'intermediario', criado_em: now() },
    { id: randomUUID(), nome: 'Agachamento livre', descricao: 'Pernas', grupo_muscular_id: 2, equipamento: 'barra', nivel: 'intermediario', criado_em: now() },
    { id: randomUUID(), nome: 'Remada curvada', descricao: 'Costas', grupo_muscular_id: 3, equipamento: 'barra', nivel: 'iniciante', criado_em: now() },
  ],
  treinos_realizados: [],
}

function getTable(table: string): Row[] {
  if (!mockDatabase[table]) {
    mockDatabase[table] = []
  }
  return mockDatabase[table]
}

class SelectQuery {
  private filters: Array<(row: Row) => boolean> = []
  private sortBy: { column: string; ascending: boolean } | null = null
  private limitBy: number | null = null

  constructor(private table: string) {}

  eq(column: string, value: any): this {
    this.filters.push((row) => row[column] === value)
    return this
  }

  ilike(column: string, value: string): this {
    const search = value.replace(/%/g, '').toLowerCase()
    this.filters.push((row) => String(row[column] || '').toLowerCase().includes(search))
    return this
  }

  order(column: string, options?: { ascending?: boolean }): this {
    this.sortBy = { column, ascending: options?.ascending !== false }
    return this
  }

  limit(value: number): this {
    this.limitBy = value
    return this
  }

  private executeRows(): Row[] {
    let rows = [...getTable(this.table)]
    for (const predicate of this.filters) {
      rows = rows.filter(predicate)
    }

    if (this.sortBy) {
      const { column, ascending } = this.sortBy
      rows.sort((a, b) => {
        const av = a[column]
        const bv = b[column]
        if (typeof av === 'string' && typeof bv === 'string') {
          return ascending ? av.localeCompare(bv) : bv.localeCompare(av)
        }
        if (av === bv) return 0
        return ascending ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1)
      })
    }

    if (this.limitBy !== null) {
      rows = rows.slice(0, this.limitBy)
    }

    return rows
  }

  async single(): Promise<{ data: Row | null; error: any }> {
    const rows = this.executeRows()
    if (!rows.length) {
      return { data: null, error: { code: 'PGRST116', message: 'No rows found' } }
    }
    return { data: rows[0], error: null }
  }

  then(onFulfilled?: any, onRejected?: any): Promise<any> {
    return Promise.resolve({ data: this.executeRows(), error: null }).then(onFulfilled, onRejected)
  }
}

class InsertQuery {
  constructor(private table: string, private payload: any) {}

  select(): this {
    return this
  }

  private createRows(): Row[] {
    const input = Array.isArray(this.payload) ? this.payload : [this.payload]
    const rows = input.map((row) => ({ id: randomUUID(), ...row, criado_em: row.criado_em || now() }))
    const tableRows = getTable(this.table)
    tableRows.push(...rows)
    return rows
  }

  async single(): Promise<{ data: Row | null; error: any }> {
    const rows = this.createRows()
    return { data: rows[0] || null, error: null }
  }

  then(onFulfilled?: any, onRejected?: any): Promise<any> {
    return Promise.resolve({ data: this.createRows(), error: null }).then(onFulfilled, onRejected)
  }
}

class UpdateQuery {
  private filterColumn = ''
  private filterValue: any

  constructor(private table: string, private updates: any) {}

  eq(column: string, value: any): this {
    this.filterColumn = column
    this.filterValue = value
    return this
  }

  select(): this {
    return this
  }

  private applyUpdate(): Row[] {
    const rows = getTable(this.table)
    const updated: Row[] = []
    for (const row of rows) {
      if (row[this.filterColumn] === this.filterValue) {
        Object.assign(row, this.updates)
        updated.push(row)
      }
    }
    return updated
  }

  async single(): Promise<{ data: Row | null; error: any }> {
    const updated = this.applyUpdate()
    if (!updated.length) {
      return { data: null, error: { code: 'PGRST116', message: 'No rows found' } }
    }
    return { data: updated[0], error: null }
  }

  then(onFulfilled?: any, onRejected?: any): Promise<any> {
    return Promise.resolve({ data: this.applyUpdate(), error: null }).then(onFulfilled, onRejected)
  }
}

class DeleteQuery {
  private filterColumn = ''
  private filterValue: any

  constructor(private table: string) {}

  eq(column: string, value: any): Promise<{ data: null; error: any }> {
    this.filterColumn = column
    this.filterValue = value
    const rows = getTable(this.table)
    const kept = rows.filter((row) => row[this.filterColumn] !== this.filterValue)
    mockDatabase[this.table] = kept
    return Promise.resolve({ data: null, error: null })
  }
}

const mockSupabaseClient = {
  from: (table: string) => ({
    select: () => new SelectQuery(table),
    insert: (payload: any) => new InsertQuery(table, payload),
    update: (payload: any) => new UpdateQuery(table, payload),
    delete: () => new DeleteQuery(table),
  }),
}

export default mockSupabaseClient
