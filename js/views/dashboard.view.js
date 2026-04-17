// ── DASHBOARD VIEW ────────────────────────────────────────────────────────────
// Renderização da tabela de atividades e saudação
// ─────────────────────────────────────────────────────────────────────────────

const DashboardView = {

  renderTabela(tbody, atividades) {
    tbody.innerHTML = atividades.map(a => `
      <tr>
        <td>
          <div class="tipo-cell">
            <div class="tipo-icon">${a.icone}</div>
            ${a.tipo}
          </div>
        </td>
        <td>${a.desc}</td>
        <td>${a.data}</td>
        <td><span class="badge-status ${a.statusClass}">${a.status}</span></td>
        <td><button class="btn-detalhes" onclick="DashboardController.verDetalhes('${a.tipo}', '${a.desc}')">Ver detalhes</button></td>
      </tr>
    `).join('');
  },

  renderSaudacao(id, nome) {
    const el = document.getElementById(id);
    if (el) el.textContent = `Olá, ${nome}! 👋`;
  }
};
