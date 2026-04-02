import dotenv from "dotenv";
dotenv.config();

function getEnv(key: string, optional = false): string {
  const value = process.env[key];
  if (!value && !optional) {
    // In development mode, some vars are optional
    if (process.env.NODE_ENV === 'development' && 
        (key === 'SUPABASE_URL' || key === 'SUPABASE_ANON_KEY')) {
      return '';
    }
    throw new Error(`❌ Variável de ambiente obrigatória não encontrada: ${key}`);
  }
  return value || '';
}

export const env = {
  databaseUrl: getEnv("SUPABASE_URL", true),
  databaseAnonKey: getEnv("SUPABASE_ANON_KEY", true),
  port: Number(process.env.PORT) || 3001,
  jwtSecret: getEnv("JWT_SECRET", true) || "dev_jwt_secret_change_in_production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "dev_refresh_secret",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "30d",
  groqApiKey: process.env.GROQ_API_KEY || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  nodeEnv: process.env.NODE_ENV || "development",

};
