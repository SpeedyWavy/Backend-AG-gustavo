// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const conectarBanco = require("./config/database");

// ─────────────────────────────────────────────
// Inicialização do app Express
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
// Middlewares globais
// ─────────────────────────────────────────────

// Permite que o frontend (React) faça requisições para esta API
// Em produção, substitua "*" pela URL real do seu frontend
app.use(cors({ origin: "*" }));

// Permite que o Express leia JSON no corpo das requisições
app.use(express.json());

// Em serverless, a conexão precisa estar pronta antes das rotas acessarem o banco.
app.use(async (req, res, next) => {
  try {
    await conectarBanco();
    next();
  } catch (erro) {
    res.status(503).json({
      sucesso: false,
      mensagem: "Banco de dados indisponível.",
    });
  }
});

// ─────────────────────────────────────────────
// Rota de verificação (health check)
// Útil para confirmar que a API está no ar
// ─────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    sucesso: true,
    mensagem: "API funcionando! 🚀",
    versao: "1.0.0",
  });
});

// ─────────────────────────────────────────────
// Rotas da aplicação
// ─────────────────────────────────────────────
const usuarioRoutes = require("./routes/userRoutes");
app.use("/api/usuarios", usuarioRoutes);

// ─────────────────────────────────────────────
// Tratamento de rota não encontrada (404)
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    sucesso: false,
    mensagem: `Rota "${req.method} ${req.url}" não encontrada.`,
  });
});

// ─────────────────────────────────────────────
// Inicializa o servidor
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 3001;

const iniciar = async () => {
  await conectarBanco();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`📋 Documentação: http://localhost:${PORT}/api/docs`);
  });
};

if (require.main === module) {
  iniciar().catch((erro) => {
    console.error("❌ Não foi possível iniciar o servidor:", erro.message);
    process.exitCode = 1;
  });
}

// Exporta o app para o Vercel poder usar como serverless function
module.exports = app;
