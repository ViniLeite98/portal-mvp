// sidebar.js — menu dinâmico por role
// Depende de window.usuarioLogado definido pelo auth.js

// Função logout — usa client se disponível, senão limpa sessão manualmente
window.logout = async function(){
  try {
    if(typeof client !== "undefined") await client.auth.signOut();
  } catch(e){}
  // Limpar storage do Supabase manualmente como fallback
  Object.keys(localStorage).forEach(k=>{ if(k.startsWith("sb-")) localStorage.removeItem(k); });
  window.location.href = "login.html";
};

(function(){
  const pag = window.location.pathname.split("/").pop() || "index.html";

  // Estrutura completa do menu
  const TODOS = ["admin", "operadora"];
  const MENU = [
    {
      tipo: "link",
      href: "dashboard.html",
      icon: "fa-chart-line",
      label: "Dashboard",
      roles: ["admin"], // só admin
    },
    { tipo: "sep" },
    { tipo: "titulo", label: "CADASTROS", roles: TODOS },
    {
      tipo: "link",
      href: "equipe.html",
      icon: "fa-users",
      label: "Equipe",
      roles: TODOS,
    },
    {
      tipo: "link",
      href: "clientes.html",
      icon: "fa-user",
      label: "Clientes",
      roles: TODOS,
    },
    {
      tipo: "link",
      href: "servicos.html",
      icon: "fa-hand-holding-heart",
      label: "Serviços",
      roles: TODOS,
    },
    {
      tipo: "link",
      href: "certificacoes.html",
      icon: "fa-certificate",
      label: "Certificações",
      roles: TODOS,
    },
    { tipo: "sep" },
    { tipo: "titulo", label: "OPERACIONAL", roles: TODOS },
    {
      tipo: "link",
      href: "atendimentos.html",
      icon: "fa-calendar-check",
      label: "Atendimentos",
      roles: TODOS,
    },
    {
      tipo: "link",
      href: "escalas.html",
      icon: "fa-calendar-days",
      label: "Escalas",
      roles: TODOS,
    },
    {
      tipo: "link",
      href: "solicitacoes.html",
      icon: "fa-file-lines",
      label: "Solicitações",
      roles: TODOS,
    },
    { tipo: "sep" },
    { tipo: "titulo", label: "FINANCEIRO", roles: TODOS },
    {
      tipo: "link",
      href: "despesas.html",
      icon: "fa-receipt",
      label: "Despesas",
      roles: TODOS,
    },
    {
      tipo: "link",
      href: "fluxo_caixa.html",
      icon: "fa-cash-register",
      label: "Fluxo de Caixa",
      roles: TODOS,
    },
    {
      tipo: "link",
      href: "estoque.html",
      icon: "fa-boxes-stacked",
      label: "Estoque",
      roles: TODOS,
    },
    { tipo: "sep", roles: ["admin"] },
    { tipo: "titulo", label: "CONFIGURAÇÕES", roles: ["admin"] },
    {
      tipo: "link",
      href: "parametros.html",
      icon: "fa-sliders",
      label: "Parâmetros",
      roles: ["admin"],
    },
  ];

  function renderSidebar(role, nome) {
    let html = `<div class="sidebar">`;
    html += `<div class="logo">Hara Spa</div>`;

    // Badge do usuário
    const inicial = (nome || "U").charAt(0).toUpperCase();
    const roleLabel = role === "admin" ? "Administrador" : "Operadora";
    html += `
      <div style="padding:12px 16px 16px;border-bottom:1px solid #374151;margin-bottom:8px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:34px;height:34px;border-radius:50%;background:#2563eb;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">${inicial}</div>
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;color:#f9fafb;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${nome || "Usuário"}</div>
            <div style="font-size:10px;color:#9ca3af;">${roleLabel}</div>
          </div>
        </div>
        <button onclick="logout()" style="width:100%;padding:6px;background:rgba(255,255,255,.07);border:1px solid #374151;border-radius:7px;color:#9ca3af;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;"
          onmouseover="this.style.background='rgba(255,255,255,.13)'"
          onmouseout="this.style.background='rgba(255,255,255,.07)'">
          <i class="fa-solid fa-arrow-right-from-bracket"></i> Sair
        </button>
      </div>`;

    MENU.forEach(item => {
      // Verificar se este item é visível para o role atual
      if (item.roles && !item.roles.includes(role)) return;

      if (item.tipo === "sep") {
        html += `<hr style="border-color:#374151;margin:12px 0;">`;
      } else if (item.tipo === "titulo") {
        html += `<div class="menu-title">${item.label}</div>`;
      } else if (item.tipo === "link") {
        const ativo = pag === item.href ? "active" : "";
        html += `
          <a href="${item.href}" class="menu-item ${ativo}">
            <i class="fa-solid ${item.icon}"></i>
            <span>${item.label}</span>
          </a>`;
      }
    });

    html += `</div>`;
    return html;
  }

  // Aguardar DOM e usuarioLogado
  function init() {
    const el = document.getElementById("sidebar");
    if (!el) return;

    const usuario = window.usuarioLogado;
    const role    = usuario?.role  || "operadora";
    const nome    = usuario?.nome  || usuario?.email || "Usuário";

    el.innerHTML = renderSidebar(role, nome);
  }

  // Expor para auth.js chamar após buscar o perfil
  window.renderSidebar = init;

  // NÃO renderizar aqui — auth.js vai chamar renderSidebar()
  // depois de setar window.usuarioLogado com o role correto do banco
  // Isso evita o flash de "Usuário / Operadora" antes do perfil carregar

})();
