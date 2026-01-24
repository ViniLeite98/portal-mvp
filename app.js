// ---------- Utils ----------
export function nowISO(){ return new Date().toISOString(); }
export function uid(){ return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16); }
export function fmt(iso){ try { return new Date(iso).toLocaleString("pt-BR"); } catch { return iso; } }
export function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
export function onlyDigits(s){ return (s||"").replace(/\D/g,""); }

// ---------- Storage helper ----------
export function loadJSON(key, fallback){
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v ?? fallback;
  } catch { return fallback; }
}
export function saveJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

// ---------- Keys ----------
export const REQ_KEY = "portal_mvp_requests_v1";
export const TEAM_KEY = "portal_mvp_team_v1";
export const TH_KEY = "portal_mvp_therapists_v1";
export const CERT_KEY = "portal_mvp_cert_options_v1";

// ---------- Nav rendering (mesmo menu em todas páginas) ----------
export function renderNav(active){
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
export function renderKpis(){
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
export function wireResetButton(){
  const btn = document.getElementById("btnReset");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (!confirm("Tem certeza que deseja apagar todos os dados locais?")) return;
    localStorage.removeItem(REQ_KEY);
    localStorage.removeItem(TEAM_KEY);
    localStorage.removeItem(TH_KEY);
    localStorage.removeItem(CERT_KEY);
    location.reload();
  });
}

