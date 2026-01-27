document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  if (!app) {
    console.error("❌ DIV #app não encontrada");
    return;
  }

  app.innerHTML = `
    <aside class="sidebar">
      <h2 class="logo">Portal MVP</h2>

      <nav>
        <a href="index.html">🏠 Início</a>
        <a href="equipe.html">👥 Equipe</a>
        <a href="solicitacoes.html">📝 Solicitações</a>
        <a href="disponibilidade.html">📅 Disponibilidade</a>
        <a href="materias.html">📚 Materiais</a>
        <a href="financeiro.html">💰 Financeiro</a>
      </nav>
    </aside>
  `;
});
