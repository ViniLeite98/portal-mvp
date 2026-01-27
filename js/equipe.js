const lista = document.getElementById("lista");
const form = document.getElementById("form");
const btnNova = document.getElementById("btnNova");

const nome = document.getElementById("nome");
const cpf = document.getElementById("cpf");
const email = document.getElementById("email");
const unidade = document.getElementById("unidade");
const folga = document.getElementById("folga");
const diaFolga = document.getElementById("diaFolga");
const status = document.getElementById("status");

let editIndex = null;

function render() {
  const terapeutas = getTerapeutas();
  lista.innerHTML = "";

  const ativas = terapeutas.filter(t => t.status === "Ativo");
  document.getElementById("kpiTotal").innerText = ativas.length;

  terapeutas.forEach((t, i) => {
    lista.innerHTML += `
      <tr>
        <td>${t.nome}</td>
        <td>${t.cpf}</td>
        <td>${t.folga}</td>
        <td>${t.diaFolga}</td>
        <td>${t.status}</td>
        <td>
          <button onclick="editar(${i})">✏️</button>
          <button onclick="excluir(${i})">🗑️</button>
        </td>
      </tr>
    `;
  });
}

btnNova.onclick = () => {
  form.classList.remove("hidden");
  editIndex = null;
};

document.getElementById("cancelar").onclick = () => {
  form.classList.add("hidden");
};

document.getElementById("salvar").onclick = () => {
  if (cpf.value.length !== 11) {
    alert("CPF inválido");
    return;
  }

  const terapeutas = getTerapeutas();

  const data = {
    nome: nome.value,
    cpf: cpf.value,
    email: email.value,
    unidade: unidade.value,
    folga: folga.value,
    diaFolga: folga.value === "Sim" ? diaFolga.value : "",
    status: status.value
  };

  if (editIndex === null) {
    terapeutas.push(data);
  } else {
    terapeutas[editIndex] = data;
  }

  saveTerapeutas(terapeutas);
  form.classList.add("hidden");
  render();
};

window.editar = (i) => {
  const t = getTerapeutas()[i];
  nome.value = t.nome;
  cpf.value = t.cpf;
  email.value = t.email;
  unidade.value = t.unidade;
  folga.value = t.folga;
  diaFolga.value = t.diaFolga;
  status.value = t.status;
  editIndex = i;
  form.classList.remove("hidden");
};

window.excluir = (i) => {
  const t = getTerapeutas();
  t.splice(i, 1);
  saveTerapeutas(t);
  render();
};

render();
