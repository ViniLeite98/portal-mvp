<script>
function getFaltas() {
  return JSON.parse(localStorage.getItem("faltas") || "[]");
}

function saveFaltas(faltas) {
  localStorage.setItem("faltas", JSON.stringify(faltas));
}
</script>
