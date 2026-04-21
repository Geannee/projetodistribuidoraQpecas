// ── PEDIDOS VIEW ──────────────────────────────────────────────────────────────
// Renderização da tela de listagem de pedidos
// ─────────────────────────────────────────────────────────────────────────────

const PedidosView = {

  /** Renderiza a tabela de pedidos */
  renderTabela(tbody, pedidos) {
    tbody.innerHTML = pedidos.map(p => `
      <tr>
        <td class="pedido-id">${p.id}</td>
        <td>${p.data}</td>
        <td class="pedido-itens">${p.itens}</td>
        <td class="pedido-total">${p.total}</td>
        <td>
          <span class="badge-status ${p.statusClass}">
            ${PedidosModel.statusIcone[p.status]} ${p.status}
          </span>
        </td>
        <td class="pedido-previsao">${p.previsao !== '—' ? '📅 ' + p.previsao : '—'}</td>
        <td>
          <button class="btn-detalhes" onclick="PedidosController.verDetalhes('${p.id}')">
            Ver detalhes →
          </button>
        </td>
      </tr>
    `).join('');
  },

  /** Atualiza o contador de resultados no rodapé */
  renderRodape(el, total, filtrado) {
    el.textContent = `Mostrando ${filtrado} de ${total} pedidos`;
  },

  /** Mostra o modal com detalhes do pedido */
  renderModal(pedido) {
    const linha = (label, valor) => `
      <div class="detalhe-linha">
        <span class="detalhe-label">${label}</span>
        <span class="detalhe-valor">${valor}</span>
      </div>`;

    const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
    const idx = {
      'Aguardando Pagamento': 1,
      'Em Separação':        2,
      'Em Viagem':           3,
      'Entregue':            4,
      'Cancelado':           -1
    };
    const atual = idx[pedido.status] ?? 0;

    const timeline = passos.map((passo, i) => `
      <div class="tl-passo ${i <= atual ? 'tl-ativo' : ''} ${pedido.status === 'Cancelado' ? 'tl-cancelado' : ''}">
        <div class="tl-bolinha">${i <= atual && pedido.status !== 'Cancelado' ? '✓' : i + 1}</div>
        <span>${passo}</span>
      </div>
    `).join('');

    return `
      <div class="modal-overlay" id="modal-pedido" onclick="PedidosController.fecharModal(event)">
        <div class="modal-box">
          <div class="modal-header">
            <h3>Pedido ${pedido.id}</h3>
            <button class="modal-fechar" onclick="PedidosController.fecharModal()">✕</button>
          </div>
          <div class="modal-body">
            ${linha('Data do pedido', pedido.data)}
            ${linha('Itens', pedido.itens)}
            ${linha('Total', pedido.total)}
            ${linha('Previsão de entrega', pedido.previsao)}
            <div class="detalhe-linha">
              <span class="detalhe-label">Status</span>
              <span class="badge-status ${pedido.statusClass}">
                ${PedidosModel.statusIcone[pedido.status]} ${pedido.status}
              </span>
            </div>
            <div class="timeline">
              ${pedido.status === 'Cancelado'
                ? '<div class="tl-cancelado-msg">❌ Este pedido foi cancelado.</div>'
                : timeline}
            </div>
          </div>
        </div>
      </div>`;
  }
};
