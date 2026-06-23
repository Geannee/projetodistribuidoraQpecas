const PedidosView = {

  /**
   * Função auxiliar que transforma "EM SEPARAÇÃO" em "Em Separação"
   */
  capitalizarStatus(status) {
    if (!status) return '';
    return status
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
  },

  renderTabela(tbody, pedidos) {
    tbody.innerHTML = pedidos.map(p => {
      const safeId = p.numeroPedido.replace(/-/g, '');
      const nomesItens = p.itens ? p.itens.map(i => i.nomePeca).join(', ') : 'Sem itens';
      const totalFormatado = p.valorTotal ? p.valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : 'R$ 0,00';
      const dataFormatada = p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—';

      const dataPrevisao = new Date(p.data);
      dataPrevisao.setDate(dataPrevisao.getDate() + 3);
      const previsaoFormatada = dataPrevisao.toLocaleDateString('pt-BR');

      // ── TRATAMENTO DO STATUS EM MAIÚSCULO DO BANCO ──────────────────
      // Salvamos o status original em caixa alta para a classe do CSS
      const statusChaveMap = p.status ? p.status.toUpperCase() : '';
      const statusClass = PedidosModel.statusClasse[statusChaveMap] || '';

      // Formatamos o texto para "Ex: Em Separação" para bater com o statusIcone e Filtros
      const statusFormatado = this.capitalizarStatus(p.status);
      // Alteramos a propriedade no objeto temporário para o renderPainel herdar corretamente
      p.status = statusFormatado;
      // ────────────────────────────────────────────────────────────────

      return `
      <tr class="pedido-row" id="row-${safeId}">
        <td class="pedido-id">${p.numeroPedido}</td>
        <td>${dataFormatada}</td>
        <td class="pedido-itens">${nomesItens}</td>
        <td class="pedido-total">${totalFormatado}</td>
        <td>
          <span class="badge-status ${statusClass}">
            ${(PedidosModel.statusIcone[statusFormatado] || (() => ''))() } ${statusFormatado}
          </span>
        </td>
        <td class="pedido-previsao">${ICONS.calendar} ${previsaoFormatada}</td>
        <td>
          <button class="btn-detalhes" id="btn-${safeId}" onclick="PedidosController.toggleDetalhe('${safeId}')">
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

  renderPainel(p, dataFormatada, totalFormatado, previsaoFormatada) {
    const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
    const idxMap = { 'Aguardando Pagamento': 1, 'Em Separação': 2, 'Em Viagem': 3, 'Entregue': 4, 'Cancelado': -1 };

    const atual = idxMap[p.status] ?? 0;

    const timeline = passos.map((passo, i) => `
    <div class="tl-passo ${i <= atual && p.status !== 'Cancelado' ? 'tl-ativo' : ''}">
      <div class="tl-bolinha">${i <= atual && p.status !== 'Cancelado' ? ICONS.check : i + 1}</div>
      <span>${passo}</span>
    </div>
  `).join('');

    const statusOpcoes = Object.keys(PedidosModel.statusIcone).map(s =>
        `<option value="${s}" ${s === p.status ? 'selected' : ''}>${s}</option>`
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

    const safeId = p.numeroPedido.replace(/-/g, '');

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
          <span>${ICONS.truck} Previsão: <strong>${p.status === 'Cancelado' ? 'Cancelada' : previsaoFormatada}</strong></span>
        </div>
      </div>
        <div class="timeline" id="tl-${safeId}">
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