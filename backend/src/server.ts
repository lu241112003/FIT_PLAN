import app from "./app";
import { env } from "./config/env";
import supabase from "./config/database";

async function main() {
  try {
    // 🔍 Teste de acesso ao banco (não é conexão!)
    const { error } = await supabase
      .from("users")
      .select("id")
      .limit(1);

    if (error) {
      throw error;
    }

    console.log("✅ Supabase acessível");

    app.listen(env.port, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${env.port}`);
      console.log(`🌱 Ambiente: ${env.nodeEnv}`);
    });

  } catch (error: any) {
    if (env.nodeEnv === 'development') {
      console.warn("⚠️  Falha ao acessar o Supabase (modo desenvolvimento):");
      console.warn(error.message || error);
      console.log("\n📝 Para usar o Supabase, configure as variáveis em .env:");
      console.log("   1. Crie um projeto em https://supabase.com");
      console.log("   2. Copie o SUPABASE_URL e SUPABASE_ANON_KEY");
      console.log("   3. Cole em .env");
      console.log("\n🚀 Iniciando servidor em modo desenvolvimento (sem banco)...\n");

      app.listen(env.port, () => {
        console.log(`🚀 Servidor rodando em http://localhost:${env.port}`);
        console.log(`🌱 Ambiente: ${env.nodeEnv}`);
        console.log("⚠️  Nota: API funciona mas sem persistência de dados");
      });
    } else {
      console.error("❌ Falha ao acessar o Supabase:");
      console.error(error.message || error);
      process.exit(1);
    }
  }
}

main();