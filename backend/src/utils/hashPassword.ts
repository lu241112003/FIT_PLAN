
import bcrypt from "bcryptjs";

// bcrypt é um algoritmo de hash feito para senhas.
// Ele é LENTO de propósito — isso dificulta ataques de força bruta.

// O "salt" (10) define quantas rodadas de processamento são feitas.
// 10 é o padrão — seguro e não muito lento.
const SALT_ROUNDS = 10;

// Transforma a senha em texto puro em um hash irreversível.
// Ex: "minhasenha123" → "$2a$10$abc...xyz"
export async function hashPassword(senha: string): Promise<string> {
  return bcrypt.hash(senha, SALT_ROUNDS);
}

// Compara uma senha em texto puro com um hash salvo no banco.
// Retorna true se baterem, false se não.
// Você NUNCA decifra o hash — você só compara.
export async function comparePassword(
  senha: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(senha, hash);
}