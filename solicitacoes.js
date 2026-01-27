const ADMIN_PASS = "2026";
let currentTab = "nova";

function setTab(t){
  currentTab = t;
  ["nova","aprovacoes","gerenciar"].forEach(x=>{
    document.getElementById("tab-"+x).style.display = (x===t?"block":"none");
  });
}

function loadEquipeMap(){
  const team = loadJSON(TH_KEY, []);
  const map = {};
  team.forEach(t=>{
    if (t.cpf) map[t.cpf] = t.profName;
  });
  return map;
}

function initNova(){
  const map = loadEquipeMap();
  const sel = document.getElementById("cpfSel");
  sel.innerHTML = "";

  Object.keys(map).forEach(cpf=>{
    const o = document.createElement("option");
    o.value = cpf;
    o.textContent = `${cpf} — ${map[cpf]}`;
    sel.appendChild(o);
  });

  sel.onchange = () => {
    document.getElementById("nomeProf").value = map[sel.value] || "";
  };

  sel.onchange();
}

function salvarSolicitacao(){
  const cpf = cpfSel.value;
  const nome = nomeProf.value;
  const di = dtInicio.value;
  const df = dtFim.value;
  const tipoV = tipo.value;
  const just = justificativa.value.trim();

  if (!cpf || !just || df < di){
    msgNova.textContent = "Dados inválidos.";
    return;
  }

  const sol = loadJSON(REQ_KEY, []);
  sol.push({
    id: uid().slice(0,10),
    dt_pedido: new Date().toISOString().slice(0,10),
    cpf,
    nome_profissional: nome,
    dt_inicio: di,
    dt_fim: df,
    tipo: tipoV,
    justificativa: just,
    status: "Pendente",
    aprovador: "",
    dt_decisao: ""
  });

  saveJSON(REQ_KEY, sol);
  msgNova.textContent = "Solicitação registrada.";
}

function renderPendentes(){
  if (adminPass.value !== ADMIN_PASS){
    listaPendentes.innerHTML = "<div class='muted'>Senha admin necessária.</div>";
    return;
  }

  const nomeAprov = aprovadorNome.value.trim();
  const pend = loadJSON(REQ_KEY, []).filter(x=>x.status==="Pendente");

  listaPendentes.innerHTML = pend.map(r=>`
    <div class="card" style="margin-top:8px;">
      <b>${r.nome_profissional}</b> (${r.cpf})<br>
      ${r.dt_inicio} → ${r.dt_fim} | ${r.tipo}<br>
      ${r.justificativa}<br>
      <button onclick="decidir('${r.id}','Aprovado')">✅</button>
      <button onclick="decidir('${r.id}','Rejeitado')">❌</button>
    </div>
  `).join("");
}

function decidir(id, status){
  const nomeAprov = aprovadorNome.value.trim();
  if (!nomeAprov) return alert("Informe aprovador.");

  const sol = loadJSON(REQ_KEY, []);
  const r = sol.find(x=>x.id===id);
  if (!r) return;

  r.status = status;
  r.aprovador = nomeAprov;
  r.dt_decisao = new Date().toISOString();

  saveJSON(REQ_KEY, sol);
  renderPendentes();
}

function renderTodas(){
  const st = fStatus.value;
  let all = loadJSON(REQ_KEY, []);
  if (st !== "Todos") all = all.filter(x=>x.status===st);

  listaTodas.innerHTML = all.map(r=>`
    <div class="card" style="margin-top:6px;">
      <b>${r.nome_profissional}</b> | ${r.status}<br>
      ${r.dt_inicio} → ${r.dt_fim} | ${r.tipo}<br>
      ${r.justificativa}
    </div>
  `).join("");
}

adminPass?.addEventListener("input", renderPendentes);
fStatus?.addEventListener("change", renderTodas);

initNova();
renderPendentes();
renderTodas();
