const mongoose = require("mongoose");

let conexao;

/**
 * Conecta ao banco de dados MongoDB Atlas.
 * A URL de conexão vem da variável de ambiente MONGODB_URI.
 */
const conectarBanco = async () => {
  if (mongoose.connection.readyState === 1) return;
  if (conexao) return conexao;

  if (!process.env.MONGODB_URI) {
    throw new Error("A variável de ambiente MONGODB_URI não foi configurada.");
  }

  conexao = mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("✅ Conectado ao MongoDB Atlas com sucesso!");
    })
    .catch((erro) => {
      conexao = undefined;
      console.error("❌ Erro ao conectar ao banco de dados:", erro.message);
      throw erro;
    });

  return conexao;
};

module.exports = conectarBanco;
