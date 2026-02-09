document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("sidebar");

  // carrega o HTML do sidebar
  fetch("assets/sidebar/sidebar.html")
    .then(r => r.text())
    .then(html => {
      container.innerHTML = html;

      // marca página ativa
      const page = location.pathname.split("/").pop().replace(".html", "");
      container.querySelectorAll("a").forEach(link => {
        if (link.dataset.page === page) {
          link.classList.add("active");
        }
      });
    })
    .catch(err => console.error("Erro sidebar:", err));
});
