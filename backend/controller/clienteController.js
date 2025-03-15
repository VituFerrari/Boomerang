const pool = require ("../database.js");

// Função para criar um cliente
async function criarCliente(nome, telefone, email, observacao) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO clientes (nome, telefone, email, observacao) VALUES (?, ?, ?, ?)",
      [nome, telefone, email, observacao]
    );
    return { id: result.insertId, nome, telefone, email, observacao };
  } catch (error) {
    console.error("Erro ao criar cliente", error);
  } finally {
    connection.release();
  }
}

// Função para listar todos os clientes
async function listarClientes() {
  const connection = await pool.getConnection();
  const [rows] = await connection.query("SELECT * FROM clientes");
  connection.release();
  return rows;
}

async function excluirCliente(id) {
  let connection;
  try {
    connection = await pool.getConnection();
    const [result] = await connection.query("DELETE FROM clientes WHERE id = ?", [id]);
    if (result.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error);
    throw error; // Para o Express capturar e retornar erro 500
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function editarCliente(id, nome, telefone, email, observacao) {
  try {
      const sql = "UPDATE clientes SET nome = ?, telefone = ?, email = ?, observacao = ? WHERE id = ?";
      const [result] = await pool.execute(sql, [nome, telefone, email, observacao, id]);

      return result.affectedRows > 0; // Retorna true se foi atualizado, false se não encontrou o cliente.
  } catch (error) {
      console.error("Erro ao editar cliente:", error);
      throw error;
  }
}

module.exports = { criarCliente, listarClientes, excluirCliente, editarCliente };