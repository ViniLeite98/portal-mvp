document.addEventListener("DOMContentLoaded", () => {
  fetch("assets/sidebar/sidebar.html")
    .then(r => r.text())
    .then(html => {
      document.getElementById("sidebar").innerHTML = html;
      initSidebar();
    });
});

function initSidebar() {
  // accordion
  document.querySelectorAll(".menu-title").forEach(title => {
    title.addEventListener("click", () => {
      title.parentElement.classList.toggle("active");
    });
  });

  // item ativo
  const page = location.pathname.split("/").pop().replace(".html", "");
  document.querySelectorAll(".sidebar a[data-page]").forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add("active");
    }
  });
}
