(function() {
  // ── MODO "VERSÃO COMPLETA" (PC) NO CELULAR ─────────────────────────────────
  // Se a pessoa escolheu ver a versão completa, trocamos o viewport para 1280px:
  // o celular passa a mostrar o layout de PC (reduzido), igual ao "Site para computador" do Chrome.
  var MODO_PC_KEY = 'hara_modo_pc';
  // saída de emergência pela URL: ?versao=celular desliga, ?versao=completa liga
  try {
    var pv = new URLSearchParams(window.location.search).get('versao');
    if (pv === 'celular') localStorage.removeItem(MODO_PC_KEY);
    if (pv === 'completa') localStorage.setItem(MODO_PC_KEY, '1');
  } catch (e) {}
  function modoPCAtivo() {
    try { return localStorage.getItem(MODO_PC_KEY) === '1'; } catch (e) { return false; }
  }
  // tela física pequena (celular/tablet), independente do viewport escolhido
  function telaPequena() {
    return Math.min(screen.width, screen.height) <= 1024;
  }
  function aplicarModoPC() {
    if (!modoPCAtivo()) return;
    var meta = document.querySelector('meta[name="viewport"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'viewport';
      document.head.appendChild(meta);
    }
    // largura real da tela na orientação atual (em pé ou deitado)
    var deitado = window.matchMedia && window.matchMedia('(orientation: landscape)').matches;
    var larguraTela = deitado ? Math.max(screen.width, screen.height) : Math.min(screen.width, screen.height);
    // zoom inicial para a página de 1280px caber inteira na tela
    var zoom = Math.min(1, larguraTela / 1280).toFixed(3);
    meta.content = 'width=1280, initial-scale=' + zoom + ', minimum-scale=' + zoom;
  }
  aplicarModoPC();
  // ao virar o celular, recalcula o zoom
  window.addEventListener('orientationchange', function() { setTimeout(aplicarModoPC, 200); });

  window.alternarModoPC = function(ev) {
    if (ev) ev.preventDefault();
    var ativo = modoPCAtivo();
    try {
      if (ativo) localStorage.removeItem(MODO_PC_KEY);
      else localStorage.setItem(MODO_PC_KEY, '1');
    } catch (e) {}
    if (ativo) {
      // volta o viewport normal na hora, para não herdar o zoom da versão completa
      var meta = document.querySelector('meta[name="viewport"]');
      if (meta) meta.content = 'width=device-width, initial-scale=1';
    }
    // recarrega pela URL limpa (sem ?versao=...)
    window.location.replace(window.location.pathname + window.location.hash);
  };
  // ───────────────────────────────────────────────────────────────────────────

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

  function getPaginaLabel() {
    var labels = {
      'dashboard.html': 'Dashboard',
      'equipe.html': 'Equipe',
      'clientes.html': 'Clientes',
      'servicos.html': 'Serviços',
      'certificacoes.html': 'Certificações',
      'atendimentos.html': 'Atendimentos',
      'escalas.html': 'Escalas',
      'solicitacoes.html': 'Solicitações',
      'kanban.html': 'Kanban',
      'despesas.html': 'Despesas',
      'estoque.html': 'Estoque',
      'folha_pagamento.html': 'Folha de Pagamento',
      'parametros.html': 'Parâmetros',
    };
    return labels[paginaAtual] || 'Hara Spa';
  }

  function injetarMobileTopbar() {
    if (document.querySelector('.mobile-topbar')) return;
    var topbar = document.createElement('div');
    topbar.className = 'mobile-topbar';
    topbar.innerHTML =
      '<button class="hamburger" onclick="toggleSidebar()" aria-label="Menu">' +
        '<i class="fa-solid fa-bars"></i>' +
      '</button>' +
      '<span class="page-title">' + getPaginaLabel() + '</span>' +
      '<div class="topbar-right"></div>';

    var overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = function() { fecharSidebar(); };
    document.body.prepend(overlay);

    var app = document.querySelector('.app') || document.body;
    app.parentNode.insertBefore(topbar, app);
  }

  function renderSidebar() {
    if (!window.usuarioLogado) { setTimeout(renderSidebar, 100); return; }
    var u = window.usuarioLogado;
    var usuario = u && u.role === "usuario";
    // Escalas é só para a gestão: terapeuta que abrir pelo link vai para Atendimentos
    if (usuario && paginaAtual === "escalas.html") { window.location.replace("atendimentos.html"); return; }
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
    if (!usuario) html += item("escalas.html", "fa-calendar-days", "Escalas");
    html += item("solicitacoes.html", "fa-file-lines", "Solicitações");
    html += item("kanban.html", "fa-table-columns", "Kanban");
    if (!usuario) {
      html += hr();
      html += titulo("FINANCEIRO");
      html += item("despesas.html", "fa-receipt", "Despesas");
      html += item("estoque.html", "fa-boxes-stacked", "Estoque");
      html += item("folha_pagamento.html", "fa-money-check-dollar", "Folha de Pagamento");
      html += hr();
      html += titulo("CONFIGURAÇÕES");
      html += item("parametros.html", "fa-sliders", "Parâmetros");
    }
    html += hr();
    // só aparece em celular/tablet (no PC não faz sentido)
    if (telaPequena() || modoPCAtivo()) {
      html += modoPCAtivo()
        ? '<a href="#" class="menu-item" onclick="alternarModoPC(event)">' +
            '<i class="fa-solid fa-mobile-screen"></i><span>Voltar à versão celular</span></a>'
        : '<a href="#" class="menu-item" onclick="alternarModoPC(event)">' +
            '<i class="fa-solid fa-desktop"></i><span>Ver versão completa</span></a>';
    }
    html += '<a href="#" class="menu-item" onclick="sairDoCaixa()" style="color:#f87171">' +
      '<i class="fa-solid fa-arrow-right-from-bracket"></i>' +
      '<span>Sair</span>' +
      '</a>';
    html += '</div>';
    document.getElementById("sidebar").innerHTML = html;

    // Injeta topbar mobile após renderizar sidebar
    injetarMobileTopbar();

    // Fecha sidebar ao clicar em item no mobile
    document.querySelectorAll('.menu-item').forEach(function(el) {
      el.addEventListener('click', function() {
        if (window.innerWidth <= 1024) fecharSidebar();
      });
    });
  }

  renderSidebar();

  window.toggleSidebar = function() {
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.sidebar-overlay');
    if (!sidebar) return;
    var isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      fecharSidebar();
    } else {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('open');
    }
  };

  function fecharSidebar() {
    var sidebar = document.querySelector('.sidebar');
    var overlay = document.querySelector('.sidebar-overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

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
