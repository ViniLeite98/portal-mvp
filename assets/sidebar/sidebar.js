const currentPage = window.location.pathname.split("/").pop();

function isActive(page){
  return currentPage === page ? "active" : "";
}

document.getElementById("sidebar").innerHTML = `
  <div class="sidebar">

    <div class="sidebar-logo">
      <h2>Hara Spa</h2>
    </div>

    <nav class="sidebar-menu">

      <a href="index.html" class="${isActive("index.html")}">
        <i class="fa-solid fa-chart-line"></i>
        <span>Dashboard</span>
      </a>

      <hr>

      <p class="menu-group">Cadastros</p>

      <a href="equipe.html" class="${isActive("equipe.html")}">
        <i class="fa-solid fa-users"></i>
        <span>Equipe</span>
      </a>

      <a href="clientes.html" class="${isActive("clientes.html")}">
        <i class="fa-solid fa-user"></i>
        <span>Clientes</span>
      </a>

      <a href="servicos.html" class="${isActive("servicos.html")}">
        <i class="fa-solid fa-spa"></i>
        <span>Serviços</span>
      </a>

      <a href="certificacoes.html" class="${isActive("certificacoes.html")}">
        <i class="fa-solid fa-certificate"></i>
        <span>Certificações</span>
      </a>

      <hr>

      <p class="menu-group">Operacional</p>

      <a href="atendimentos.html" class="${isActive("atendimentos.html")}">
        <i class="fa-solid fa-calendar-check"></i>
        <span>Atendimentos</span>
      </a>

      <a href="escalas.html" class="${isActive("escalas.html")}">
        <i class="fa-solid fa-calendar-days"></i>
        <span>Escalas</span>
      </a>

      <a href="solicitacoes.html" class="${isActive("solicitacoes.html")}">
        <i class="fa-solid fa-file-lines"></i>
        <span>Solicitações</span>
      </a>

      <hr>

      <p class="menu-group">Financeiro</p>

      <a href="despesas.html" class="${isActive("despesas.html")}">
        <i class="fa-solid fa-receipt"></i>
        <span>Despesas</span>
      </a>

    </nav>

  </div>
`;
