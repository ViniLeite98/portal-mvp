// ---------- Utils ----------
function nowISO(){ return new Date().toISOString(); }
function uid(){ return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16); }
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, (c) => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}
function onlyDigits(s){ return (s||"").replace(/\D/g,""); }

function loadJSON(key, fallback){
  try {
    const v = JSON.parse(localStorage.getItem(key) || "null");
    return v ?? fallback;
  } catch { return fallback; }
}
function saveJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function parseYYYYMMDD(s){
  // s: "YYYY-MM-DD"
  if (!s) return null;
  const m = String(s).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return null;
  const y = +m[1], mm = +m[2], d = +m[3];
  const dt = new Date(y, mm-1, d);
  if (Number.isNaN(dt.getTime())) return null;
  return dt;
}

function daysDiffInclusive(a, b){
  // a,b: Date (local)
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  const diff = Math.round((B - A) / (1000*60*60*24));
  return diff + 1;
}

function timeToMinutes(t){
  // "HH:MM"
  if (!t) return null;
  const m = String(t).trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const hh = +m[1], mm = +m[2];
  if (hh < 0 || hh > 23 || mm < 0 || mm > 59) return null;
  return hh*60 + mm;
}

function minutesToHHMM(min){
  if (min == null || Number.isNaN(min)) return "";
  const hh = Math.floor(min/60);
  const mm = Math.abs(min % 60);
  return String(hh).padStart(2,"0") + ":" + String(mm).padStart(2,"0");
}

// ---------- Keys ----------
const REQ_KEY      = "portal_mvp_requests_v1";
const TEAM_KEY     = "portal_mvp_team_v1";
const TH_KEY       = "portal_mvp_therapists_v1";
const CERT_KEY     = "portal_mvp_cert_options_v1";
const UNIT_KEY     = "portal_mvp_units_v1";
const GOV_KEY      = "portal_mvp_governance_v1";
const GOV_LOG_KEY  = "portal_mvp_governance_log_v1";
const PROX_KEY     = "portal_mvp_proximas_datas_v1";

// ---------- KPIs (solicitações) ----------
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

// ---------- KPIs (terapeutas) ----------
function getActiveTherapists(){
  const therapists = loadJSON(TH_KEY, []);
  return therapists.filter(t => {
    const st = (t.status || "").trim();
    return st === "" || st === "Ativo";
  });
}

function renderTherapistsKpis(){
  const el = document.getElementById("kpiTherapistsActive");
  if (!el) return;
  el.textContent = String(getActiveTherapists().length);
}

// ---------- Próximas Datas ----------
function ensureProxDefaults(){
  const items = loadJSON(PROX_KEY, null);
  if (!Array.isArray(items)) saveJSON(PROX_KEY, []);
}

function prunePastProx(keepToday=true){
  ensureProxDefaults();
  const items = loadJSON(PROX_KEY, []);
  const today = new Date();
  const T = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  const kept = items.filter(e => {
    const dt = parseYYYYMMDD(e.date);
    if (!dt) return false;
    const v = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate()).getTime();
    return keepToday ? v >= T : v > T;
  });

  saveJSON(PROX_KEY, kept);
  return kept;
}

// ---------- Força de trabalho / carga horária ----------
function workforceHist(activeTherapists, startHour=9, endHour=22){
  const hours = [];
  for (let h=startHour; h<=endHour; h++) hours.push(h);

  const counts = {};
  hours.forEach(h => counts[h]=0);

  for (const t of activeTherapists){
    const a = timeToMinutes(t.startTime);
    const b = timeToMinutes(t.endTime);
    if (a == null || b == null) continue;
    if (b <= a) continue;

    for (const h of hours){
      const hm = h * 60;
      if (a <= hm && hm < b) counts[h] += 1;
    }
  }

  return hours.map(h => ({ hour: h, count: counts[h] }));
}

function workloadRank(activeTherapists, topN=5){
  const rows = [];
  for (const t of activeTherapists){
    const name = (t.profName || t.fullName || "Sem nome").trim();
    const a = timeToMinutes(t.startTime);
    const b = timeToMinutes(t.endTime);
    if (a == null || b == null) continue;
    if (b <= a) continue;
    rows.push({ name, minutes: (b - a) });
  }
  rows.sort((x,y) => y.minutes - x.minutes);
  return rows.slice(0, topN).map(r => ({ name: r.name, hhmm: minutesToHHMM(r.minutes) }));
}

// ---------- Dias folgados (a partir de solicitações aprovadas) ----------
function daysOffRank(topN=5){
  const reqs = loadJSON(REQ_KEY, []);
  const approved = reqs.filter(r => r.status === "APPROVED");

  const agg = new Map();

  for (const r of approved){
    // aceita vários nomes de campo (se você for evoluindo o formulário)
    const s1 = r.dt_inicio || r.dtInicio || r.startDate || "";
    const s2 = r.dt_fim    || r.dtFim    || r.endDate   || "";
    const d1 = parseYYYYMMDD(s1);
    const d2 = parseYYYYMMDD(s2);
    if (!d1 || !d2) continue;

    const dias = daysDiffInclusive(d1, d2);
    if (dias <= 0) continue;

    const key = (r.nome_profissional || r.nomeProfissional || r.requester || r.cpf || "Sem nome").trim();
    if (!key) continue;

    agg.set(key, (agg.get(key) || 0) + dias);
  }

  const rows = Array.from(agg.entries()).map(([name, days]) => ({ name, days }));
  rows.sort((a,b) => b.days - a.days);
  return rows.slice(0, topN);
}

// ---------- Reset ----------
function wireResetButton(){
  const btn = document.getElementById("btnReset");
  if (!btn) return;

  btn.addEventListener("click", () => {
    if (!confirm("Tem certeza que deseja apagar todos os dados locais?")) return;
    [
      REQ_KEY, TEAM_KEY, TH_KEY, CERT_KEY, UNIT_KEY, GOV_KEY, GOV_LOG_KEY, PROX_KEY
    ].forEach(k => localStorage.removeItem(k));
    location.reload();
  });
}

window.App = {
  nowISO, uid, escapeHtml, onlyDigits,
  loadJSON, saveJSON,
  parseYYYYMMDD, daysDiffInclusive,
  timeToMinutes, minutesToHHMM,
  REQ_KEY, TEAM_KEY, TH_KEY, CERT_KEY, UNIT_KEY, GOV_KEY, GOV_LOG_KEY, PROX_KEY,
  renderKpis, getActiveTherapists, renderTherapistsKpis,
  prunePastProx, workforceHist, workloadRank, daysOffRank,
  wireResetButton
};
