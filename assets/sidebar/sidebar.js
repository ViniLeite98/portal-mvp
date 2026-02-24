const paginaAtual = window.location.pathname.split("/").pop();

document.getElementById("sidebar").innerHTML = `
<div class="sidebar">

  <div class="logo">Hara Spa</div>

  <a href="index.html" class="menu-item ${paginaAtual === 'index.html' ? 'active' : ''}">
    <i class="fa-solid fa-chart-line"></i>
    <span>Dashboard</span>
  </a>

  <hr style="border-color:#374151; margin:18px 0;">

  <div class="menu-title">CADASTROS</div>

  <a href="equipe.html" class="menu-item ${paginaAtual === 'equipe.html' ? 'active' : ''}">
    <i class="fa-solid fa-users"></i>
    <span>Equipe</span>
  </a>

  <a href="clientes.html" class="menu-item ${paginaAtual === 'clientes.html' ? 'active' : ''}">
    <i class="fa-solid fa-user"></i>
    <span>Clientes</span>
  </a>

  <a href="servicos.html" class="menu-item ${paginaAtual === 'servicos.html' ? 'active' : ''}">
    <i class="fa-solid fa-hand-holding-heart"></i>
    <span>Serviços</span>
  </a>

  <a href="certificacoes.html" class="menu-item ${paginaAtual === 'certificacoes.html' ? 'active' : ''}">
    <i class="fa-solid fa-certificate"></i>
    <span>Certificações</span>
  </a>

  <hr style="border-color:#374151; margin:18px 0;">

  <div class="menu-title">OPERACIONAL</div>

  <a href="atendimentos.html" class="menu-item ${paginaAtual === 'atendimentos.html' ? 'active' : ''}">
    <i class="fa-solid fa-calendar-check"></i>
    <span>Atendimentos</span>
  </a>

  <a href="escalas.html" class="menu-item ${paginaAtual === 'escalas.html' ? 'active' : ''}">
    <i class="fa-solid fa-calendar-days"></i>
    <span>Escalas</span>
  </a>

  <a href="solicitacoes.html" class="menu-item ${paginaAtual === 'solicitacoes.html' ? 'active' : ''}">
    <i class="fa-solid fa-file-lines"></i>
    <span>Solicitações</span>
  </a>

  <hr style="border-color:#374151; margin:18px 0;">

  <div class="menu-title">FINANCEIRO</div>

  <a href="despesas.html" class="menu-item ${paginaAtual === 'despesas.html' ? 'active' : ''}">
    <i class="fa-solid fa-receipt"></i>
    <span>Despesas</span>
  </a>

</div>
`;
