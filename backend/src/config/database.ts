import {PrismaClient} from "@prisma/client";


const db = new PrismaClient({
    log: ["query", "error", "warn"],
});

export default db;

// Criamos UMA instância do Prisma e exportamos ela.
// Todo arquivo que precisar falar com o banco importa esse "db".
//
// Por que não criar um "new PrismaClient()" em cada arquivo?
// → Porque cada instância abre uma nova pool de conexões com o banco,
//   e isso é lento e pode sobrecarregar o PostgreSQL.