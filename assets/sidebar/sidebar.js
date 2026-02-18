const currentPage = window.location.pathname.split("/").pop();

function isActive(page){
  return currentPage === page ? "active" : "";
}

const sidebarHTML = `
  <div class="sidebar">

    <div class="sidebar-logo">
      <h2>Hara Spa</h2>
    </div>

    <nav class="sidebar-menu">

      <a href="index.html" class="${isActive("index.html")}">
        <i class="fa-solid fa-chart-line"></i>
        <span>Início</span>
      </a>

      <a href="equipe.html" class="${isActive("equipe.html")}">
        <i class="fa-solid fa-users"></i>
        <span>Equipe</span>
      </a>

      <a href="clientes.html" class="${isActive("clientes.html")}">
        <i class="fa-solid fa-user"></i>
        <span>Clientes</span>
      </a>

      <a href="certificacoes.html" class="${isActive("certificacoes.html")}">
        <i class="fa-solid fa-certificate"></i>
        <span>Certificações</span>
      </a>

      <a href="solicitacoes.html" class="${isActive("solicitacoes.html")}">
        <i class="fa-solid fa-file-lines"></i>
        <span>Solicitações</span>
      </a>

      <a href="escalas.html" class="${isActive("escalas.html")}">
        <i class="fa-solid fa-calendar-days"></i>
        <span>Escalas</span>
      </a>

    </nav>

  </div>
`;

document.getElementById("sidebar").innerHTML = sidebarHTML;
