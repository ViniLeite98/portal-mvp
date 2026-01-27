document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar");

  if (!sidebarContainer) return;

  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      sidebarContainer.innerHTML = html;

      // marca item ativo automaticamente
      const page = location.pathname.split("/").pop().replace(".html", "") || "index";

      document.querySelectorAll(".menu a").forEach(link => {
        if (link.dataset.page === page) {
          link.classList.add("active");
        }
      });
    })
    .catch(err => {
      console.error("Erro ao carregar sidebar:", err);
    });
});
