require('dotenv').config({ path: '../.env'})

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl){
    throw new Error('SUPABASE_URL devem estar definidos no .env')
}
 else if( !supabaseKey) {
  throw new Error(' SUPABASE_ANON_KEY devem estar definidos no .env')
}

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('Supabase client criado com sucesso:', supabase)

module.exports = { supabase }