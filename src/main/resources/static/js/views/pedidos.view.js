const PedidosView = {

  renderTabela(tbody, pedidos) {
    tbody.innerHTML = pedidos.map(p => `
      <tr class="pedido-row" id="row-${p.id.replace('#','')}">
        <td class="pedido-id">${p.id}</td>
        <td>${p.data}</td>
        <td class="pedido-itens">${p.itens}</td>
        <td class="pedido-total">${p.total}</td>
        <td>
          <span class="badge-status ${p.statusClass}">
            ${(PedidosModel.statusIcone[p.status] || (() => ''))() } ${p.status}
          </span>
        </td>
        <td class="pedido-previsao">${p.previsao !== '—' ? ICONS.calendar + ' ' + p.previsao : '—'}</td>
        <td>
          <button class="btn-detalhes" id="btn-${p.id.replace('#','')}" onclick="PedidosController.toggleDetalhe('${p.id}')">
            Ver detalhes ▾
          </button>
        </td>
      </tr>
      <tr class="detalhe-row" id="detalhe-${p.id.replace('#','')}">
        <td colspan="7" class="detalhe-td">
          ${this.renderPainel(p)}
        </td>
      </tr>
    `).join('');
  },

  renderPainel(p, dataFormatada, totalFormatado) {
    const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
    const idxMap = { 'AGUARDANDO PAGAMENTO': 1, 'EM SEPARAÇÃO': 2, 'EM VIAGEM': 3, 'ENTREGUE': 4, 'CANCELADO': -1, 'PAGO': 1 };
    const statusChave = p.status ? p.status.toUpperCase() : '';
    const atual = idxMap[statusChave] ?? 0;

    const timeline = passos.map((passo, i) => `
      <div class="tl-passo ${i <= atual && p.status !== 'Cancelado' ? 'tl-ativo' : ''}">
        <div class="tl-bolinha">${i <= atual && p.status !== 'Cancelado' ? ICONS.check : i + 1}</div>
        <span>${passo}</span>
      </div>
    `).join('');

    const statusOpcoes = Object.keys(PedidosModel.statusIcone).map(s =>
      `<option value="${s}" ${s === p.status ? 'selected' : ''}>${s}</option>`
    ).join('');

    const itensList = p.itens && p.itens.length > 0 ? p.itens.map(i => `
      <div class="orcamento-item">
        <span class="oi-icone">${ICONS.wrench}</span>
        <span class="oi-nome">${i.trim()}</span>
      </div>
    `).join('') : '<div class="orcamento-item">Nenhum item associado</div>';

    return `
      <div class="detalhe-painel">
        <div class="dp-secao">
          <div class="dp-secao-titulo">${ICONS.clipboardList} Orçamento</div>
          <div class="orcamento-itens">${itensList}</div>
          <div class="orcamento-total">
            <span>Total do pedido</span>
            <strong>${totalFormatado}</strong>
          </div>
          <div class="orcamento-meta">
            <span>${ICONS.calendar} Data: <strong>${p.data}</strong></span>
            <span>${ICONS.truck} Previsão: <strong>${p.previsao !== '—' ? p.previsao : 'A definir'}</strong></span>
          </div>
        </div>

        <div class="dp-secao">
          <div class="dp-secao-titulo">${ICONS.rotateCcw} Status do Pedido</div>
          <div class="status-selector">
            <label class="status-sel-label">Alterar status:</label>
            <select class="status-select" id="sel-${p.idPedido}"
              onchange="PedidosController.atualizarStatus(${p.idPedido}, this.value)">
              ${statusOpcoes}
            </select>
          </div>
          <div class="timeline" id="tl-${p.id.replace('#','')}">
            ${p.status === 'Cancelado'
              ? `<div class="tl-cancelado-msg">${ICONS.xCircle} Este pedido foi cancelado.</div>`
              : timeline}
          </div>
        </div>
      </div>`;
  },

  renderRodape(el, total, filtrado) {
    el.textContent = `Mostrando ${filtrado} de ${total} pedidos`;
  }
};

