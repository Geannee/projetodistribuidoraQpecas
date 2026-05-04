// ── GARANTIA VIEW ─────────────────────────────────────────────────────────────
// Renderização da lista em análise e histórico de garantias
// ─────────────────────────────────────────────────────────────────────────────

const GarantiaView = {

  renderLista(container, itens) {
    if (!itens.length) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:13px;text-align:center;padding:24px 0;">Nenhum chamado em análise.</p>';
      return;
    }
    container.innerHTML = itens.map(s => `
      <div class="sol-item">
        <div class="sol-item-top">
          <span class="sol-item-prot">${s.prot}</span>
          <span class="badge-status ${s.statusClass}">${s.status}</span>
        </div>
        <div class="sol-item-desc">${s.desc}</div>
        <div class="sol-item-bottom">
          <span class="sol-item-data">Aberto em: ${s.data}</span>
        </div>
      </div>
    `).join('');
  },

  renderHistorico(tbody, historico) {
    tbody.innerHTML = historico.map(h => `
      <tr>
        <td style="font-weight:700;">${h.prot}</td>
        <td>${h.pedido}</td>
        <td>${h.produto}</td>
        <td>${h.defeito}</td>
        <td>${h.data}</td>
        <td><span class="badge-status ${h.statusClass}">${h.status}</span></td>
        <td><button class="btn-detalhes">Detalhes</button></td>
      </tr>
    `).join('');
  },

  mostrarModal(pedido, protocolo) {
    document.getElementById('modal-info').textContent =
      `Chamado de garantia para o pedido ${pedido} foi registrado com sucesso.`;
    document.getElementById('modal-protocolo').textContent = protocolo;
    Modal.abrir();
  }
};
