const mysql = require ("../node_modules/mysql2/promise.js");

// Criando a conexão com o banco de dados
const pool = mysql.createPool({
  host: "localhost", // O endereço do seu servidor
  user: "root", // O usuário do BD
  password: "usbw", // A senha do BD
  database: "boomerang", // O nome do BD
});

// Função para criar as tabelas no banco de dados
async function criarTabelas() {
  const connection = await pool.getConnection();
  try {
    // Criar a tabela 'clientes' se ela não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        telefone VARCHAR(20) NOT NULL,
        email VARCHAR(100),
        observacao TEXT
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;
    `);

    // Criar a tabela 'lembretes' se ela não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS lembretes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_id INT,
        mensagem_id INT,
        data_alvo DATETIME NOT NULL,
        status ENUM('pendente','enviado') NOT NULL DEFAULT 'pendente',
        FOREIGN KEY (cliente_id) REFERENCES clientes(id),
        FOREIGN KEY (mensagem_id) REFERENCES mensagens(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;
    `);

    // Criar a tabela 'mensagens' se ela não existir
    await connection.query(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(100),
        conteudo TEXT NOT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=COMPACT;
    `);

    console.log("Tabelas criadas com sucesso!");
  } catch (error) {
    console.error("Erro ao criar as tabelas", error);
  } finally {
    connection.release();
  }
}

// Chamar a função para criar as tabelas ao iniciar o sistema
criarTabelas();

module.exports = pool ; // Exportar o pool para uso em outras partes do sistema