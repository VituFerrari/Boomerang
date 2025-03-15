const pool = require ("../database.js");

// Função para criar um lembrete no banco de dados
async function criarLembrete(clienteId, mensagemId, data) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO lembretes (cliente_id, mensagem_id, data_alvo) VALUES (?, ?, ?)",
      [clienteId, mensagemId, data]
    );
    return { id: result.insertId, clienteId, mensagemId, data };
  } catch (error) {
    console.error("Erro ao criar lembrete", error);
  } finally {
    connection.release();
  }
}

// Função para listar todos os lembretes
async function listarLembretes() {
  const connection = await pool.getConnection();
  try {
    const [lembretes] = await connection.query(`
      SELECT 
        lembretes.id,
        clientes.nome AS cliente_nome,  -- Pega o nome do cliente
        mensagens.conteudo AS mensagem_texto,  -- Pega o conteúdo da mensagem
        lembretes.data_alvo
      FROM lembretes
      JOIN clientes ON lembretes.cliente_id = clientes.id
      JOIN mensagens ON lembretes.mensagem_id = mensagens.id
    `);
    return lembretes;
  } catch (error) {
    console.error("Erro ao listar lembretes", error);
  } finally {
    connection.release();
  }
}

async function excluirLembrete(id) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query("DELETE FROM lembretes WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao excluir lembrete:", error);
    throw error; // Para o Express capturar e retornar erro 500
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function editarLembrete(id, clienteId, mensagemId, dataHoraLembrete) {
  try {
      const sql = "UPDATE lembretes SET cliente_Id = ?, mensagem_Id = ?, data_alvo = ? WHERE id = ?";
      const [result] = await pool.execute(sql, [clienteId, mensagemId, dataHoraLembrete, id]);

      return result.affectedRows > 0; // Retorna true se foi atualizado, false se não encontrou o lembrete.
  } catch (error) {
      console.error("Erro ao editar lembrete:", error);
      throw error;
  }
}

module.exports = { criarLembrete, listarLembretes, excluirLembrete, editarLembrete};