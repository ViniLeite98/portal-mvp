const SOL_KEY = "solicitacoes";
const EQ_KEY = "terapeutas";

function getSolicitacoes() {
  return JSON.parse(localStorage.getItem(SOL_KEY)) || [];
}

function saveSolicitacoes(lista) {
  localStorage.setItem(SOL_KEY, JSON.stringify(lista));
}

function getEquipe() {
  return JSON.parse(localStorage.getItem(EQ_KEY)) || [];
}

function carregarTerapeutas() {
  const select = document.getElementById("cpf");
  select.innerHTML = "<option value=''>Selecione a terapeuta</option>";

  getEquipe()
    .filter(t => t.status === "Ativo")
    .forEach(t => {
      const opt = document.createElement("option");
      opt.value = t.cpf;
      opt.textContent = `${t.nomeProfissional} — ${t.cpf}`;
      opt.dataset.nome = t.nomeProfissional;
      select.appendChild(opt);
    });

  select.onchange = () => {
    const nome = select.selectedOptions[0]?.dataset.nome || "";
    document.getElementById("nome").value = nome;
  };
}

function renderSolicitacoes() {
  const lista = getSolicitacoes();
  const tbody = document.getElementById("lista-solicitacoes");
  const qtd = document.getElementById("qtd-solicitacoes");

  qtd.innerText = `${lista.length} solicitações cadastradas`;
  tbody.innerHTML = "";

  lista.forEach((s, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.nome}</td>
      <td>${s.tipo}</td>
      <td>${s.inicio} → ${s.fim}</td>
      <td>
        <span class="badge ${s.status.toLowerCase()}">${s.status}</span>
      </td>
      <td>
        <button onclick="excluir(${i})">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirModal() {
  document.getElementById("form-solicitacao").reset();
  document.getElementById("modal").style.display = "flex";
  carregarTerapeutas();
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("form-solicitacao").onsubmit = e => {
  e.preventDefault();

  const solicitacao = {
    cpf: cpf.value,
    nome: nome.value,
    tipo: tipo.value,
    inicio: inicio.value,
    fim: fim.value,
    status: status.value,
    justificativa: justificativa.value
  };

  const lista = getSolicitacoes();
  lista.push(solicitacao);
  saveSolicitacoes(lista);

  fecharModal();
  renderSolicitacoes();
};

function excluir(index) {
  if (!confirm("Excluir solicitação?")) return;
  const lista = getSolicitacoes();
  lista.splice(index, 1);
  saveSolicitacoes(lista);
  renderSolicitacoes();
}

renderSolicitacoes();
