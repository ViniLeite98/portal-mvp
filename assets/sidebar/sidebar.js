document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `
    <h2>Hara Spa</h2>

    <a href="index.html" data-page="index">
      <i class="fa-solid fa-house"></i> Início
    </a>

    <a href="equipe.html" data-page="equipe">
      <i class="fa-solid fa-users"></i> Gestão da Equipe
    </a>

    <a href="nova-terapeuta.html" data-page="nova-terapeuta">
      <i class="fa-solid fa-user-plus"></i> Nova Terapeuta
    </a>

    <a href="solicitacoes.html" data-page="solicitacoes">
      <i class="fa-solid fa-calendar-xmark"></i> Solicitações
    </a>

    <a href="escalas.html" data-page="escalas">
      <i class="fa-solid fa-calendar-days"></i> Escalas
    </a>

    <a href="materiais.html" data-page="materiais">
      <i class="fa-solid fa-box-open"></i> Materiais
    </a>

    <a href="financeiro.html" data-page="financeiro">
      <i class="fa-solid fa-coins"></i> Financeiro
    </a>
  `;

  // ativa menu
  const page = location.pathname.split("/").pop().replace(".html", "");
  sidebar.querySelectorAll("a").forEach(a => {
    if (a.dataset.page === page) a.classList.add("active");
  });
});
