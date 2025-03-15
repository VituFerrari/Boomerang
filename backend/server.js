const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { criarCliente, listarClientes, excluirCliente, editarCliente } = require("./controller/clienteController.js");
const { criarLembrete, listarLembretes, excluirLembrete, editarLembrete } = require("./controller/lembreteController.js");
const { criarMensagem, listarMensagens, excluirMensagem, editarMensagem } = require("./controller/mensagemController.js");


const app = express();
app.use(express.json());
app.use(cors());

// Rota para cadastrar um cliente
app.post("/clientes", async (req, res) => {
    try {
      const { nome, telefone, email, observacao } = req.body;
      const cliente = criarCliente(nome, telefone, email, observacao);
      res.status(200).json({ cliente, message: 'Cliente cadastrado com sucesso!' });

    } catch (error) {
      console.error("Erro ao cadastrar cliente:", error.message);
      res.status(500).json({ error: "Erro ao cadastrar cliente.", details: error.message });
    }
});

// Rota para cadastrar um lembrete
app.post("/lembretes", async (req, res) => {
  try {
    const { clienteId, mensagemId, dataHoraLembrete } = req.body;
    const lembrete = await criarLembrete(clienteId, mensagemId, dataHoraLembrete);
    res.status(200).json({ lembrete, message: 'Lembrete cadastrado com sucesso!' });

  } catch (error) {
    res.status(500).json({ error: "Erro ao criar lembrete." });
  }
});

// Rota para cadastrar uma mensagem
app.post("/mensagens", async (req, res) => {
  try {
    const { titulo, conteudo } = req.body;
    const mensagem = await criarMensagem(titulo, conteudo);
    res.status(200).json({ mensagem });

  } catch (error) {
    res.status(500).json({ error: "Erro ao criar mensagem." });
  }
});

// Rota para listar clientes
app.get("/clientes", async (_, res) => {
    try {
      const clientes = await listarClientes();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar clientes." });
    }
});

// Rota para listar lembretes
app.get("/lembretes", async (_, res) => {
  try {
    const lembretes = await listarLembretes();
    res.json(lembretes);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar lembretes." });
  }
});

// Rota para listar mensagens
app.get("/mensagens", async (_, res) => {
  try {
    const mensagens = await listarMensagens();
    res.json(mensagens);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar mensagens." });
  }
});

// Rota para editar um cliente
app.put("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, telefone, email, observacao } = req.body;
  try {
    const sucesso = await editarCliente(id, nome, telefone, email, observacao);
    if (sucesso) {
      res.status(200).json({ message: "Cliente atualizado com sucesso!" });
    } else {
      res.status(404).json({ error: "Cliente não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar cliente." });
  }
});

// Rota para editar um lembrete
app.put("/lembretes/:id", async (req, res) => {
  const { id } = req.params;
  const { clienteId, mensagemId, dataHoraLembrete } = req.body;
  try {
    const sucesso = await editarLembrete(id, clienteId, mensagemId, dataHoraLembrete);
    if (sucesso) {
      res.status(200).json({ message: "Lembrete atualizado com sucesso!" });
    } else {
      res.status(404).json({ error: "Lembrete não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar lembrete." });
  }
});

// Rota para editar uma mensagem
app.put("/mensagens/:id", async (req, res) => {
  const { id } = req.params;
  const { titulo, conteudo } = req.body;
  try {
    const sucesso = await editarMensagem(id, titulo, conteudo);
    if (sucesso) {
      res.status(200).json({ message: "Mensagem atualizada com sucesso!" });
    } else {
      res.status(404).json({ error: "Mensagem não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar mensagem." });
  }
});

// Rota para excluir um cliente
app.delete("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sucesso = await excluirCliente(id);
    if (sucesso) {
      res.status(200).json({ message: "Cliente excluído com sucesso!" });
    } else {
      res.status(404).json({ error: "Cliente não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir cliente." });
  }
});

// Rota para excluir um lembrete
app.delete("/lembretes/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sucesso = await excluirLembrete(id);
    if (sucesso) {
      res.status(200).json({ message: "Lembrete excluído com sucesso!" });
    } else {
      res.status(404).json({ error: "Lembrete não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir lembrete." });
  }
});

// Rota para excluir uma mensagem
app.delete("/mensagens/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sucesso = await excluirMensagem(id);
    if (sucesso) {
      res.status(200).json({ message: "Mensagem excluída com sucesso!" });
    } else {
      res.status(404).json({ error: "Mensagem não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir mensagem." });
  }
});


// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});