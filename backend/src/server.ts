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
    console.error("❌ Falha ao acessar o Supabase:");
    console.error(error.message || error);
    process.exit(1);
  }
}

main();