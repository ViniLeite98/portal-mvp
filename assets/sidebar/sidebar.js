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


  // ── VISUALIZADOR DE ARQUIVOS DENTRO DO SISTEMA ─────────────────────────────
  // Links para arquivos do Supabase (certificados, documentos, fotos, atestados, NF)
  // abriam fora do app, com a barra de endereço "...supabase.co". Agora abrem aqui dentro.
  (function(){
    function ehArquivo(href){ return href && href.indexOf("/storage/v1/object/") !== -1; }
    function tipo(href){
      var u = href.split("?")[0].toLowerCase();
      if (/\.(jpe?g|png|gif|webp|bmp|heic|svg)$/.test(u)) return "img";
      if (/\.pdf$/.test(u)) return "pdf";
      return "outro";
    }
    function css(){
      if (document.getElementById("visuArqCss")) return;
      var st = document.createElement("style"); st.id = "visuArqCss";
      st.textContent =
        "#visuArq{position:fixed;inset:0;z-index:3000;background:rgba(17,24,39,.94);display:flex;flex-direction:column}" +
        "#visuArq .va-top{display:flex;align-items:center;gap:10px;padding:10px 12px;padding-top:calc(10px + env(safe-area-inset-top,0px));color:#fff}" +
        "#visuArq .va-nome{flex:1;min-width:0;font:600 14px 'Segoe UI',sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
        "#visuArq .va-btn{height:40px;min-width:40px;border:none;border-radius:10px;background:rgba(255,255,255,.12);color:#fff;font:600 13px 'Segoe UI',sans-serif;padding:0 12px;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;justify-content:center}" +
        "#visuArq .va-x{font-size:22px;line-height:1;padding:0}" +
        "#visuArq .va-corpo{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:8px 8px calc(8px + env(safe-area-inset-bottom,0px))}" +
        "#visuArq img{max-width:100%;max-height:100%;object-fit:contain;border-radius:6px}" +
        "#visuArq iframe{width:100%;height:100%;border:none;border-radius:6px;background:#fff}";
      document.head.appendChild(st);
    }
    window.abrirArquivo = function(href, nome){
      css();
      var t = tipo(href);
      var box = document.createElement("div"); box.id = "visuArq";
      var corpo = t === "img" ? '<img alt="">' :
                  t === "pdf" ? '<iframe title="Arquivo"></iframe>' :
                  '<div style="color:#fff;font:14px Segoe UI,sans-serif;text-align:center;padding:24px">Este tipo de arquivo não tem visualização aqui.<br>Use o botão Baixar.</div>';
      box.innerHTML =
        '<div class="va-top"><span class="va-nome"></span>' +
        '<a class="va-btn" download target="_blank" rel="noopener">Baixar</a>' +
        '<button class="va-btn va-x" aria-label="Fechar">&times;</button></div>' +
        '<div class="va-corpo">' + corpo + '</div>';
      box.querySelector(".va-nome").textContent = nome || "Arquivo";
      box.querySelector(".va-btn[download]").href = href;
      if (t === "img") box.querySelector("img").src = href;
      if (t === "pdf") box.querySelector("iframe").src = href;
      function fechar(){ box.remove(); document.removeEventListener("keydown", esc); if (history.state && history.state.visuArq) history.back(); }
      function esc(e){ if (e.key === "Escape") fechar(); }
      box.querySelector(".va-x").onclick = fechar;
      box.addEventListener("click", function(e){ if (e.target === box || e.target.classList.contains("va-corpo")) fechar(); });
      document.addEventListener("keydown", esc);
      // botão "voltar" do celular fecha o visualizador em vez de sair da página
      try { history.pushState({visuArq:1}, ""); } catch(e){}
      window.addEventListener("popstate", function onPop(){ window.removeEventListener("popstate", onPop); if (document.body.contains(box)) { box.remove(); document.removeEventListener("keydown", esc); } });
      document.body.appendChild(box);
    };
    document.addEventListener("click", function(e){
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.hasAttribute("download") || a.closest("#visuArq")) return;
      var href = a.getAttribute("href");
      if (!ehArquivo(href)) return;
      // o Chrome do Android não mostra PDF dentro da página: nesse caso segue abrindo como antes
      if (tipo(href) === "pdf" && /Android/i.test(navigator.userAgent)) return;
      e.preventDefault();
      abrirArquivo(href, (a.textContent || "").trim());
    }, true);
  })();
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
