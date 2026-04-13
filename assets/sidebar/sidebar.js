const paginaAtual = window.location.pathname.split("/").pop();

const paginasEquipe = ["equipe.html","rh_documentos.html","rh_faltas.html"];
const equipeAtiva = paginasEquipe.includes(paginaAtual);

document.getElementById("sidebar").innerHTML = `
<div class="sidebar">

  <div class="logo">Hara Spa</div>

  <a href="index.html" class="menu-item ${paginaAtual === 'index.html' ? 'active' : ''}">
    <i class="fa-solid fa-chart-line"></i>
    <span>Dashboard</span>
  </a>

  <hr style="border-color:#374151; margin:18px 0;">

  <div class="menu-title">CADASTROS</div>

  <!-- 🔥 EQUIPE -->
  <div class="menu-item" onclick="toggleEquipe()" style="cursor:pointer;">
    <i class="fa-solid fa-users"></i>
    <span>Equipe</span>
  </div>

  <div id="submenuEquipe" style="margin-left:20px; display:${equipeAtiva ? 'block' : 'none'}">

    <a href="equipe.html" class="menu-item ${paginaAtual === 'equipe.html' ? 'active' : ''}">
      <span>Cadastro</span>
    </a>

    <a href="rh_documentos.html" class="menu-item ${paginaAtual === 'rh_documentos.html' ? 'active' : ''}">
      <span>Documentos</span>
    </a>

    <a href="rh_faltas.html" class="menu-item ${paginaAtual === 'rh_faltas.html' ? 'active' : ''}">
      <span>Faltas / Atestados</span>
    </a>

  </div>

  <!-- RESTO NORMAL -->

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

  <a href="fluxo_caixa.html" class="menu-item ${paginaAtual === 'fluxo_caixa.html' ? 'active' : ''}">
    <i class="fa-solid fa-cash-register"></i>
    <span>Fluxo de Caixa</span>
  </a>

  <a href="estoque.html" class="menu-item ${paginaAtual === 'estoque.html' ? 'active' : ''}">
    <i class="fa-solid fa-boxes-stacked"></i>
    <span>Estoque</span>
  </a>

</div>
`;
