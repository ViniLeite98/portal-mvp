/**
 * auth-check.js
 * Verifica sessão, redireciona se não logado,
 * seta window.usuarioLogado e renderiza o sidebar.
 *
 * Uso: <script src="assets/js/auth-check.js" data-role="admin"></script>
 * Colocar após supabase.js e ANTES de sidebar.js
 */

(function() {
  var roleExigido = (document.currentScript || {}).getAttribute("data-role") || null;

  client.auth.getSession().then(function(res) {
    var session = res.data && res.data.session;

    if (!session) {
      window.location.href = "login.html";
      return;
    }

    client.from("perfis")
      .select("role,nome,email")
      .eq("id", session.user.id)
      .single()
      .then(function(res2) {
        var role  = (res2.data && res2.data.role)  || "operadora";
        var nome  = (res2.data && res2.data.nome)  || (res2.data && res2.data.email) || session.user.email;

        // Redirecionar se não tem permissão
        if (roleExigido === "admin" && role !== "admin") {
          window.location.href = "equipe.html";
          return;
        }

        // Expor globalmente para o sidebar.js usar
        window.usuarioLogado = { id: session.user.id, role: role, nome: nome };

        // Renderizar sidebar agora que temos o usuário
        if (typeof window.renderSidebar === "function") {
          window.renderSidebar();
        }
      });
  });
})();
