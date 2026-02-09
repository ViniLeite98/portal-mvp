document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar");
  if (!sidebarContainer) return;

  fetch("assets/sidebar/sidebar.html")
    .then(res => res.text())
    .then(html => {
      sidebarContainer.innerHTML = html;

      document.querySelectorAll(".submenu-toggle").forEach(btn => {
        btn.addEventListener("click", () => {
          btn.parentElement.classList.toggle("open");
        });
      });
    });
});
