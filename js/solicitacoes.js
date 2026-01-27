const sel = document.getElementById("cpf");

load(KEYS.equipe).forEach(p => {
  const o = document.createElement("option");
  o.value = p.cpf;
  o.textContent = `${p.nome} (${p.cpf})`;
  sel.appendChild(o);
});

function render() {
  const ul = document.getElementById("lista");
  ul.innerHTML = "";
  load(KEYS.solicitacoes).forEach(s => {
    const li = document.createElement("li");
    li.textContent = s.cpf;
    ul.appendChild(li);
  });
}

function add() {
  const data = load(KEYS.solicitacoes);
  data.push({ cpf: sel.value });
  save(KEYS.solicitacoes, data);
  render();
}

render();
