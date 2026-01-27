const STORAGE_KEY = "terapeutas";
let editCPF = null;

function getEquipe() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveEquipe(lista) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

function renderEquipe() {
  const lista = getEquipe().filter(t => t.status === "Ativo");
  const tbody = document.getElementById("lista-equipe");
  const qtd = document.getElementById("qtd-terapeutas");

  qtd.innerText = `${lista.length} terapeutas ativas`;
  tbody.innerHTML = "";

  lista.forEach(t => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${t.nomeProfissional}</td>
      <td>${t.temFolga}</td>
      <td>${t.diaFolga || "-"}</td>
      <td>${t.dataInicio}</td>
      <td>${t.entrada}–${t.saida}</td>
      <td>
        <button onclick="editar('${t.cpf}')">✏️</button>
        <button onclick="excluir('${t.cpf}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function abrirModal() {
  editCPF = null;
  document.getElementById("form-terapeuta").reset();
  document.getElementById("modal").style.display = "flex";
}

function fecharModal() {
  document.getElementById("modal").style.display = "none";
}

document.getElementById("form-terapeuta").onsubmit = e => {
  e.preventDefault();

  const terapeuta = {
    cpf: cpf.value,
    nomeCompleto: nomeCompleto.value,
    nomeProfissional: nomeProfissional.value,
    dataNascimento: dataNascimento.value,
    email: email.value,
    unidade: unidade.value,
    endereco: endereco.value,
    contato: contato.value,
    contatoEmergencia: contatoEmergencia.value,
    temFolga: temFolga.value,
    diaFolga: diaFolga.value,
    entrada: entrada.value,
    saida: saida.value,
    dataInicio: dataInicio.value,
    status: status.value,
    certs: {
      nuru: nuru.checked,
      vivencia: vivencia.checked,
      podo: podo.checked,
      casais: casais.checked,
      feminina: feminina.checked
    }
  };

  let lista = getEquipe();
  lista = lista.filter(t => t.cpf !== terapeuta.cpf);
  lista.push(terapeuta);

  saveEquipe(lista);
  fecharModal();
  renderEquipe();
};

function editar(cpfEdit) {
  const t = getEquipe().find(t => t.cpf === cpfEdit);
  if (!t) return;

  Object.keys(t).forEach(k => {
    if (document.getElementById(k)) {
      document.getElementById(k).value = t[k];
    }
  });

  editCPF = cpfEdit;
  document.getElementById("modal").style.display = "flex";
}

function excluir(cpf) {
  if (!confirm("Excluir terapeuta?")) return;
  saveEquipe(getEquipe().filter(t => t.cpf !== cpf));
  renderEquipe();
}

renderEquipe();
