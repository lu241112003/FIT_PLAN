const { env } = require('./env')
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

let supabase: any

function isPlaceholder(value: string | undefined): boolean {
  if (!value) return true
  const normalized = String(value).trim().toLowerCase()
  return (
    normalized === '' ||
    normalized.includes('your-project.supabase.co') ||
    normalized.includes('your-anon-key')
  )
}

const shouldUseMock =
  env.nodeEnv === 'development' &&
  (isPlaceholder(env.databaseUrl) || isPlaceholder(env.databaseAnonKey))

// Em modo desenvolvimento sem credenciais, usar mock
if (shouldUseMock) {
  console.log('🔧 Modo Mock: Usando banco de dados em memória (dados perdidos ao reiniciar)')
  supabase = require('./database-mock').default
} else {
  if (!env.databaseUrl){
      throw new Error('SUPABASE_URL devem estar definidos no .env')
  }
   else if( !env.databaseAnonKey) {
    throw new Error(' SUPABASE_ANON_KEY devem estar definidos no .env')
  }

  supabase = createClient(env.databaseUrl, env.databaseAnonKey)
}

if (supabase){
    console.log('Supabase client criado com sucesso!')
}

export default supabase