/**
 * chatbot.js — Chatbot flutuante com Claude API
 * Inclua este arquivo em qualquer página após supabase.js e auth.js:
 * <script src="assets/js/chatbot.js"></script>
 */

(function() {

/* ── CSS ── */
const style = document.createElement("style");
style.textContent = `
#chatbot-btn {
  position:fixed;bottom:28px;right:28px;z-index:9999;
  width:52px;height:52px;border-radius:50%;
  background:linear-gradient(135deg,#1f2937,#374151);
  color:#fff;border:none;cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  font-size:22px;box-shadow:0 4px 20px rgba(0,0,0,.25);
  transition:all .2s;
}
#chatbot-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(0,0,0,.3);}
#chatbot-btn .notif{
  position:absolute;top:-3px;right:-3px;
  width:14px;height:14px;background:#ef4444;border-radius:50%;
  border:2px solid #fff;display:none;
}

#chatbot-modal {
  position:fixed;bottom:92px;right:28px;z-index:9999;
  width:400px;max-width:calc(100vw - 40px);
  height:540px;max-height:calc(100vh - 120px);
  background:#fff;border-radius:18px;
  box-shadow:0 20px 60px rgba(0,0,0,.2);
  display:none;flex-direction:column;overflow:hidden;
  animation:chatUp .25s ease;
}
@keyframes chatUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
#chatbot-modal.open{display:flex;}

.chat-header{
  background:linear-gradient(135deg,#1f2937,#374151);
  color:#fff;padding:14px 18px;
  display:flex;align-items:center;gap:10px;
  flex-shrink:0;
}
.chat-header-avatar{
  width:36px;height:36px;border-radius:10px;
  background:rgba(255,255,255,.15);
  display:flex;align-items:center;justify-content:center;font-size:18px;
}
.chat-header-info{flex:1;}
.chat-header-info .name{font-size:14px;font-weight:700;}
.chat-header-info .status{font-size:11px;opacity:.7;display:flex;align-items:center;gap:4px;}
.chat-header-info .status::before{content:"";width:6px;height:6px;background:#34d399;border-radius:50%;display:inline-block;}
.chat-close{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:.7;padding:4px;}
.chat-close:hover{opacity:1;}

.chat-messages{
  flex:1;overflow-y:auto;padding:16px;
  display:flex;flex-direction:column;gap:10px;
  background:#f8fafc;
}
.chat-messages::-webkit-scrollbar{width:4px;}
.chat-messages::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:2px;}

.msg{display:flex;gap:8px;align-items:flex-end;max-width:90%;}
.msg.user{flex-direction:row-reverse;align-self:flex-end;}
.msg-bubble{
  padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.5;
  max-width:100%;word-break:break-word;
}
.msg.bot  .msg-bubble{background:#fff;color:#111827;border:1px solid #e5e7eb;border-bottom-left-radius:4px;}
.msg.user .msg-bubble{background:#1f2937;color:#fff;border-bottom-right-radius:4px;}
.msg-avatar{
  width:28px;height:28px;border-radius:8px;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;font-size:13px;
}
.msg.bot  .msg-avatar{background:#eff6ff;color:#2563eb;}
.msg.user .msg-avatar{background:#374151;color:#fff;}
.msg-time{font-size:10px;color:#9ca3af;margin-top:4px;text-align:right;}

.typing{display:flex;gap:4px;align-items:center;padding:10px 14px;}
.typing span{width:7px;height:7px;background:#9ca3af;border-radius:50%;animation:bounce .8s infinite;}
.typing span:nth-child(2){animation-delay:.15s;}
.typing span:nth-child(3){animation-delay:.3s;}
@keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}

.chat-suggestions{
  padding:8px 12px;display:flex;gap:6px;flex-wrap:wrap;
  border-top:1px solid #f3f4f6;background:#fff;flex-shrink:0;
}
.sug-btn{
  font-size:11px;padding:5px 10px;border-radius:99px;
  border:1px solid #e5e7eb;background:#f9fafb;color:#374151;
  cursor:pointer;white-space:nowrap;transition:.15s;
}
.sug-btn:hover{background:#eff6ff;border-color:#bfdbfe;color:#1d4ed8;}

.chat-input-wrap{
  padding:12px;border-top:1px solid #f3f4f6;background:#fff;
  display:flex;gap:8px;align-items:flex-end;flex-shrink:0;
}
.chat-input{
  flex:1;border:1px solid #e5e7eb;border-radius:10px;
  padding:9px 12px;font-size:13px;resize:none;
  max-height:80px;font-family:inherit;line-height:1.4;
  outline:none;transition:.2s;
}
.chat-input:focus{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.1);}
.chat-send{
  width:36px;height:36px;border-radius:10px;
  background:#1f2937;color:#fff;border:none;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:14px;flex-shrink:0;transition:.15s;
}
.chat-send:hover{background:#111827;}
.chat-send:disabled{opacity:.4;cursor:not-allowed;}
`;
document.head.appendChild(style);

/* ── HTML ── */
const html = `
<button id="chatbot-btn" title="Assistente Hara">
  <i class="fa fa-robot"></i>
  <div class="notif" id="chatNotif"></div>
</button>

<div id="chatbot-modal">
  <div class="chat-header">
    <div class="chat-header-avatar"><i class="fa fa-robot"></i></div>
    <div class="chat-header-info">
      <div class="name">Assistente Hara</div>
      <div class="status">Online — pergunta sobre atendimentos</div>
    </div>
    <button class="chat-close" onclick="chatClose()"><i class="fa fa-times"></i></button>
  </div>

  <div class="chat-messages" id="chatMessages"></div>

  <div class="chat-suggestions" id="chatSugs">
    <button class="sug-btn" onclick="chatSug(this)">Quais dias a Yumi não atende?</button>
    <button class="sug-btn" onclick="chatSug(this)">Top 5 serviços de 2025</button>
    <button class="sug-btn" onclick="chatSug(this)">Quem mais atendeu em abril?</button>
    <button class="sug-btn" onclick="chatSug(this)">Ticket médio por profissional</button>
  </div>

  <div class="chat-input-wrap">
    <textarea class="chat-input" id="chatInput" placeholder="Pergunte sobre os atendimentos..." rows="1"></textarea>
    <button class="chat-send" id="chatSendBtn" onclick="chatSend()">
      <i class="fa fa-paper-plane"></i>
    </button>
  </div>
</div>`;

const wrapper = document.createElement("div");
wrapper.innerHTML = html;
document.body.appendChild(wrapper);

/* ── ESTADO ── */
let chatHistory = [];
let chatData    = null; // resumo dos dados carregado uma vez
let chatLoading = false;
let chatOpen    = false;

/* ── TOGGLE ── */
window.chatClose = function(){
  document.getElementById("chatbot-modal").classList.remove("open");
  chatOpen = false;
};

document.getElementById("chatbot-btn").addEventListener("click", async () => {
  const modal = document.getElementById("chatbot-modal");
  chatOpen = !chatOpen;
  if(chatOpen){
    modal.classList.add("open");
    document.getElementById("chatNotif").style.display = "none";
    if(chatHistory.length === 0){
      addMsg("bot", "Olá! 👋 Sou o assistente do Hara Spa. Posso responder perguntas sobre atendimentos, profissionais, serviços e muito mais. O que você quer saber?");
    }
    if(!chatData) await carregarContexto();
    document.getElementById("chatInput").focus();
  } else {
    modal.classList.remove("open");
  }
});

/* ── CARREGAR CONTEXTO DOS DADOS ── */
async function carregarContexto(){
  try {
    // Buscar resumo do legado
    let todos = [], from = 0;
    while(true){
      const {data, error} = await client.from("legado_atendimentos")
        .select("profissional,data,cliente,servico,situacao,valor,comissao,hora_inicio")
        .or("situacao.is.null,situacao.eq.-,situacao.eq.Confirmado,situacao.eq.Nenhum")
        .range(from, from+999);
      if(error||!data||!data.length) break;
      todos = todos.concat(data);
      if(data.length < 1000) break;
      from += 1000;
    }

    // Montar resumo compacto para o contexto
    const profMap = {}, servMap = {}, cliMap = {};
    const diasMap = {}; // prof -> set de dias da semana que NAO atende

    todos.forEach(r => {
      if(!r.profissional || !r.data) return;
      const p = r.profissional;
      if(!profMap[p]) profMap[p] = {n:0, rec:0, com:0, datas:new Set(), clientes:new Set()};
      profMap[p].n++;
      profMap[p].rec += r.valor||0;
      profMap[p].com += r.comissao||0;
      profMap[p].datas.add(r.data);
      if(r.cliente) profMap[p].clientes.add(r.cliente);
      if(r.servico) servMap[r.servico] = (servMap[r.servico]||0)+1;
      if(r.cliente) cliMap[r.cliente]  = (cliMap[r.cliente]||0)+1;
    });

    // Dias da semana que cada profissional atende
    const DIAS_PT = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
    const profDias = {};
    Object.entries(profMap).forEach(([p, v]) => {
      const dowSet = new Set();
      [...v.datas].forEach(d => {
        const dow = new Date(d+"T12:00:00").getDay();
        dowSet.add(DIAS_PT[dow]);
      });
      profDias[p] = [...dowSet].sort();
    });

    // Top serviços
    const topServs = Object.entries(servMap).sort((a,b)=>b[1]-a[1]).slice(0,20);
    // Top clientes
    const topClis  = Object.entries(cliMap).sort((a,b)=>b[1]-a[1]).slice(0,20);
    // Resumo por profissional
    const profResumo = Object.entries(profMap)
      .sort((a,b)=>b[1].n-a[1].n)
      .map(([p,v]) => ({
        nome: p,
        atendimentos: v.n,
        receita: Math.round(v.rec),
        comissao: Math.round(v.com),
        clientes: v.clientes.size,
        diasSemana: profDias[p],
        ticketMedio: Math.round(v.n ? v.rec/v.n : 0)
      }));

    chatData = {
      totalAtendimentos: todos.length,
      periodo: { inicio: todos.map(r=>r.data).filter(Boolean).sort()[0], fim: todos.map(r=>r.data).filter(Boolean).sort().reverse()[0] },
      profissionais: profResumo,
      topServicos: topServs.map(([s,n]) => ({servico:s, atendimentos:n})),
      topClientes: topClis.map(([c,n]) => ({cliente:c, atendimentos:n})),
    };

  } catch(e) {
    console.error("Erro ao carregar contexto chatbot:", e);
  }
}

/* ── MENSAGENS ── */
function addMsg(tipo, texto){
  const msgs = document.getElementById("chatMessages");
  const hora  = new Date().toLocaleTimeString("pt-BR", {hour:"2-digit", minute:"2-digit"});
  const icon  = tipo === "bot" ? "fa-robot" : "fa-user";
  const div   = document.createElement("div");
  div.className = `msg ${tipo}`;
  div.innerHTML = `
    <div class="msg-avatar"><i class="fa ${icon}"></i></div>
    <div>
      <div class="msg-bubble">${texto.replace(/\n/g,"<br>")}</div>
      <div class="msg-time">${hora}</div>
    </div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  chatHistory.push({role: tipo === "bot" ? "assistant" : "user", content: texto});
}

function addTyping(){
  const msgs = document.getElementById("chatMessages");
  const div  = document.createElement("div");
  div.className = "msg bot";
  div.id = "typingIndicator";
  div.innerHTML = `<div class="msg-avatar"><i class="fa fa-robot"></i></div><div class="msg-bubble"><div class="typing"><span></span><span></span><span></span></div></div>`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping(){
  const el = document.getElementById("typingIndicator");
  if(el) el.remove();
}

/* ── SUGESTÕES ── */
window.chatSug = function(btn){
  document.getElementById("chatInput").value = btn.textContent;
  chatSend();
};

/* ── ENVIAR ── */
window.chatSend = async function(){
  if(chatLoading) return;
  const input = document.getElementById("chatInput");
  const texto = input.value.trim();
  if(!texto) return;

  // Esconder sugestões após primeiro uso
  document.getElementById("chatSugs").style.display = "none";

  input.value = "";
  input.style.height = "auto";
  addMsg("user", texto);

  chatLoading = true;
  document.getElementById("chatSendBtn").disabled = true;
  addTyping();

  try {
    const contexto = chatData ? JSON.stringify(chatData, null, 2) : "Dados ainda carregando...";

    const systemPrompt = `Você é o assistente inteligente do Hara Spa, um spa de massagens em São Paulo.
Você tem acesso aos dados de atendimentos do spa e deve responder perguntas de forma clara, objetiva e em português brasileiro.

DADOS DISPONÍVEIS:
${contexto}

INSTRUÇÕES:
- Responda sempre em português brasileiro
- Seja direto e conciso
- Use os dados acima para responder com precisão
- Quando falar de valores monetários, use o formato R$ X.XXX,XX
- Quando falar de dias da semana que um profissional NÃO atende, calcule quais dias da semana estão faltando em relação a Segunda-Sábado
- Formate listas com quebras de linha usando \\n
- Se não tiver os dados para responder, diga honestamente`;

    // Gemini API — chamada direta do browser (sem proxy)
    const GEMINI_KEY = "AIzaSyDsSKKobsWAtV3VqMNHIVsb_nWC2HCMpLE";
    const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-04-17:generateContent?key=${GEMINI_KEY}`;

    // Montar historico no formato Gemini
    const geminiHistory = chatHistory
      .filter(m => m.role === "user" || m.role === "assistant")
      .slice(-10)
      .map(m => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: geminiHistory,
        generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
      })
    });

    const data = await response.json();
    const resposta = data.candidates?.[0]?.content?.parts?.[0]?.text
      || data.error?.message
      || "Desculpe, não consegui processar sua pergunta.";

    removeTyping();
    addMsg("bot", resposta);

    // Notificação se modal fechado
    if(!chatOpen){
      document.getElementById("chatNotif").style.display = "block";
    }

  } catch(e) {
    removeTyping();
    addMsg("bot", "Erro ao conectar com o assistente. Verifique sua conexão e tente novamente.");
    console.error(e);
  }

  chatLoading = false;
  document.getElementById("chatSendBtn").disabled = false;
  input.focus();
};

/* ── ENTER para enviar ── */
document.getElementById("chatInput").addEventListener("keydown", e => {
  if(e.key === "Enter" && !e.shiftKey){
    e.preventDefault();
    chatSend();
  }
});

/* ── Auto-resize textarea ── */
document.getElementById("chatInput").addEventListener("input", function(){
  this.style.height = "auto";
  this.style.height = Math.min(this.scrollHeight, 80) + "px";
});

})();
