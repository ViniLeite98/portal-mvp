const STORAGE_KEY = "equipe";

const btnNova = document.getElementById("btnNova");
const btnCancelar = document.getElementById("btnCancelar");
const formContainer = document.getElementById("formContainer");
const form = document.getElementById("formEquipe");
const lista = document.getElementById("listaEquipe");

btnNova.onclick = () => formContainer.classList.remove("hidden");
btnCancelar.onclick = () => {
  form.reset();
  formContainer.classList.add("hidden");
};

function carregar() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (data.length === 0) {
    lista.innerHTML = `<p class="muted">Nenhuma terapeuta cadastrada.</p>`;
    return;
  }

  lista.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Unidade</th>
          <th>Horário</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(t => `
          <tr>
            <td>${t.nomeProf}</td>
            <td>${t.unidade}</td>
            <td>${t.entrada}–${t.saida}</td>
            <td>${t.status}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

form.onsubmit = e => {
  e.preventDefault();

  const nova = {
    id: Date.now(),
    nomeCompleto: nomeCompleto.value,
    nomeProf: nomeProf.value,
    cpf: cpf.value,
    email: email.value,
    unidade: unidade.value,
    entrada: entrada.value,
    saida: saida.value,
    status: document.querySelector("input[name=status]:checked").value
  };

  const atual = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  atual.push(nova);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atual));

  form.reset();
  formContainer.classList.add("hidden");
  carregar();
};

carregar();
