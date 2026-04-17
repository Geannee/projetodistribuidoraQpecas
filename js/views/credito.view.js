// ── CRÉDITO VIEW ──────────────────────────────────────────────────────────────
// Renderização da lista de solicitações e histórico de crédito
// ─────────────────────────────────────────────────────────────────────────────

const CreditoView = {

  renderLista(container, itens) {
    if (!itens.length) {
      container.innerHTML = '<p style="color:#9ca3af;font-size:13px;text-align:center;padding:24px 0;">Nenhuma solicitação em andamento.</p>';
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
          <span class="sol-item-data">Enviado em: ${s.data}</span>
        </div>
      </div>
    `).join('');
  },

  renderHistorico(tbody, historico) {
    tbody.innerHTML = historico.map(h => `
      <tr>
        <td style="font-weight:700;">${h.prot}</td>
        <td style="font-weight:600;">${h.limite}</td>
        <td>${h.finalidade}</td>
        <td>${h.data}</td>
        <td><span class="badge-status ${h.statusClass}">${h.status}</span></td>
        <td style="font-size:12px;color:#6b7280;">${h.resposta}</td>
      </tr>
    `).join('');
  },

  mostrarModal(limite, protocolo) {
    document.getElementById('modal-info').textContent =
      `Solicitação de crédito no valor de R$ ${limite} foi recebida com sucesso.`;
    document.getElementById('modal-protocolo').textContent = protocolo;
    Modal.abrir();
  }
};
