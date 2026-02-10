document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar");

  fetch("assets/sidebar/sidebar.html")
    .then(res => res.text())
    .then(html => {
      sidebarContainer.innerHTML = html;
      marcarAtivo();
    });
});

function marcarAtivo() {
  const links = document.querySelectorAll(".menu a");
  const path = window.location.pathname.split("/").pop();

  links.forEach(link => {
    if (link.getAttribute("href") === path) {
      link.classList.add("active");
    }
  });
}
