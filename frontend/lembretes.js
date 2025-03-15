
document.addEventListener("DOMContentLoaded", () => {
    carregarClientes("clienteId");
    carregarMensagens("mensagemId");
    carregarLembretes();
});

// Cadastrar um novo lembrete
document.getElementById("formLembrete")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const clienteId = document.getElementById("clienteId").value;
    const mensagemId = document.getElementById("mensagemId").value;
    const dataLembrete = document.getElementById("dataLembrete").value;
    const horaLembrete = document.getElementById("horaLembrete").value;
    const dataHoraLembrete = `${dataLembrete} ${horaLembrete}:00`;
    try {
        await fetch("http://localhost:3000/lembretes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ clienteId, mensagemId, dataHoraLembrete}),
        });

        alert("Lembrete cadastrado!");
        document.getElementById("clienteId").selectedIndex = 0; // Limpa o select de clientes
        document.getElementById("mensagemId").selectedIndex = 0; // Limpa o select de mensagens
        document.getElementById("dataLembrete").value = ''; // Limpa o campo de data
        document.getElementById("horaLembrete").value = "09:00"; // Limpa o campo de hora
        carregarLembretes();
    } catch (error) {
        console.error("Erro ao cadastrar lembrete", error);
        alert("Falha ao cadastrar lembrete. Tente novamente.");
    }
});

// Listar lembretes
async function carregarLembretes() {
    try {
        const response = await fetch("http://localhost:3000/lembretes");
        const lembretes = await response.json();

        const lista = document.getElementById("listaLembretes");
        lista.innerHTML = "";

        if (lembretes.length === 0) {
            lista.innerHTML = "<tr><td colspan='4'>Nenhum lembrete cadastrado</td></tr>";
        } else {
            lembretes.forEach((lembrete) => {

                const tr = document.createElement("tr");

                const dataCompleta = formatarData(lembrete.data_alvo);
                const [data, hora] = dataCompleta.split(" ");

                tr.innerHTML = `
                    <td>${lembrete.id}</td>
                    <td>${lembrete.cliente_nome}</td>  <!-- Nome do cliente -->
                    <td>${lembrete.mensagem_texto}</td>  <!-- Texto da mensagem -->
                    <td>${data} às ${hora}</td>  <!-- Data e hora do lembrete -->
                    <td>
                        <button onclick="abrirModalEdicao(${lembrete.id}, '${lembrete.cliente_nome}', '${lembrete.mensagem_texto}', '${formatarData(lembrete.data_alvo)}')">✏️</button>
                        <button onclick="excluirLembrete(${lembrete.id})">❌</button>
                    </td>
                `;
                console.log("lembrete.id: " + lembrete.id + " lembrete.cliente_nome: " + lembrete.cliente_nome + " lembrete.mensagem_texto: " + lembrete.mensagem_texto + " lembrete.data_alvo: " + lembrete.data_alvo);
                lista.appendChild(tr);
            });
        }
    } catch (error) {
        console.error("❌ Erro ao carregar lembretes", error);
    }
}

// Excluir lembrete
async function excluirLembrete(id) {
    if (confirm("Tem certeza que deseja excluir este lembrete?")) {
      try {
        const response = await fetch(`http://localhost:3000/lembretes/${id}`, { method: "DELETE" });

        // Verifica se o status da resposta é OK (200)
        if (response.ok) {
          alert("Lembrete excluído com sucesso!");
          carregarLembretes();  // Atualiza a lista de lembretes
        } else {
          const result = await response.json();
          alert(`Falha ao excluir o lembrete: ${result.error || 'Erro desconhecido'}`);
        }
      } catch (error) {
        console.error("Erro ao excluir lembrete", error);
      }
    }
}

// Função para editar um lembrete
function editarLembrete(id, clienteId, mensagemId, dataHoraLembrete) {
    const [data, hora] = dataHoraLembrete.split(" ");
    document.getElementById("clienteId").value = clienteId;
    document.getElementById("mensagemId").value = mensagemId;
    document.getElementById("dataLembrete").value = data;
    document.getElementById("horaLembrete").value = hora.substring(0, 5);
    document.getElementById("lembreteId").value = id;
}

