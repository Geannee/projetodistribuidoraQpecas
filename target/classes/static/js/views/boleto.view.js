// ── BOLETO VIEW ───────────────────────────────────────────────────────────────
// Renderização dos boletos em aberto e histórico
// ─────────────────────────────────────────────────────────────────────────────

const BoletoView = {

  renderBoletosAbertos(container, boletos) {
    container.innerHTML = boletos.map(b => `
      <div class="boleto-item">
        <div class="boleto-item-top">
          <span class="boleto-item-num">${b.num}</span>
          <span class="badge-status status-pendente">Pendente</span>
        </div>
        <div class="boleto-item-desc">${b.desc}</div>
        <div class="boleto-item-bottom">
          <div>
            <div class="boleto-valor">${b.valor}</div>
            <div class="boleto-venc ${b.urgente ? 'venc-urgente' : ''}">
              Vence: ${b.venc} ${b.urgente ? '⚠' : ''}
            </div>
          </div>
          <button class="btn-baixar" onclick="BoletoController.baixarBoleto('${b.num}')">↓ Baixar</button>
        </div>
      </div>
    `).join('');
  },

  renderHistorico(tbody, historico) {
    tbody.innerHTML = historico.map(h => `
      <tr>
        <td style="font-weight:600;">${h.num}</td>
        <td>${h.pedido}</td>
        <td>${h.desc}</td>
        <td style="font-weight:700;">${h.valor}</td>
        <td>${h.venc}</td>
        <td><span class="badge-status ${h.statusClass}">${h.status}</span></td>
        <td><button class="btn-detalhes" onclick="BoletoController.baixarBoleto('${h.num}')">↓ Baixar</button></td>
      </tr>
    `).join('');
  },

  mostrarModal(numBoleto, valor, codigo) {
    document.getElementById('modal-info').textContent =
      `Boleto ${numBoleto} no valor de R$ ${valor} foi emitido com sucesso.`;
    document.getElementById('modal-codigo').textContent = codigo;
    Modal.abrir();
  }
};
