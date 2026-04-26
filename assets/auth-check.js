/**
 * auth.js
 * Uso: <script src="assets/js/auth.js" data-role="admin"></script>
 * Colocar após supabase.js, no final do <body>
 */

// 1. Capturar role ANTES de qualquer async
var AUTH_ROLE_EXIGIDO = (document.currentScript || {}).getAttribute("data-role") || null;

var ROTAS = { admin: "dashboard.html", operadora: "equipe.html" };

var MENU = [
  { href:"dashboard.html",     icon:"fa-chart-line",         label:"Dashboard",      roles:["admin"] },
  { sep:true },
  { titulo:"CADASTROS" },
  { href:"equipe.html",        icon:"fa-users",              label:"Equipe",         roles:["admin","operadora"] },
  { href:"clientes.html",      icon:"fa-user",               label:"Clientes",       roles:["admin","operadora"] },
  { href:"servicos.html",      icon:"fa-hand-holding-heart", label:"Serviços",       roles:["admin","operadora"] },
  { href:"certificacoes.html", icon:"fa-certificate",        label:"Certificações",  roles:["admin","operadora"] },
  { sep:true },
  { titulo:"OPERACIONAL" },
  { href:"atendimentos.html",  icon:"fa-calendar-check",     label:"Atendimentos",   roles:["admin","operadora"] },
  { href:"escalas.html",       icon:"fa-calendar-days",      label:"Escalas",        roles:["admin","operadora"] },
  { href:"solicitacoes.html",  icon:"fa-file-lines",         label:"Solicitações",   roles:["admin","operadora"] },
  { sep:true },
  { titulo:"FINANCEIRO" },
  { href:"despesas.html",      icon:"fa-receipt",            label:"Despesas",       roles:["admin","operadora"] },
  { href:"fluxo_caixa.html",   icon:"fa-cash-register",      label:"Fluxo de Caixa",roles:["admin","operadora"] },
  { href:"estoque.html",       icon:"fa-boxes-stacked",      label:"Estoque",        roles:["admin","operadora"] },
  { sep:true, roles:["admin"] },
  { titulo:"CONFIGURAÇÕES",    roles:["admin"] },
  { href:"parametros.html",    icon:"fa-sliders",            label:"Parâmetros",     roles:["admin"] },
];

function authBuildSidebar(role, nome) {
  var pag     = location.pathname.split("/").pop() || "";
  var inicial = (nome || "?")[0].toUpperCase();
  var rotulo  = role === "admin" ? "Administrador" : "Operadora";
  var itens   = "";

  MENU.forEach(function(item) {
    if (item.sep) {
      if (!item.roles || item.roles.indexOf(role) >= 0)
        itens += '<hr style="border-color:#374151;margin:12px 0">';
      return;
    }
    if (item.titulo) {
      if (!item.roles || item.roles.indexOf(role) >= 0)
        itens += '<div class="menu-title">' + item.titulo + '</div>';
      return;
    }
    if (item.roles.indexOf(role) >= 0) {
      var ativo = pag === item.href ? "active" : "";
      itens += '<a href="' + item.href + '" class="menu-item ' + ativo + '">' +
        '<i class="fa-solid ' + item.icon + '"></i><span>' + item.label + '</span></a>';
    }
  });

  return '<div class="sidebar">' +
    '<div class="logo">Hara Spa</div>' +
    '<div style="padding:12px 16px 16px;border-bottom:1px solid #374151;margin-bottom:8px">' +
      '<div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">' +
        '<div style="width:34px;height:34px;border-radius:50%;background:#2563eb;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">' + inicial + '</div>' +
        '<div style="flex:1;min-width:0">' +
          '<div style="font-size:13px;font-weight:600;color:#f9fafb;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + nome + '</div>' +
          '<div style="font-size:10px;color:#9ca3af">' + rotulo + '</div>' +
        '</div>' +
      '</div>' +
      '<button onclick="authLogout()" style="width:100%;padding:6px;background:rgba(255,255,255,.07);border:1px solid #374151;border-radius:7px;color:#9ca3af;font-size:11px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px" onmouseover="this.style.background=\'rgba(255,255,255,.15)\'" onmouseout="this.style.background=\'rgba(255,255,255,.07)\'">' +
        '<i class="fa-solid fa-arrow-right-from-bracket"></i> Sair' +
      '</button>' +
    '</div>' +
    itens +
  '</div>';
}

function authLogout() {
  client.auth.signOut().finally(function() {
    Object.keys(localStorage).forEach(function(k) {
      if (k.startsWith("sb-")) localStorage.removeItem(k);
    });
    location.href = "login.html";
  });
}

function authRenderSidebar(role, nome) {
  var el = document.getElementById("sidebar");
  if (el) el.innerHTML = authBuildSidebar(role, nome);
}

function authInit() {
  client.auth.getSession().then(function(res) {
    var session = res.data && res.data.session;

    if (!session) {
      location.href = "login.html";
      return;
    }

    client.from("perfis")
      .select("role,nome,email")
      .eq("id", session.user.id)
      .single()
      .then(function(res2) {
        var perfil = res2.data;
        var role   = (perfil && perfil.role)  || "operadora";
        var nome   = (perfil && perfil.nome)  || (perfil && perfil.email) || session.user.email;

        // Verificar permissão
        if (AUTH_ROLE_EXIGIDO === "admin" && role !== "admin") {
          location.href = ROTAS[role] || "equipe.html";
          return;
        }

        window.usuarioLogado = { id: session.user.id, role: role, nome: nome };
        authRenderSidebar(role, nome);
      });
  });
}

// Rodar quando DOM estiver pronto
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", authInit);
} else {
  authInit();
}