// Carregar clientes dinamicamente
async function carregarClientes(formModal) {
    try {
        const response = await fetch("http://localhost:3000/clientes");
        const clientes = await response.json();
        const select = document.getElementById(formModal);
        clientes.forEach((cliente) => {
            const option = document.createElement("option");
            option.value = cliente.id;
            option.textContent = cliente.nome;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar clientes", error);
    }
}

// Carregar mensagens dinamicamente
async function carregarMensagens(formModal) {
    try {
        const response = await fetch("http://localhost:3000/mensagens");
        const mensagens = await response.json();
        const select = document.getElementById(formModal);
        mensagens.forEach((mensagem) => {
            const option = document.createElement("option");
            option.value = mensagem.id;
            option.textContent = mensagem.conteudo;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar mensagens", error);
    }
}

// Função para formatar a data
function formatarData(dataSQL) {

    const data = new Date(dataSQL.replace(" ", "T")); // Garante compatibilidade
    if (isNaN(data.getTime())) return "Data inválida";

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');

    return `${dia}-${mes}-${ano} ${horas}:${minutos}`;
}

// Função para abrir o modal de edição de lembrete
function abrirModalEdicao(id, clienteId, mensagemId, dataHoraLembrete) {

    carregarClientes("clienteIdModal"); // Carrega os clientes no modal
    carregarMensagens("mensagemIdModal"); // Carrega as mensagens no modal

    document.getElementById("modalEdicao").style.display = "block"; // Abre o modal
    document.getElementById("lembreteIdModal").value = id;
    document.getElementById("clienteIdModal").selectedIndex = clienteId;
    document.getElementById("mensagemIdModal").value = mensagemId;

    const data = dataHoraLembrete.substring(0, 10);
    const hora = dataHoraLembrete.substring(11, 16);
    document.getElementById("dataLembreteModal").value = data;
    document.getElementById("horaLembreteModal").value = hora;
}

// Função para fechar o modal de edição de lembrete
function fecharModal() {
    document.getElementById("modalEdicao").style.display = "none"; // Fecha o modal
}

// Lógica para editar os dados escolhidos
document.getElementById("formModalLembrete").addEventListener("submit", async function (event) {
    event.preventDefault();

    const id = document.getElementById("lembreteIdModal").value;
    const clienteId = document.getElementById("clienteIdModal").value;
    const mensagemId = document.getElementById("mensagemIdModal").value;
    const data = document.getElementById("dataLembreteModal").value;
    const hora = document.getElementById("horaLembreteModal").value;
    const dataHoraLembrete = `${data} ${hora}:00`;

    const lembrete = { clienteId, mensagemId, dataHoraLembrete };

    if (id) {
        await fetch(`http://localhost:3000/lembretes/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lembrete)
        });
    }

    carregarLembretes(); // Atualiza a tabela
    fecharModal(); // Fecha o modal
});

// Lógica para ativar o alarme
document.getElementById('btnAtivarAlarme').addEventListener('click', function() {
    let alarmeContainer = document.getElementById('alarme-container');
    let mensagem = document.getElementById('mensagem');
    let alarmeSom = document.getElementById('alarme-som');

    // Ativar o alarme
    alarmeContainer.classList.add('ativo');
    mensagem.innerHTML = 'ALERTA! VOCÊ TEM UMA NOVA NOTIFICAÇÃO!';
    alarmeSom.play(); // Tocar som do alarme

    // Opcional: Desativar o alarme após 10 segundos
    setTimeout(function() {
        alarmeContainer.classList.remove('ativo');
        mensagem.innerHTML = 'NENHUMA NOTIFICAÇÃO ATIVA';
        alarmeSom.pause();
        alarmeSom.currentTime = 0; // Resetar o áudio
    }, 10000); // Desativa após 10 segundos
});
