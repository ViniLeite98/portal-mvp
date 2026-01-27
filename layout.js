const NAV = [
  { key: "inicio",      label: "Início",       href: "./index.html" },
  { key: "equipe",      label: "Equipe",       href: "./equipe.html" },
  { key: "solicitacoes",label: "Solicitações", href: "./solicitacoes.html" },
  { key: "materiais",   label: "Materiais",    href: "./materiais.html" },
  { key: "governanca",  label: "Governança",   href: "./governanca.html" },
];

function initLayout() {
  const active = window.__PAGE__ || "";
  const el = document.getElementById("sidebar");
  if (!el) return;

  el.innerHTML = `
    <div class="sidebar">
      <div class="brand">Hara</div>
      <nav class="nav">
        ${NAV.map(i => `
          <a class="nav-item ${i.key === active ? "active" : ""}" href="${i.href}">
            ${i.label}
          </a>
        `).join("")}
      </nav>
      <div style="margin-top:14px; padding: 0 12px;">
        <div class="muted">Versão (mock)</div>
      </div>
    </div>
  `;
}
