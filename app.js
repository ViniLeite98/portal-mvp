// ---------- Utils ----------
function nowISO(){ return new Date().toISOString(); }
function uid(){ return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16); }
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
function onlyDigits(s){ return (s||"").replace(/\D/g,""); }

// ---------- Storage helper ----------
function loadJSON(key, fallback){
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v ?? fallback;
  } catch { return fallback; }
}
function saveJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Keys ----------
const REQ_KEY  = "portal_mvp_requests_v1";
const TEAM_KEY = "portal_mvp_team_v1";
const TH_KEY   = "portal_mvp_therapists_v1";
const CERT_KEY = "portal_mvp_cert_options_v1";
const UNIT_KEY = "portal_mvp_units_v1";

// ---------- Nav rendering ----------
function renderNav(active){
  const el = document.getElementById("nav");
  if (!el) return;

  const mk = (href, label, isActive) =>
    `<a class="btn ${isActive ? "primary":""}" href="${href}">${label}</a>`;

  el.innerHTML = `
    ${mk("./index.html","Início", active==="home")}
    ${mk("./nova-solicitacao.html","Nova solicitação", active==="new")}
    ${mk("./solicitacoes.html","Solicitações", active==="list")}
    ${mk("./equipe.html","Equipe", active==="team")}
    ${mk("./terapeutas.html","Terapeutas", active==="therapists")}
    ${mk("./governanca.html","Governança", active==="governance")}
  `;
}

// ---------- Header KPIs ----------
function renderKpis(){
  const items = loadJSON(REQ_KEY, []);
  const total = items.length;
  const open = items.filter(x => x.status==="SUBMITTED" || x.status==="IN_REVIEW").length;
  const approved = items.filter(x => x.status==="APPROVED").length;

  const a = document.getElementById("kpiTotal");
  const b = document.getElementById("kpiOpen");
  const c = document.getElementById("kpiApproved");
  if (a) a.textContent = String(total);
  if (b) b.textContent = String(open);
  if (c) c.textContent = String(approved);
}

// ---------- Reset ----------
function wireResetButton(){
  const btn = document.getElementById("btnReset");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!confirm("Tem certeza que deseja apagar todos os dados locais?")) return;
    localStorage.removeItem(REQ_KEY);
    localStorage.removeItem(TEAM_KEY);
    localStorage.removeItem(TH_KEY);
    localStorage.removeItem(CERT_KEY);
    localStorage.removeItem(UNIT_KEY);
    location.reload();
  });
}

window.App = {
  nowISO, uid, escapeHtml, onlyDigits,
  loadJSON, saveJSON,
  REQ_KEY, TEAM_KEY, TH_KEY, CERT_KEY, UNIT_KEY,
  renderNav, renderKpis, wireResetButton
};
