import app from "./app";
import { env } from "./config/env";
import db from "./config/database";
// server.ts é o ponto de entrada — ele inicia o servidor.
// Separamos do app.ts para facilitar testes (você pode importar o app sem subir o servidor).
async function main() {
  try {
    // Testa a conexão com o banco antes de subir o servidor
    await db.$connect();
    console.log("Conectado ao banco de dados");

    app.listen(env.port, () => {
      console.log(`Servidor rodando em http://localhost:${env.port}`);
      console.log(`Ambiente: ${env.nodeEnv}`);
    });
  } catch (error) {
    console.error("Falha ao conectar ao banco:", error);
    process.exit(1); // encerra o processo com código de erro
  }
}
// Garante que o Prisma fecha a conexão corretamente ao encerrar o processo
process.on("SIGINT", async () => {
  await db.$disconnect();
  console.log("🔌 Banco de dados desconectado. Servidor encerrado.");
  process.exit(0);
});

main();