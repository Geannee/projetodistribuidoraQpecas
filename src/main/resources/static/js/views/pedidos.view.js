const PedidosView = {

  renderTabela(tbody, pedidos) {
    tbody.innerHTML = pedidos.map(p => {
      const safeId = p.numeroPedido.replace(/-/g, '');
      const nomesItens = p.itens ? p.itens.map(i => i.nomePeca).join(', ') : 'Sem itens';
      const totalFormatado = p.valorTotal ? p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
      const dataFormatada = p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—';

      // Cálculo da data de previsão (Data do pedido + 3 dias)
      const dataPrevisao = new Date(p.data);
      dataPrevisao.setDate(dataPrevisao.getDate() + 3);
      const previsaoFormatada = dataPrevisao.toLocaleDateString('pt-BR');

      const statusClass = p.status ? p.status.toLowerCase() : '';

      return `
      <tr class="pedido-row" id="row-${safeId}">
        <td class="pedido-id">${p.numeroPedido}</td>
        <td>${dataFormatada}</td>
        <td class="pedido-itens">${nomesItens}</td>
        <td class="pedido-total">${totalFormatado}</td>
        <td>
          <span class="badge-status ${statusClass}">
            ${(PedidosModel.statusIcone[p.status] || (() => ''))() } ${p.status}
          </span>
        </td>
        <td class="pedido-previsao">${ICONS.calendar} ${previsaoFormatada}</td>
        <td>
          <button class="btn-detalhes" id="btn-${safeId}" onclick="PedidosController.toggleDetalhe('${p.numeroPedido}')">
            Ver detalhes ▾
          </button>
        </td>
      </tr>
      <tr class="detalhe-row" id="detalhe-${safeId}">
        <td colspan="7" class="detalhe-td">
          ${this.renderPainel(p, dataFormatada, totalFormatado, previsaoFormatada)}
        </td>
      </tr>
    `}).join('');
  },

  // CORREÇÃO 3: Recebendo previsaoFormatada como parâmetro da função
  renderPainel(p, dataFormatada, totalFormatado, previsaoFormatada) {
    const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
    const idxMap = { 'AGUARDANDO PAGAMENTO': 1, 'EM SEPARAÇÃO': 2, 'EM VIAGEM': 3, 'ENTREGUE': 4, 'CANCELADO': -1, 'PAGO': 1 };

    const statusChave = p.status ? p.status.toUpperCase() : '';
    const atual = idxMap[statusChave] ?? 0;

    const timeline = passos.map((passo, i) => `
    <div class="tl-passo ${i <= atual && statusChave !== 'CANCELADO' ? 'tl-ativo' : ''}">
      <div class="tl-bolinha">${i <= atual && statusChave !== 'CANCELADO' ? ICONS.check : i + 1}</div>
      <span>${passo}</span>
    </div>
  `).join('');

    const statusOpcoes = Object.keys(PedidosModel.statusIcone).map(s =>
        `<option value="${s}" ${s.toUpperCase() === statusChave ? 'selected' : ''}>${s}</option>`
    ).join('');

    const itensList = p.itens && p.itens.length > 0 ? p.itens.map(i => {
      const precoFormatado = Number(i.precoVenda || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      return `
    <div class="orcamento-item">
      <span class="oi-icone">${ICONS.wrench}</span>
      <span class="oi-nome">${i.quantidade}x ${i.nomePeca} <strong>R$ ${precoFormatado}</strong></span>
    </div>
  `;
    }).join('') : '<div class="orcamento-item">Nenhum item associado</div>';

    const safeTimelineId = p.numeroPedido ? p.numeroPedido.replace(/-/g, '') : p.idPedido;

    return `
    <div class="detalhe-painel">
      <div class="dp-secao">
        <div class="dp-secao-titulo">Itens:</div>
        <div class="orcamento-itens">${itensList}</div>
        <div class="orcamento-total">
          <span>${ICONS.clipboardList} Total do pedido</span>
          <strong>${totalFormatado}</strong>
        </div>
        <div class="orcamento-meta">
          <span>${ICONS.calendar} Data: <strong>${dataFormatada}</strong></span>
          <br>
          <span>${ICONS.truck} Previsão: <strong>${statusChave === 'CANCELADO' ? 'Cancelada' : previsaoFormatada}</strong></span>
        </div>
      </div>
        <div class="timeline" id="tl-${safeTimelineId}">
          ${statusChave === 'CANCELADO'
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