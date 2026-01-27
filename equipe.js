let editId = null;

function renderEquipe(){
  const body = document.getElementById("equipeBody");
  const boxQtd = document.getElementById("qtdEquipe");
  body.innerHTML = "";

  const all = loadJSON(TH_KEY, []);
  const ativos = all.filter(t => (t.status || "Ativo") === "Ativo");

  boxQtd.textContent = ativos.length;

  ativos.forEach(t => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(t.profName || "")}</td>
      <td>${t.hasOff || ""}</td>
      <td>${t.offDay || ""}</td>
      <td>${t.startDate || ""}</td>
      <td>${(t.startTime||"")}–${(t.endTime||"")}</td>
      <td>
        <button onclick="edit('${t.id}')">✏️</button>
        <button onclick="del('${t.id}')">🗑️</button>
      </td>
    `;
    body.appendChild(tr);
  });
}

function openForm(edit=false){
  document.getElementById("formBox").style.display = "block";
  document.getElementById("formTitle").textContent = edit ? "Editar Terapeuta" : "Nova Terapeuta";
}

function closeForm(){
  document.getElementById("formBox").style.display = "none";
  editId = null;
}

function edit(id){
  const all = loadJSON(TH_KEY, []);
  const t = all.find(x => x.id === id);
  if (!t) return;

  editId = id;
  fNome.value = t.profName || "";
  fFolga.value = t.hasOff || "Sim";
  fDia.value = t.offDay || "";
  fEntrada.value = t.startTime || "";
  fSaida.value = t.endTime || "";
  fStatus.value = t.status || "Ativo";

  openForm(true);
}

function del(id){
  if (!confirm("Excluir terapeuta?")) return;
  saveJSON(TH_KEY, loadJSON(TH_KEY, []).filter(x => x.id !== id));
  renderEquipe();
}

btnNova.onclick = () => openForm();
btnCancelar.onclick = () => closeForm();

btnSalvar.onclick = () => {
  const obj = {
    id: editId || uid().slice(0,8),
    profName: fNome.value.trim(),
    hasOff: fFolga.value,
    offDay: fDia.value,
    startTime: fEntrada.value,
    endTime: fSaida.value,
    status: fStatus.value
  };

  const all = loadJSON(TH_KEY, []);
  const idx = all.findIndex(x => x.id === obj.id);

  if (idx >= 0) all[idx] = obj;
  else all.push(obj);

  saveJSON(TH_KEY, all);
  closeForm();
  renderEquipe();
};

renderEquipe();
