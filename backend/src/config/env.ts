import { config } from 'dotenv';
config();

export const env = {
  PORT: Number(process.env.PORT) || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
};