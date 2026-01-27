function resetAll() {
  if (!confirm("Deseja realmente apagar todos os dados locais?")) return;
  localStorage.clear();
  alert("Dados locais apagados.");
  location.reload();
}

// KPI MOCK (temporário)
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("kpiEquipe");
  if (el) {
    const equipe = JSON.parse(localStorage.getItem("equipe") || "[]");
    el.textContent = equipe.length;
  }
});
