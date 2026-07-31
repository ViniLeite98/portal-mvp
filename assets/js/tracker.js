/**
 * tracker.js
 * Rastreia navegação do usuário — página visitada + tempo de permanência.
 * Incluir em todas as páginas do portal (exceto login.html):
 * <script src="assets/js/tracker.js"></script>
 */

(function() {
  var entradaTs = Date.now();
  var logId = null;

  var TITULOS = {
    "dashboard.html":      "Dashboard",
    "atendimentos.html":   "Atendimentos",
    "escalas.html":        "Escalas",
    "solicitacoes.html":   "Solicitações",
    "kanban.html":         "Kanban",
    "equipe.html":         "Equipe",
    "clientes.html":       "Clientes",
    "servicos.html":       "Serviços",
    "certificacoes.html":  "Certificações",
    "despesas.html":       "Despesas",
    "estoque.html":        "Estoque",
    "folha_pagamento.html":"Folha de Pagamento",
    "parametros.html":     "Parâmetros",
    "logins.html":         "Logins",
    "fluxo_caixa.html":    "Fluxo de Caixa",
  };

  function getPagina() {
    return window.location.pathname.split("/").pop() || "index.html";
  }

  function getTitulo(pagina) {
    return TITULOS[pagina] || pagina;
  }

  function getUser(cb, n) {
    n = n === undefined ? 30 : n;
    if (window.usuarioLogado) return cb(window.usuarioLogado);
    if (n <= 0) return cb(null);
    setTimeout(function() { getUser(cb, n - 1); }, 200);
  }

  // Registra entrada na página
  async function registrarEntrada() {
    getUser(async function(u) {
      if (!u) return;
      var pagina = getPagina();
      try {
        var res = await client.from("navigation_logs").insert({
          user_id:   u.id   || null,
          email:     u.email || null,
          nome:      u.nome  || null,
          pagina:    pagina,
          titulo:    getTitulo(pagina),
          duracao_seg: null
        }).select("id").single();
        if (res.data && res.data.id) logId = res.data.id;
      } catch(e) {}
    });
  }

  // Registra saída com duração
  async function registrarSaida() {
    if (!logId) return;
    var duracao = Math.round((Date.now() - entradaTs) / 1000);
    try {
      await client.from("navigation_logs").update({
        duracao_seg: duracao
      }).eq("id", logId);
    } catch(e) {}
  }

  // Saída via beacon (fechamento de aba)
  function registrarSaidaBeacon() {
    if (!logId) return;
    var duracao = Math.round((Date.now() - entradaTs) / 1000);
    var SUPABASE_URL = window._supabaseUrl || "";
    var SUPABASE_KEY = window._supabaseKey || "";
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    var payload = JSON.stringify({ duracao_seg: duracao });
    var url = SUPABASE_URL + "/rest/v1/navigation_logs?id=eq." + logId;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: "application/json" }));
    } else {
      fetch(url, {
        method: "PATCH",
        body: payload,
        headers: {
          "Content-Type":  "application/json",
          "apikey":        SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Prefer":        "return=minimal"
        },
        keepalive: true
      });
    }
  }

  // Navegação interna (SPA-like) — troca de página via link
  window.addEventListener("beforeunload", registrarSaidaBeacon);

  // Inicia ao carregar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registrarEntrada);
  } else {
    registrarEntrada();
  }

  // Expõe para uso manual se necessário
  window._tracker = { registrarSaida: registrarSaida };
})();
