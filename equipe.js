function renderList() {
  const data = ativas();

  document.getElementById("countAtivas").textContent =
    `${data.length} terapeutas ativas`;

  if (!data.length) {
    listBox.innerHTML = `<div class="team-muted" style="padding:12px 0">
      Nenhuma terapeuta cadastrada.
    </div>`;
    return;
  }

  listBox.innerHTML = data.map(t => `
    <div class="team-row">
      <div>
        <b>${escapeHtml(t.profName)}</b>
      </div>

      <div>
        ${t.weekOff === "Sim" ? `<span class="badge-sim">Sim</span>` : ""}
      </div>

      <div class="team-muted">
        ${t.weekDay || ""}
      </div>

      <div class="team-muted">
        ${t.startHour || ""}${t.endHour ? "–" + t.endHour : ""}
      </div>

      <div class="team-actions">
        <button class="btn small" onclick="edit('${t.id}')">✏️</button>
        <button class="btn danger small" onclick="removeItem('${t.id}')">🗑️</button>
      </div>
    </div>
  `).join("");
}
