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
`;
