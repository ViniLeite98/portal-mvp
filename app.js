<script>
/* =========================
   BASE DE DADOS – TERAPEUTAS
========================= */

function getTerapeutas() {
  return JSON.parse(localStorage.getItem("terapeutas") || "[]");
}

function terapeutasAtivas() {
  const equipe = getTerapeutas();
  return equipe.filter(t => {
    const status = (t.Status || "").toLowerCase().trim();
    return status === "ativo" || status === "";
  });
}

function terapeutasPorCPF() {
  const map = {};
  getTerapeutas().forEach(t => {
    if (t.CPF) {
      map[t.CPF] = t;
    }
  });
  return map;
}
</script>
