document.addEventListener("DOMContentLoaded", () => {
  carregarMensagens();
});

// Cadastrar uma nova mensagem
document.getElementById("formMensagem")?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const titulo = document.getElementById("titulo").value;
  const conteudo = document.getElementById("conteudo").value;

  alert(`Titulo:${titulo} e Conteúdo:${conteudo}`); // Exibe mensagem de sucesso
  try {
    await fetch("http://localhost:3000/mensagens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, conteudo}),
    });

    document.getElementById("titulo").value = ''; // Limpa o campo do titulo
    document.getElementById("conteudo").value = ''; // Limpa o campo de mensagem
    carregarMensagens();
  } catch (error) {
    console.error("Erro ao cadastrar mensagem", error);
    alert("Falha ao cadastrar mensagem. Tente novamente.");
    }
});

// Listar os mensagens
async function carregarMensagens() {
  try {
    const response = await fetch("http://localhost:3000/mensagens");
    const mensagens = await response.json();

    const lista = document.getElementById("listaMensagens");
    lista.innerHTML = "";  // Limpa a tabela antes de adicionar novos dados

    if (mensagens.length === 0) {
      lista.innerHTML = "<tr><td colspan='4'>Nenhuma mensagem cadastrada</td></tr>"; // Mostra mensagem caso não tenha mensagens
    } else {
      mensagens.forEach((mensagem) => {
        const tr = document.createElement("tr");
          
        tr.innerHTML = `
          <td>${mensagem.id}</td>
          <td>${mensagem.titulo}</td>  <!-- Título da mensagem -->
          <td>${mensagem.conteudo}</td>  <!-- Conteúdo da mensagem -->
          <td>
            <button onclick="abrirModalEdicao(${mensagem.id}, '${mensagem.titulo}', '${mensagem.conteudo}')">✏️</button>
            <button onclick="excluirMensagem(${mensagem.id})">❌</button>
          </td>
        `;
  
        lista.appendChild(tr);  // Adiciona a linha à tabela
      });
    }
  } catch (error) {
    console.error("❌ Erro ao carregar mensagens", error);
  }
}
  
// Excluir Mensagem
async function excluirMensagem(id) {
  if (confirm("Tem certeza que deseja excluir esta mensagem?")) {
    try {
      const response = await fetch(`http://localhost:3000/mensagens/${id}`, { method: "DELETE" });

      // Verifica se o status da resposta é OK (200)
      if (response.ok) {
        alert("Mensagem excluída com sucesso!");
        carregarMensagens();  // Atualiza a lista de Mensagens
      } else {
        const result = await response.json();
        alert(`Falha ao excluir a mensagem: ${result.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
      console.error("Erro ao excluir mensagem", error);
    }
  }
}

// Função para abrir o modal de edição de mensagem
function abrirModalEdicao(id, titulo, conteudo) {

  //carregarMensagens(titulo); // Carrega as mensagens no modal

  document.getElementById("modalEdicao").style.display = "block"; // Abre o modal
  document.getElementById("mensagemIdModal").value = id;
  document.getElementById("tituloModal").value = titulo;
  document.getElementById("conteudoModal").value = conteudo;
}

// Função para fechar o modal de edição de mensagem
function fecharModal() {
    document.getElementById("modalEdicao").style.display = "none"; // Fecha o modal
}

// Função para editar uma Mensagem
function editarMensagem(id, titulo, conteudo) {
  document.getElementById("mensagemId").value = id;
  document.getElementById("tituloMsg").value = titulo;
  document.getElementById("conteudoMsg").value = conteudo;
}

// Lógica para editar os dados escolhidos
document.getElementById("formModalMensagem").addEventListener("submit", async function (event) {
  event.preventDefault();

  const id = document.getElementById("mensagemIdModal").value;
  const titulo = document.getElementById("tituloModal").value;
  const conteudo = document.getElementById("conteudoModal").value;

  const mensagem = { titulo, conteudo };

  if (id) {
    await fetch(`http://localhost:3000/mensagens/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mensagem)
    });
  }

  carregarMensagens(); // Atualiza a tabela
  fecharModal(); // Fecha o modal
});