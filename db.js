function uid(len = 10){
  return Math.random().toString(16).slice(2, 2+len);
}

function readJSON(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  }catch{
    return fallback;
  }
}

function writeJSON(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}

function todayISO(){
  const d = new Date();
  d.setHours(0,0,0,0);
  return d.toISOString().slice(0,10);
}

function normalizeISODate(s){
  if (!s) return "";
  const t = new Date(s);
  if (Number.isNaN(t.getTime())) return "";
  t.setHours(0,0,0,0);
  return t.toISOString().slice(0,10);
}

function fmtDateBR(iso){
  if (!iso) return "";
  const [y,m,d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

function weekdayPT(iso){
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  const dias = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
  return dias[d.getDay()];
}

/* -----------------------
   FERIADOS (Governança)
------------------------ */
const KEY_FERIADOS = "hara_feriados";

function getFeriados({prunePast=true, keepToday=true} = {}){
  const arr = readJSON(KEY_FERIADOS, []);
  const norm = (Array.isArray(arr) ? arr : [])
    .map(x => ({
      id: String(x.id || uid(8)),
      data: normalizeISODate(x.data || ""),
      titulo: String(x.titulo || "").trim(),
      obs: String(x.obs || "").trim(),
      created_at: String(x.created_at || "")
    }))
    .filter(x => x.data);

  norm.sort((a,b)=> a.data.localeCompare(b.data));

  if (!prunePast) return norm;

  const t = todayISO();
  const filtered = norm.filter(x => keepToday ? (x.data >= t) : (x.data > t));
  writeJSON(KEY_FERIADOS, filtered);
  return filtered;
}

function addFeriado({data, titulo, obs}){
  const arr = readJSON(KEY_FERIADOS, []);
  const row = {
    id: uid(8),
    data: normalizeISODate(data),
    titulo: String(titulo || "").trim(),
    obs: String(obs || "").trim(),
    created_at: new Date().toISOString().replace("T"," ").slice(0,19)
  };
  if (!row.data) throw new Error("Data inválida.");
  const next = [...(Array.isArray(arr)?arr:[]), row];
  writeJSON(KEY_FERIADOS, next);
  return row;
}

function deleteFeriado(id){
  const arr = readJSON(KEY_FERIADOS, []);
  const next = (Array.isArray(arr)?arr:[]).filter(x => String(x.id) !== String(id));
  writeJSON(KEY_FERIADOS, next);
}

/* -----------------------
   TERAPEUTAS (métrica)
------------------------ */
const KEY_TERAPEUTAS = "hara_terapeutas";

function countTerapeutasAtivas(){
  const arr = readJSON(KEY_TERAPEUTAS, []);
  if (!Array.isArray(arr)) return 0;
  return arr.filter(t => {
    const s = String(t.Status ?? t.status ?? "").trim().toLowerCase();
    return s === "" || s === "ativo";
  }).length;
}

function mapCpfToNome(){
  const arr = readJSON(KEY_TERAPEUTAS, []);
  const map = {};
  if (!Array.isArray(arr)) return map;
  arr.forEach(t => {
    const cpf = String(t.CPF ?? t.cpf ?? "").trim();
    const nome = String(t["Nome profissional"] ?? t.nome_profissional ?? t.nome ?? "").trim();
    if (cpf) map[cpf] = nome;
  });
  return map;
}

/* -----------------------
   SOLICITAÇÕES (dias folgados)
   Espera schema tipo Streamlit:
   { id, cpf, nome_profissional, dt_inicio, dt_fim, status }
------------------------ */
const KEY_SOLICITACOES = "hara_solicitacoes";

function getSolicitacoes(){
  // tenta chave padrão
  let arr = readJSON(KEY_SOLICITACOES, null);

  // fallback (se você usou outro nome)
  if (!arr) arr = readJSON("solicitacoes", []);
  if (!Array.isArray(arr)) return [];

  return arr.map(s => ({
    id: String(s.id || uid(10)),
    cpf: String(s.cpf || "").trim(),
    nome_profissional: String(s.nome_profissional || "").trim(),
    dt_inicio: normalizeISODate(s.dt_inicio || ""),
    dt_fim: normalizeISODate(s.dt_fim || ""),
    status: String(s.status || "").trim()
  }));
}

function daysInclusive(dtStartISO, dtEndISO){
  if (!dtStartISO || !dtEndISO) return 0;
  const a = new Date(dtStartISO + "T00:00:00");
  const b = new Date(dtEndISO + "T00:00:00");
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0;
  if (b < a) return 0;
  const diff = Math.round((b - a) / (1000*60*60*24));
  return diff + 1;
}

function diasFolgadosTop(n = 5){
  const cpfToNome = mapCpfToNome();
  const sol = getSolicitacoes().filter(s => (s.status || "").toLowerCase() === "aprovado");

  const agg = {}; // key cpf -> dias
  const name = {}; // key cpf -> nome
  sol.forEach(s => {
    const cpf = s.cpf || "";
    const dias = daysInclusive(s.dt_inicio, s.dt_fim);
    if (!dias) return;
    const k = cpf || (s.nome_profissional || "Sem CPF");
    agg[k] = (agg[k] || 0) + dias;

    const nm = s.nome_profissional || cpfToNome[cpf] || cpf || "Sem nome";
    name[k] = nm;
  });

  const rows = Object.keys(agg).map(k => ({
    key: k,
    nome: name[k] || k,
    dias: agg[k]
  }));

  rows.sort((a,b)=> b.dias - a.dias);
  return rows.slice(0, n);
}
