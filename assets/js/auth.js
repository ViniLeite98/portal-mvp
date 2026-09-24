/**
 * auth.js — autenticação + sidebar dinâmico
 *
 * Roles:
 *   admin         → acesso total
 *   apoio         → igual admin exceto algumas seções
 *   usuario       → acesso restrito (só vê os próprios dados)
 */

var AUTH_ROLE_EXIGIDO = (document.currentScript || {}).getAttribute("data-role") || null;

var ROTAS = { admin: "equipe.html", apoio: "equipe.html", usuario: "equipe.html" };

var MENU = [
  { href:"dashboard.html",        icon:"fa-chart-line",           label:"Dashboard",            roles:["admin","apoio"] },
  { sep:true },
  { titulo:"CADASTROS" },
  { href:"equipe.html",           icon:"fa-users",                label:"Equipe",               roles:["admin","apoio","usuario"] },
  { href:"clientes.html",         icon:"fa-user",                 label:"Clientes",             roles:["admin","apoio"] },
  { href:"servicos.html",         icon:"fa-hand-holding-heart",   label:"Serviços",             roles:["admin","apoio"] },
  { href:"certificacoes.html",    icon:"fa-certificate",          label:"Certificações",        roles:["admin","apoio","usuario"] },
  { sep:true },
  { titulo:"OPERACIONAL" },
  { href:"atendimentos.html",     icon:"fa-calendar-check",       label:"Atendimentos",         roles:["admin","apoio","usuario"] },
  { href:"escalas.html",          icon:"fa-calendar-days",        label:"Escalas",              roles:["admin","apoio","usuario"] },
  { href:"solicitacoes.html",     icon:"fa-file-lines",           label:"Solicitações",         roles:["admin","apoio","usuario"] },
  { href:"kanban.html",           icon:"fa-table-columns",        label:"Kanban",               roles:["admin","apoio","usuario"] },
  { sep:true,                                                                                    roles:["admin","apoio"] },
  { titulo:"FINANCEIRO",                                                                         roles:["admin","apoio"] },
  { href:"despesas.html",         icon:"fa-receipt",              label:"Despesas",             roles:["admin","apoio"] },
  { href:"estoque.html",          icon:"fa-boxes-stacked",        label:"Estoque",              roles:["admin","apoio"] },
  { href:"folha_pagamento.html",  icon:"fa-money-check-dollar",   label:"Folha de Pagamento",   roles:["admin","apoio"] },
  { sep:true,                                                                                    roles:["admin"] },
  { titulo:"CONFIGURAÇÕES",                                                                      roles:["admin"] },
  { href:"parametros.html",       icon:"fa-sliders",              label:"Parâmetros",           roles:["admin"] },
  { href:"logins.html",           icon:"fa-shield-halved",        label:"Logins",               roles:["admin"] },
];

function authBuildSidebar(role, nome) {
  var pag     = location.pathname.split("/").pop() || "";
  var inicial = (nome || "?")[0].toUpperCase();
  var rotulo  = role === "admin" ? "Administrador" : role === "apoio" ? "Apoio" : "Usuário";
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
    if (item.roles && item.roles.indexOf(role) >= 0) {
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

// Tela para quem se cadastrou mas ainda não foi liberado pela administração
function authAguardando() {
  document.body.innerHTML =
    '<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;background:#f5f7fb;font-family:Segoe UI,sans-serif">' +
      '<div style="max-width:380px;width:100%;background:#fff;border-radius:16px;padding:28px 24px;text-align:center;box-shadow:0 4px 20px rgba(0,0,0,.08)">' +
        '<div style="font-size:40px;margin-bottom:10px">⏳</div>' +
        '<h2 style="margin:0 0 8px;font-size:20px;color:#111827">Acesso aguardando liberação</h2>' +
        '<p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6">Seu cadastro foi recebido. Assim que a administração liberar, você poderá usar o sistema normalmente.</p>' +
        '<button onclick="authLogout()" style="width:100%;padding:12px;border:none;border-radius:10px;background:#1f2937;color:#fff;font-size:15px;font-weight:600;cursor:pointer">Sair</button>' +
      '</div>' +
    '</div>';
}

function authInit() {
  var paginaAtual = location.pathname.split("/").pop() || "";

  // onboarding.html não precisa de perfil — só de sessão
  if (paginaAtual === "onboarding.html") return;

  client.auth.getSession().then(function(res) {
    var session = res.data && res.data.session;

    if (!session) {
      location.href = "login.html";
      return;
    }

    client.from("perfis")
      .select("role,nome,email,cpf_terapeuta")
      .eq("id", session.user.id)
      .single()
      .then(function(res2) {
        var perfil = res2.data;

        // ── Sem perfil → onboarding ──
        if (!perfil) {
          location.href = "onboarding.html";
          return;
        }

        var role  = perfil.role  || "usuario";
        var nome  = perfil.nome  || perfil.email || session.user.email;
        var email = perfil.email || session.user.email;
        var cpf   = perfil.cpf_terapeuta || null;

        if (AUTH_ROLE_EXIGIDO === "admin" && role !== "admin") {
          location.href = "equipe.html";
          return;
        }

        if (role !== "admin" && role !== "apoio") {
          // sem ficha de funcionário ligada → aguardando liberação
          if (!cpf) { authAguardando(); return; }

          client.from("funcionario")
            .select("nome_profissional,status,cpf,cargo")
            .eq("cpf", cpf)
            .limit(1)
            .then(function(res3) {
              var ter = res3.data && res3.data[0];

              // bloqueia inativo
              if (ter && ter.status === "Inativo") {
                client.auth.signOut().then(function() {
                  location.href = "login.html?inativo=1";
                });
                return;
              }

              // cadastro ainda não aprovado (Pendente) ou ficha não encontrada
              if (!ter || ter.status !== "Ativo") { authAguardando(); return; }

              window.usuarioLogado = {
                id:    session.user.id,
                role:  role,
                nome:  (ter && ter.nome_profissional) || nome,
                email: email,
                cpf:   cpf,
                cargo: ter && ter.cargo || null
              };
              var el = document.getElementById("sidebar");
              if (el) el.innerHTML = authBuildSidebar(role, window.usuarioLogado.nome);
            });
        } else {
          window.usuarioLogado = {
            id:    session.user.id,
            role:  role,
            nome:  nome,
            email: email,
            cpf:   cpf,
            cargo: null
          };
          var el = document.getElementById("sidebar");
          if (el) el.innerHTML = authBuildSidebar(role, nome);
        }
      });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", authInit);
} else {
  authInit();
}
