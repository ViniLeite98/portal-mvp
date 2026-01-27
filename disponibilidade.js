const DIAS_PT = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

const monthNames = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

function norm(s){
  return (s||"").toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function folgaIdx(dia){
  const map = {
    segunda:1, terca:2, quarta:3, quinta:4,
    sexta:5, sabado:6, domingo:0
  };
  return map[norm(dia).replace("-feira","")] ?? null;
}

function getAtivas(){
  return loadJSON(TH_KEY, []).filter(t =>
    (t.status||"").toLowerCase() === "ativo"
  );
}

function getAprovadas(){
  return loadJSON(REQ_KEY, []).filter(r =>
    r.status === "Aprovado"
  );
}

function daterange(d1,d2){
  const out=[];
  for(let d=new Date(d1); d<=d2; d.setDate(d.getDate()+1)){
    out.push(new Date(d));
  }
  return out;
}

function computeDay(date, ativas, aprov){
  const total = ativas.length;
  const disp=[], folga=[], solic=[], naoIni=[];

  ativas.forEach(t=>{
    const nome = t.profName || "Sem nome";

    if (t.startDate && new Date(date) < new Date(t.startDate)){
      naoIni.push(nome); return;
    }

    if (t.weekOff==="Sim" && folgaIdx(t.weekDay)===date.getDay()){
      folga.push(nome); return;
    }

    const ind = aprov.find(r=>{
      if (r.cpf!==t.cpf) return false;
      const di=new Date(r.dt_inicio), df=new Date(r.dt_fim);
      return date>=di && date<=df;
    });

    if (ind){ solic.push(nome); return; }

    disp.push(nome);
  });

  return {total,disp,folga,solic,naoIni};
}

function coverageClass(d, disp, total){
  const today = new Date(); today.setHours(0,0,0,0);
  if (d.getDay()===0 || d<today) return "hara-gray";
  const r = disp/total;
  if (r>=0.7) return "hara-green";
  if (r>=0.4) return "hara-yellow";
  return "hara-red";
}

function render(){
  const mes = +mesSel.value;
  const ano = +anoSel.value;

  const ativas = getAtivas();
  const aprov = getAprovadas();

  const first = new Date(ano,mes,1);
  const last  = new Date(ano,mes+1,0);

  let html="<table class='hara-cal'><thead><tr>";
  DIAS_PT.forEach(d=>html+=`<th>${d}</th>`);
  html+="</tr></thead><tbody><tr>";

  for(let i=0;i<first.getDay();i++) html+="<td></td>";

  for(let d=new Date(first); d<=last; d.setDate(d.getDate()+1)){
    const info = computeDay(d,ativas,aprov);
    const cls = coverageClass(d,info.disp.length,info.total);

    html+=`
      <td class="${cls}" onclick="showDetail('${d.toISOString()}')">
        <div class="hara-day">${d.getDate()}</div>
        <div class="hara-count">${info.disp.length}/${info.total}</div>
      </td>`;

    if (d.getDay()===6) html+="</tr><tr>";
  }

  html+="</tr></tbody></table>";
  calendarBox.innerHTML=html;
  showDetail(new Date().toISOString());
}

function showDetail(iso){
  const d = new Date(iso);
  const ativas = getAtivas();
  const aprov = getAprovadas();
  const info = computeDay(d,ativas,aprov);

  detailBox.innerHTML=`
    <div class="card">
      <h3>${d.toLocaleDateString()}</h3>
      <b>Disponíveis (${info.disp.length}/${info.total})</b>
      <ul>${info.disp.map(n=>`<li>${n}</li>`).join("")}</ul>
      <b>Folga</b>
      <ul>${info.folga.map(n=>`<li>${n}</li>`).join("")||"—"}</ul>
      <b>Solicitação</b>
      <ul>${info.solic.map(n=>`<li>${n}</li>`).join("")||"—"}</ul>
      <b>Não iniciou</b>
      <ul>${info.naoIni.map(n=>`<li>${n}</li>`).join("")||"—"}</ul>
    </div>`;
}

function init(){
  for(let m=0;m<12;m++){
    mesSel.innerHTML+=`<option value="${m}">${monthNames[m]}</option>`;
  }
  const y=new Date().getFullYear();
  for(let a=y-2;a<=y+2;a++){
    anoSel.innerHTML+=`<option>${a}</option>`;
  }
  mesSel.value=new Date().getMonth();
  anoSel.value=y;
  mesSel.onchange=render;
  anoSel.onchange=render;
  render();
}

init();
