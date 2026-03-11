// dotenv carrega o arquivo .env para dentro de process.env
import dotenv from "dotenv";
dotenv.config();

// Essa função lê uma variável de ambiente.
// Se ela não existir, lança um erro imediatamente ao iniciar o servidor.
// Assim você descobre o problema na hora, não quando alguma feature falhar.
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`❌ Variável de ambiente obrigatória não encontrada: ${key}`);
  }
  return value;
}

// aqui exportamos um objeto com as variáveis de ambiente que a aplicação precisa.
export const env = {
  databaseUrl: getEnv("DATABASE_URL"),
  port: Number(process.env.PORT) || 3001,
  jwtSecret: getEnv("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  nodeEnv: process.env.NODE_ENV || "development",
};
