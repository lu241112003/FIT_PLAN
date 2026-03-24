const { env } = require('./env')
require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')

if (!env.databaseUrl){
    throw new Error('SUPABASE_URL devem estar definidos no .env')
}
 else if( !env.databaseAnonKey) {
  throw new Error(' SUPABASE_ANON_KEY devem estar definidos no .env')
}

const supabase = createClient(env.databaseUrl, env.databaseAnonKey)

if (supabase){
    console.log('Supabase client criado com sucesso!')
}

export default supabase