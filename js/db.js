function uid(len=8){
  return Math.random().toString(16).slice(2,2+len);
}

function readJSON(key, fallback){
  try{
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  }catch{
    return fallback;
  }
}

function writeJSON(key,val){
  localStorage.setItem(key, JSON.stringify(val));
}

function fmtDateBR(iso){
  if(!iso) return "";
  const [y,m,d]=iso.split("-");
  return `${d}/${m}/${y}`;
}

function weekdayPT(iso){
  const d=new Date(iso+"T00:00:00");
  return ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"][d.getDay()];
}

/* ===== FERIADOS ===== */
const KEY_FERIADOS="hara_feriados";

function getFeriados(){
  return readJSON(KEY_FERIADOS, []).sort((a,b)=>a.data.localeCompare(b.data));
}

function addFeriado(f){
  const arr=getFeriados();
  arr.push({id:uid(),...f});
  writeJSON(KEY_FERIADOS,arr);
}

function deleteFeriado(id){
  writeJSON(KEY_FERIADOS, getFeriados().filter(x=>x.id!==id));
}

/* ===== TERAPEUTAS ===== */
const KEY_TERAPEUTAS="hara_terapeutas";

function getTerapeutas(){
  return readJSON(KEY_TERAPEUTAS, []);
}

function countTerapeutasAtivas(){
  return getTerapeutas().filter(t=>(t.status||"ativo")==="ativo").length;
}
