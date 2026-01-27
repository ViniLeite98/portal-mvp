const TH_KEY = "THERAPISTS_V1";

function getAll() {
  return loadJSON(TH_KEY, []);
}

function saveAll(arr) {
  saveJSON(TH_KEY, arr);
}

function onlyDigits(s) {
  return (s || "").replace(/\D+/g, "");
}

function isValidEmail(e) {
  return e.includes("@") && e.split("@")[1]?.includes(".");
}

function ativas() {
  return getAll().filter(t => (t.status || "").toLowerCase() === "ativo");
}

/* ---------------- LISTA ---------------- */

function renderList() {
  const data = ativas();
  document.getElementById("countAtivas").textContent =
    `${data.length} terapeutas ativas`;

  if (!data.length) {
    listBox.innerHTML = `<div class="muted">Nenhuma terapeuta cadastrada.</div>`;
    return;
  }

  listBox.innerHTML = data.map(t => `
    <div class="row">
      <div>
        <b>${escapeHtml(t.profName)}</b><br>
        <span class="muted">${t.weekOff === "Sim" ? "Folga: " + t.weekDay : "Sem folga semanal"}</span>
      </div>
      <div>${t.startDate || ""}</div>
      <div>${t.startHour || ""}–${t.endHour || ""}</div>
      <div>
        <button class="btn small" onclick="edit('${t.id}')">✏️</button>
        <button class="btn danger small" onclick="removeItem('${t.id}')">🗑️</button>
      </div>
    </div>
  `).join("");
}

/* ---------------- FORM ---------------- */

let editId = null;

function openForm(data = null) {
  editId = data?.id || null;
  formBox.style.display = "block";

  formBox.innerHTML = `
    <h3>${editId ? "Editar Terapeuta" : "Nova Terapeuta"}</h3>

    <div class="grid-2">
      <input id="nome" placeholder="Nome completo *" value="${data?.name || ""}">
      <input id="prof" placeholder="Nome profissional *" value="${data?.profName || ""}">
    </div>

    <div class="grid-3">
      <input id="cpf" placeholder="CPF *" value="${data?.cpf || ""}">
      <input id="email" placeholder="Email *" value="${data?.email || ""}">
      <input id="unit" placeholder="Unidade *" value="${data?.unit || ""}">
    </div>

    <div class="grid-3">
      <input id="startDate" type="date" value="${data?.startDate || ""}">
      <input id="startHour" type="time" value="${data?.startHour || ""}">
      <input id="endHour" type="time" value="${data?.endHour || ""}">
    </div>

    <div class="grid-3">
      <select id="weekOff">
        <option>Sim</option>
        <option ${data?.weekOff==="Não"?"selected":""}>Não</option>
      </select>
      <select id="weekDay">
        <option></option>
        ${["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"]
          .map(d=>`<option ${data?.weekDay===d?"selected":""}>${d}</option>`).join("")}
      </select>
      <select id="status">
        <option>Ativo</option>
        <option ${data?.status==="Inativo"?"selected":""}>Inativo</option>
      </select>
    </div>

    <div style="margin-top:12px">
      <button class="btn primary" onclick="save()">Salvar</button>
      <button class="btn" onclick="closeForm()">Cancelar</button>
    </div>
  `;
}

function closeForm() {
  formBox.style.display = "none";
  editId = null;
}

function save() {
  const nome = nomeEl.value.trim();
  const prof = profEl.value.trim();
  const cpf = onlyDigits(cpfEl.value);
  const email = emailEl.value.trim();
  const unit = unitEl.value.trim();

  if (!nome || !prof || cpf.length !== 11 || !isValidEmail(email) || !unit) {
    alert("Preencha todos os campos obrigatórios corretamente.");
    return;
  }

  const obj = {
    id: editId || crypto.randomUUID().slice(0, 8),
    name: nome,
    profName: prof,
    cpf,
    email,
    unit,
    startDate: startDate.value,
    startHour: startHour.value,
    endHour: endHour.value,
    weekOff: weekOff.value,
    weekDay: weekDay.value,
    status: status.value
  };

  let all = getAll();
  if (editId) {
    all = all.map(x => x.id === editId ? obj : x);
  } else {
    all.push(obj);
  }

  saveAll(all);
  closeForm();
  renderList();
}

function edit(id) {
  const t = getAll().find(x => x.id === id);
  openForm(t);
}

function removeItem(id) {
  if (!confirm("Deseja remover esta terapeuta?")) return;
  saveAll(getAll().filter(x => x.id !== id));
  renderList();
}

/* ---------------- INIT ---------------- */

renderList();
