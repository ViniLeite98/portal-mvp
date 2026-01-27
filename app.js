/*************************
 * BASE LOCAL (localStorage)
 *************************/

// ---------- INIT ----------
function initStorage() {
  if (!localStorage.getItem("terapeutas")) {
    localStorage.setItem("terapeutas", JSON.stringify([]));
  }
  if (!localStorage.getItem("solicitacoes")) {
    localStorage.setItem("solicitacoes", JSON.stringify([]));
  }
  if (!localStorage.getItem("proximas_datas")) {
    localStorage.setItem("proximas_datas", JSON.stringify([]));
  }
}

initStorage();

// ---------- HELPERS TERAPEUTAS ----------
function getTerapeutas() {
  return JSON.parse(localStorage.getItem("terapeutas")) || [];
}

function saveTerapeutas(lista) {
  localStorage.setItem("terapeutas", JSON.stringify(lista));
}

function getTerapeutasAtivas() {
  return getTerapeutas().filter(t => (t.status || "Ativo") === "Ativo");
}

// ---------- HELPERS SOLICITAÇÕES ----------
function getSolicitacoes() {
  return JSON.parse(localStorage.getItem("solicitacoes")) || [];
}

function saveSolicitacoes(lista) {
  localStorage.setItem("solicitacoes", JSON.stringify(lista));
}

// ---------- HELPERS GERAIS ----------
function gerarId() {
  return crypto.randomUUID().slice(0, 8);
}

function onlyDigits(v) {
  return (v || "").replace(/\D+/g, "");
}

function isEmailValido(email) {
  return email.includes("@") && email.includes(".");
}

function formatHora(h) {
  if (!h) return "";
  return h.slice(0, 5);
}
