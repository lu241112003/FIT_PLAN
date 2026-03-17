//Ajuda a importar o supabase do database aqui
const { supabase } =  require('../../database/supabase')


const db = supabase({
    log: ["query", "error", "warn"],
});

export default db;
