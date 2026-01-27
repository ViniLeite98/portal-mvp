document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="sidebar">
      <h2>HARA</h2>
      <a href="index.html">Início</a>
      <a href="equipe.html">Equipe</a>
      <a href="solicitacoes.html">Solicitações</a>
      <a href="disponibilidade.html">Disponibilidade</a>
      <a href="materiais.html">Materiais</a>
      <a href="financeiro.html">Financeiro</a>
    </div>
  `;
});
