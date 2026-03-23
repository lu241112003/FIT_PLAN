import express from "express";
import cors from "cors";
import routes from "./routes/index";
import { errorMiddleware } from "./middlewares/errorMiddleware";

// app é o objeto principal do Express — é nele que configuramos tudo
const app = express();
//  MIDDLEWARES GLOBAIS
//  Middlewares são funções que rodam em TODA requisição,
//  antes de chegar nos controllers.
// cors() → permite que o frontend (outra origem) acesse a API
// Sem isso, o browser bloqueia as requisições por segurança (CORS policy)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true, // permite enviar cookies
  })
);
// express.json() → permite que o Express leia o corpo da requisição como JSON
// Sem isso, req.body seria undefined
app.use(express.json());
//  ROTAS
//  Todas as rotas ficam sob o prefixo /api
app.use("/api", routes);
// Rota de health check — para verificar se o servidor está no ar
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});
//  MIDDLEWARE DE ERRO
//  Deve ser o ÚLTIMO middleware registrado!
//  Ele captura erros de todos os outros middlewares e rotas.
app.use(errorMiddleware);

export default app;