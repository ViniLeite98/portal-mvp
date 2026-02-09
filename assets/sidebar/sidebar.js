document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar");
  if (!sidebarContainer) return;

  fetch("assets/sidebar/sidebar.html")
    .then(res => res.text())
    .then(html => {
      sidebarContainer.innerHTML = html;

      document.querySelectorAll(".submenu-toggle").forEach(toggle => {
        toggle.addEventListener("click", e => {
          e.preventDefault();
          toggle.parentElement.classList.toggle("open");
        });
      });

      // Marca link ativo
      const current = location.pathname.split("/").pop();
      document.querySelectorAll(".sidebar a").forEach(link => {
        if (link.getAttribute("href") === current) {
          link.classList.add("active");
        }
      });
    });
});
