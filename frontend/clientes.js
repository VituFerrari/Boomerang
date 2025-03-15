// Cadastrar um novo cliente
document.getElementById("formCliente")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const observacao = document.getElementById("obs").value;

  try {
    await fetch("http://localhost:3000/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone, email, observacao}),
    });

    alert("Cliente cadastrado!");
    carregarClientes();  // Recarrega a lista de clientes após o cadastro
  } catch (error) {
    console.error("Erro ao cadastrar cliente", error);
    alert("Falha ao cadastrar cliente. Tente novamente.");
  }
});

// Listar os clientes
async function carregarClientes() {
  try {
    const response = await fetch("http://localhost:3000/clientes");
    const clientes = await response.json();

    const lista = document.getElementById("listaClientes");
    lista.innerHTML = "";  // Limpa a tabela antes de adicionar novos dados

    if (clientes.length === 0) {
      lista.innerHTML = "<tr><td colspan='4'>Nenhum cliente cadastrado</td></tr>"; // Mostra mensagem caso não tenha clientes
    } else {
      clientes.forEach((cliente) => {
        const tr = document.createElement("tr");
        
        tr.innerHTML = `
          <td>${cliente.id}</td>
          <td>${cliente.nome}</td>  <!-- Nome do cliente -->
          <td>${cliente.telefone}</td>  <!-- Telefone do cliente -->
          <td>${cliente.email}</td>  <!-- Email do cliente -->
          <td>${cliente.observacao}</td>  <!-- Observação anexada ao cliente -->
          <td>
            <button onclick="abrirModalEdicao(${cliente.id}, '${cliente.nome}', '${cliente.telefone}', '${cliente.email}', '${cliente.observacao}')">✏️</button>
            <button onclick="Wpp(${cliente.telefone})"><img src="./img/wpp1x.png"></button>
            <button onclick="excluirCliente(${cliente.id})">❌</button>
          </td>
        `;

        lista.appendChild(tr);  // Adiciona a linha à tabela
      });
    }
  } catch (error) {
    console.error("❌ Erro ao carregar clientes", error);
  }
}

// Lógica para editar os dados escolhidos
document.getElementById("formModalCliente").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("clienteIdModal").value;
  const nome = document.getElementById("nomeModal").value;
  const telefone = document.getElementById("telefoneModal").value;
  const email = document.getElementById("emailModal").value;
  const observacao = document.getElementById("obsModal").value;

  const cliente = { nome, telefone, email, observacao };

  if (id) {
    await fetch(`http://localhost:3000/clientes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
    });
  }
  carregarClientes(); // Atualiza a tabela
  fecharModal(); // Fecha o modal
});

// Função para abrir o modal de edição de lembrete
function abrirModalEdicao(id, nome, telefone, email, observacao) {

  document.getElementById("modalEdicao").style.display = "block"; // Abre o modal
  document.getElementById("clienteIdModal").value = id;
  document.getElementById("nomeModal").value = nome;
  document.getElementById("telefoneModal").value = telefone;
  document.getElementById("emailModal").value = email;
  document.getElementById("obsModal").value = observacao;
}

// Função para fechar o modal de edição de lembrete
function fecharModal() {
  document.getElementById("modalEdicao").style.display = "none"; // Fecha o modal
}

function Wpp(telefone) {
  telefone;
  const url = `https://wa.me/+55${telefone}`;
  window.open(url, '_blank');
}

document.addEventListener("DOMContentLoaded", carregarClientes);  // Carrega os clientes assim que a página for carregada