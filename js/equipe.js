function render() {
  const ul = document.getElementById("lista");
  ul.innerHTML = "";

  load(KEYS.equipe).forEach((p, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${p.nome} (${p.cpf})
      <button onclick="del(${i})">Excluir</button>`;
    ul.appendChild(li);
  });
}

function add() {
  const nome = document.getElementById("nome").value.trim();
  const cpf = document.getElementById("cpf").value.trim();
  if (!nome || !cpf) return alert("Preencha tudo");

  const data = load(KEYS.equipe);
  data.push({ nome, cpf });
  save(KEYS.equipe, data);

  document.getElementById("nome").value = "";
  document.getElementById("cpf").value = "";
  render();
}

function del(i) {
  const data = load(KEYS.equipe);
  data.splice(i, 1);
  save(KEYS.equipe, data);
  render();
}

render();
