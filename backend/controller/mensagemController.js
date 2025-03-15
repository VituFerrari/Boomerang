const pool = require ("../database.js");

// Função para criar uma mensagem no banco de dados
async function criarMensagem(titulo, conteudo) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
        "INSERT INTO mensagens (titulo, conteudo) VALUES (?, ?)",
        [titulo, conteudo]
    );
    return { id: result.insertId, titulo, conteudo };
  } catch (error) {
    console.error("Erro ao criar mensagem", error);
  } finally {
    connection.release();
  }
}

// Função para listar todos as mensagens
async function listarMensagens() {
  const connection = await pool.getConnection();
  try {
    const [mensagens] = await connection.query("SELECT * FROM mensagens");
    return mensagens;
  } catch (error) {
    console.error("Erro ao listar mensagens", error);
  } finally {
    connection.release();
  }
}

async function excluirMensagem(id) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query("DELETE FROM mensagens WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao excluir mensagem:", error);
    throw error; // Para o Express capturar e retornar erro 500
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function editarMensagem(id, titulo, conteudo) {
  try {
      const sql = "UPDATE mensagens SET titulo = ?, conteudo = ? WHERE id = ?";
      const [result] = await pool.execute(sql, [titulo, conteudo, id]);

      return result.affectedRows > 0; // Retorna true se foi atualizado, false se não encontrou o cliente.
  } catch (error) {
      console.error("Erro ao editar mensagem:", error);
      throw error;
  }
}

module.exports = { criarMensagem, listarMensagens, excluirMensagem, editarMensagem };