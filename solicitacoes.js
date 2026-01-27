const btnNova = document.getElementById("btnNova");
const formContainer = document.getElementById("formContainer");
const btnCancelar = document.getElementById("btnCancelar");
const form = document.getElementById("formSolicitacao");
const lista = document.getElementById("listaSolicitacoes");

const STORAGE_KEY = "solicitacoes";

btnNova.onclick = () => {
  formContainer.classList.remove("hidden");
};

btnCancelar.onclick = () => {
  form.reset();
  formContainer.classList.add("hidden");
};

function carregar() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  if (data.length === 0) {
    lista.innerHTML = `<p class="muted">Nenhuma solicitação registrada.</p>`;
    return;
  }

  lista.innerHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Tipo</th>
          <th>Período</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${data.map(s => `
          <tr>
            <td>${s.nome}</td>
            <td>${s.tipo}</td>
            <td>${s.inicio} → ${s.fim}</td>
            <td>${s.status}</td>
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
    nome: nome.value,
    tipo: tipo.value,
    inicio: inicio.value,
    fim: fim.value,
    obs: obs.value,
    status: "Aberta"
  };

  const atual = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  atual.push(nova);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(atual));

  form.reset();
  formContainer.classList.add("hidden");
  carregar();
};

carregar();
