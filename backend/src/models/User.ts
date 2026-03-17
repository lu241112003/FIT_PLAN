const {supabase} = require('../config/database')

const TABLE = "users"

const User = {
    // ─────────────────────────────────────────────
  // BUSCAR TODOS OS USUÁRIOS
  // Retorna todos os registros da tabela.
    // ─────────────────────────────────────────────
    async findAll() {
        const {data, error} = await supabase
        .from(TABLE)
        .select("*")
    
        return data
    }
}