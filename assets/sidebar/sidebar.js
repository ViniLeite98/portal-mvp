/*********************************
 * SUPABASE – INSTÂNCIA ÚNICA
 *********************************/
if (!window.supabaseClient) {
  window.supabaseClient = supabase.createClient(
    "https://rymehgsoarjeecuwyhny.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bWVoZ3NvYXJqZWVjdXd5aG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTc0ODUsImV4cCI6MjA4NjIzMzQ4NX0.K9BUapByrh6TsSi5jEkL8HGLDmMT_tGSSykl7LGxIec"
  );
}

/*********************************
 * SIDEBAR
 *********************************/
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `
    <h2 class="logo">Hara Spa</h2>

    <nav class="menu">
      <a href="index.html">
        <i class="fa-solid fa-house"></i>
        <span>Início</span>
      </a>

      <a href="equipe.html" class="active">
        <i class="fa-solid fa-users"></i>
        <span>Gestão da Equipe</span>
      </a>

      <a href="solicitacoes.html">
        <i class="fa-solid fa-calendar-xmark"></i>
        <span>Solicitações</span>
      </a>

      <a href="escalas.html">
        <i class="fa-solid fa-calendar-days"></i>
        <span>Escalas</span>
      </a>

      <a href="materiais.html">
        <i class="fa-solid fa-box-open"></i>
        <span>Materiais</span>
      </a>

      <a href="financeiro.html">
        <i class="fa-solid fa-coins"></i>
        <span>Financeiro</span>
      </a>

      <div class="submenu">
        <span>
          <i class="fa-solid fa-user"></i>
          Atendimentos
        </span>
      </div>

      <div class="submenu">
        <span>
          <i class="fa-solid fa-id-badge"></i>
          Recursos Humanos
        </span>
      </div>
    </nav>
  `;
});