// // ── PEDIDOS VIEW ──────────────────────────────────────────────────────────────
// // Renderização da tela de listagem de pedidos
// // ─────────────────────────────────────────────────────────────────────────────
//
// const PedidosView = {
//
//   /** Renderiza a tabela com linhas expandíveis */
//   renderTabela(tbody, pedidos) {
//     tbody.innerHTML = pedidos.map(p => `
//       <tr class="pedido-row" id="row-${p.id.replace('#','')}">
//         <td class="pedido-id">${p.id}</td>
//         <td>${p.data}</td>
//         <td class="pedido-itens">${p.itens}</td>
//         <td class="pedido-total">${p.total}</td>
//         <td>
//           <span class="badge-status ${p.statusClass}">
//             ${PedidosModel.statusIcone[p.status]} ${p.status}
//           </span>
//         </td>
//         <td class="pedido-previsao">${p.previsao !== '—' ? '📅 ' + p.previsao : '—'}</td>
//         <td>
//           <button class="btn-detalhes" id="btn-${p.id.replace('#','')}" onclick="PedidosController.toggleDetalhe('${p.id}')">
//             Ver detalhes ▾
//           </button>
//         </td>
//       </tr>
//       <tr class="detalhe-row" id="detalhe-${p.id.replace('#','')}">
//         <td colspan="7" class="detalhe-td">
//           ${this.renderPainel(p)}
//         </td>
//       </tr>
//     `).join('');
//   },
//
//   /** Painel expandido com orçamento e status */
//   renderPainel(p) {
//     const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
//     const idx = { 'Aguardando Pagamento': 1, 'Em Separação': 2, 'Em Viagem': 3, 'Entregue': 4, 'Cancelado': -1 };
//     const atual = idx[p.status] ?? 0;
//
//     const timeline = passos.map((passo, i) => `
//       <div class="tl-passo ${i <= atual && p.status !== 'Cancelado' ? 'tl-ativo' : ''}">
//         <div class="tl-bolinha">${i <= atual && p.status !== 'Cancelado' ? '✓' : i + 1}</div>
//         <span>${passo}</span>
//       </div>
//     `).join('');
//
//     const statusOpcoes = Object.keys(PedidosModel.statusIcone).map(s =>
//       `<option value="${s}" ${s === p.status ? 'selected' : ''}>${PedidosModel.statusIcone[s]} ${s}</option>`
//     ).join('');
//
//     const itensList = p.itens.split(',').map(i => `
//       <div class="orcamento-item">
//         <span class="oi-icone">⚙️</span>
//         <span class="oi-nome">${i.trim()}</span>
//       </div>
//     `).join('');
//
//     return `
//       <div class="detalhe-painel">
//
//         <!-- Orçamento -->
//         <div class="dp-secao">
//           <div class="dp-secao-titulo">📋 Orçamento</div>
//           <div class="orcamento-itens">${itensList}</div>
//           <div class="orcamento-total">
//             <span>Total do pedido</span>
//             <strong>${p.total}</strong>
//           </div>
//           <div class="orcamento-meta">
//             <span>📅 Data: <strong>${p.data}</strong></span>
//             <span>🚚 Previsão: <strong>${p.previsao !== '—' ? p.previsao : 'A definir'}</strong></span>
//           </div>
//         </div>
//
//         <!-- Status -->
//         <div class="dp-secao">
//           <div class="dp-secao-titulo">🔄 Status do Pedido</div>
//           <div class="status-selector">
//             <label class="status-sel-label">Alterar status:</label>
//             <select class="status-select" id="sel-${p.id.replace('#','')}"
//               onchange="PedidosController.atualizarStatus('${p.id}', this.value)">
//               ${statusOpcoes}
//             </select>
//           </div>
//           <div class="timeline" id="tl-${p.id.replace('#','')}">
//             ${p.status === 'Cancelado'
//               ? '<div class="tl-cancelado-msg">❌ Este pedido foi cancelado.</div>'
//               : timeline}
//           </div>
//         </div>
//
//       </div>`;
//   },
//
//   /** Atualiza o contador de resultados no rodapé */
//   renderRodape(el, total, filtrado) {
//     el.textContent = `Mostrando ${filtrado} de ${total} pedidos`;
//   }
// };
