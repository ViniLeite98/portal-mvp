(function() {
  var paginaAtual = window.location.pathname.split("/").pop() || "index.html";

  function ativo(pagina) {
    return paginaAtual === pagina ? " active" : "";
  }

  function item(href, icon, label) {
    return '<a href="' + href + '" class="menu-item' + ativo(href) + '">' +
      '<i class="fa-solid ' + icon + '"></i>' +
      '<span>' + label + '</span>' +
      '</a>';
  }

  function hr() {
    return '<hr style="border-color:#374151; margin:18px 0;">';
  }

  function titulo(txt) {
    return '<div class="menu-title">' + txt + '</div>';
  }

  function renderSidebar() {
    if (!window.usuarioLogado) { setTimeout(renderSidebar, 100); return; }
    var u = window.usuarioLogado;
    var usuario = u && u.role === "usuario";

    var html = '<div class="sidebar">';
    html += '<div class="logo">Hara Spa</div>';

    if (!usuario) {
      html += item("dashboard.html", "fa-chart-line", "Dashboard");
    }

    html += hr();
    html += titulo("CADASTROS");
    html += item("equipe.html", "fa-users", "Equipe");

    if (!usuario) {
      html += item("clientes.html", "fa-user", "Clientes");
      html += item("servicos.html", "fa-hand-holding-heart", "Serviços");
    }

    html += item("certificacoes.html", "fa-certificate", "Certificações");

    html += hr();
    html += titulo("OPERACIONAL");
    html += item("atendimentos.html", "fa-calendar-check", "Atendimentos");
    html += item("escalas.html", "fa-calendar-days", "Escalas");
    html += item("solicitacoes.html", "fa-file-lines", "Solicitações");
    html += item("kanban.html", "fa-table-columns", "Kanban");

    if (!usuario) {
      html += hr();
      html += titulo("FINANCEIRO");
      html += item("despesas.html", "fa-receipt", "Despesas");
      html += item("fluxo_caixa.html", "fa-cash-register", "Fluxo de Caixa");
      html += item("estoque.html", "fa-boxes-stacked", "Estoque");
      html += item("folha_pagamento.html", "fa-money-check-dollar", "Folha de Pagamento");

      html += hr();
      html += titulo("CONFIGURAÇÕES");
      html += item("parametros.html", "fa-sliders", "Parâmetros");
    }

    html += hr();
    html += '<a href="#" class="menu-item" onclick="sairDoCaixa()" style="color:#f87171">' +
      '<i class="fa-solid fa-arrow-right-from-bracket"></i>' +
      '<span>Sair</span>' +
      '</a>';

    html += '</div>';

    document.getElementById("sidebar").innerHTML = html;
  }

  renderSidebar();

  window.sairDoCaixa = function() {
    if (typeof client !== 'undefined') {
      client.auth.signOut().finally(function() {
        Object.keys(localStorage).forEach(function(k) {
          if (k.startsWith('sb-')) localStorage.removeItem(k);
        });
        window.location.href = 'login.html';
      });
    } else {
      window.location.href = 'login.html';
    }
  };
})();
