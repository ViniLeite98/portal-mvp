/* sidebar.css */
#sidebar {
  width: 220px;
  flex-shrink: 0;
  min-height: 100vh;
}
.sidebar {
  width: 220px;
  background: #111827;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 50;
  scrollbar-width: thin;
  scrollbar-color: #374151 transparent;
}
.sidebar::-webkit-scrollbar { width: 4px; }
.sidebar::-webkit-scrollbar-track { background: transparent; }
.sidebar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
.logo {
  padding: 20px 18px 16px;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.5px;
  border-bottom: 1px solid #374151;
  margin-bottom: 8px;
}
.menu-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .08em;
  color: #6b7280;
  padding: 4px 18px 6px;
}
.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 18px;
  color: #9ca3af;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  border-left: 3px solid transparent;
  transition: all .15s;
}
.menu-item:hover {
  background: rgba(255,255,255,.05);
  color: #f9fafb;
}
.menu-item.active {
  background: rgba(37,99,235,.15);
  color: #60a5fa;
  border-left-color: #2563eb;
  font-weight: 600;
}
.menu-item i {
  width: 16px;
  text-align: center;
  font-size: 13px;
  flex-shrink: 0;
}
/* Notebook (até 1366px) — mais compacto para caber todos os itens */
@media (max-width: 1366px) {
  #sidebar        { width: 200px; }
  .sidebar        { width: 200px; height: 100vh; overflow-y: auto; }
  .logo           { font-size: 15px; padding: 12px 14px 10px; margin-bottom: 4px; }
  .menu-item      { font-size: 12px; padding: 6px 14px; gap: 8px; }
  .menu-title     { font-size: 9px; padding: 2px 14px 3px; }
  .menu-item i    { font-size: 12px; }
  /* Reduzir hr */
  .sidebar hr     { margin: 6px 0 !important; }
  /* Perfil do usuário mais compacto */
  .sidebar > div[style*="padding:12px"] {
    padding: 8px 12px 10px !important;
  }
}
/* Desktop (1367px-1920px) */
@media (min-width: 1367px) and (max-width: 1920px) {
  #sidebar        { width: 220px; }
  .sidebar        { width: 220px; }
  .logo           { font-size: 18px; }
  .menu-item      { font-size: 13px; padding: 9px 18px; }
}
/* Tela grande (acima de 1920px) */
@media (min-width: 1921px) {
  #sidebar        { width: 260px; }
  .sidebar        { width: 260px; }
  .logo           { font-size: 20px; padding: 24px 22px 18px; }
  .menu-item      { font-size: 14px; padding: 11px 22px; gap: 12px; }
  .menu-title     { font-size: 11px; padding: 6px 22px 7px; }
  .menu-item i    { font-size: 14px; width: 18px; }
}

/* ═══════════════════════════════════════════════
   MOBILE RESPONSIVE (abaixo de 768px)
   ═══════════════════════════════════════════════ */

/* ── Topbar mobile oculta no desktop ── */
.mobile-topbar {
  display: none;
}

@media (max-width: 768px) {

  /* ── Sidebar vira drawer ── */
  #sidebar {
    width: 0 !important;
    min-height: 0 !important;
    position: fixed;
    z-index: 200;
  }

  .sidebar {
    width: 260px !important;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
    z-index: 200;
    box-shadow: 4px 0 20px rgba(0,0,0,0.3);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  /* ── Overlay escuro atrás do drawer ── */
  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 199;
    backdrop-filter: blur(2px);
  }

  .sidebar-overlay.open {
    display: block;
  }

  /* ── Topbar mobile ── */
  .mobile-topbar {
    display: flex !important;
    align-items: center;
    justify-content: space-between;
    padding: 14px 16px;
    background: #111827;
    color: white;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  .mobile-topbar .hamburger {
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
  }

  .mobile-topbar .page-title {
    font-size: 16px;
    font-weight: 700;
    color: white;
  }

  .mobile-topbar .topbar-right {
    width: 32px;
  }

  /* ── Content ocupa 100% ── */
  .app {
    flex-direction: column !important;
  }

  .content {
    padding: 16px !important;
    width: 100% !important;
  }

  /* ── Tabelas: scroll horizontal ── */
  .table-wrap {
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 500px;
  }

  /* ── Filtros empilham ── */
  .filters-row {
    flex-direction: column !important;
    gap: 10px !important;
  }

  .filter-group input {
    width: 100% !important;
  }

  .filter-group select {
    width: 100% !important;
  }

  /* ── Topbar original empilha ── */
  .topbar-top {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 10px;
  }

  /* ── Modais fullscreen ── */
  .modal {
    padding: 0 !important;
    align-items: flex-end !important;
  }

  .modal-box {
    width: 100% !important;
    border-radius: 20px 20px 0 0 !important;
    max-height: 92dvh;
    overflow-y: auto;
  }

  .form-grid {
    grid-template-columns: 1fr !important;
  }

  .field.span2 {
    grid-column: span 1 !important;
  }

  .info-grid {
    grid-template-columns: 1fr !important;
  }

  .stat-row {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  /* ── Paginação compacta ── */
  .paginacao {
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 8px !important;
  }

  /* ── Botões de ação nas linhas sempre visíveis ── */
  .acoes {
    opacity: 1 !important;
  }
}
