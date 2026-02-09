// assets/sidebar/sidebar.js

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const SUPABASE_URL = "https://rymehgsoarjeecuwyhny.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5bWVoZ3NvYXJqZWVjdXd5aG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2NTc0ODUsImV4cCI6MjA4NjIzMzQ4NX0.K9BUapByrh6TsSi5jEkL8HGLDmMT_tGSSykl7LGxIec";

window.supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ======================
   SIDEBAR HTML
====================== */
document.getElementById("sidebar").innerHTML = `
  <h2>Hara Spa</h2>

  <a href="index.html"><i class="fa-solid fa-house"></i> Início</a>
  <a href="equipe.html" class="active"><i class="fa-solid fa-users"></i> Gestão da Equipe</a>
  <a href="solicitacoes.html"><i class="fa-solid fa-calendar-xmark"></i> Solicitações</a>
  <a href="escalas.html"><i class="fa-solid fa-calendar-days"></i> Escalas</a>
  <a href="materiais.html"><i class="fa-solid fa-box-open"></i> Materiais</a>
  <a href="financeiro.html"><i class="fa-solid fa-coins"></i> Financeiro</a>
`;
