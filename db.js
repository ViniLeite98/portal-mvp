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
  // aceita "YYYY-MM-DD" e tenta normalizar
  if (!s) return "";
  const t = new Date(s);
  if (Number.isNaN(t.getTime())) return "";
  t.setHours(0,0,0,0);
  return t.toISOString().slice(0,10);
}

function fmtDateBR(iso){
  // "2026-01-27" -> "27/01/2026"
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

/**
 * Feriados (governança de datas)
 * schema: { id, data, titulo, obs, created_at }
 */
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

  if (!prunePast) return norm.sort((a,b)=> a.data.localeCompare(b.data));

  const t = todayISO();
  const filtered = norm.filter(x => keepToday ? (x.data >= t) : (x.data > t));
  filtered.sort((a,b)=> a.data.localeCompare(b.data));
  // salva podando (evita acumular passado)
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

/**
 * Terapeutas (só pra métrica no Início)
 * Espera schema mínimo: { Status }
 */
const KEY_TERAPEUTAS = "hara_terapeutas";

function countTerapeutasAtivas(){
  const arr = readJSON(KEY_TERAPEUTAS, []);
  if (!Array.isArray(arr)) return 0;
  return arr.filter(t => {
    const s = String(t.Status ?? t.status ?? "").trim().toLowerCase();
    return s === "" || s === "ativo";
  }).length;
}
