/**
 * tracker.js
 * Rastreia navegação do usuário — página visitada + tempo de permanência.
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
  async function registrarEntrada() {
    getUser(async function(u) {
      if (!u) return;
      var pagina = getPagina();
      try {
        var res = await client.from("navigation_logs").insert({
          user_id:     u.id    || null,
          email:       u.email || null,
          nome:        u.nome  || null,
          pagina:      pagina,
          titulo:      getTitulo(pagina),
          duracao_seg: null
        }).select("id").single();
        if (res.data && res.data.id) logId = res.data.id;
      } catch(e) {}
    });
  }
  function registrarSaidaBeacon() {
    if (!logId) return;
    var duracao = Math.round((Date.now() - entradaTs) / 1000);
    var SUPABASE_URL = window._supabaseUrl || "";
    var SUPABASE_KEY = window._supabaseKey || "";
    if (!SUPABASE_URL || !SUPABASE_KEY) return;
    var url = SUPABASE_URL + "/rest/v1/navigation_logs?id=eq." + logId;
    // fetch com keepalive — suporta headers, funciona no beforeunload
    try {
      fetch(url, {
        method: "PATCH",
        body: JSON.stringify({ duracao_seg: duracao }),
        headers: {
          "Content-Type":  "application/json",
          "apikey":        SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Prefer":        "return=minimal"
        },
        keepalive: true
      });
    } catch(e) {}
  }
  window.addEventListener("beforeunload", registrarSaidaBeacon);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", registrarEntrada);
  } else {
    registrarEntrada();
  }
  window._tracker = {};
})();
