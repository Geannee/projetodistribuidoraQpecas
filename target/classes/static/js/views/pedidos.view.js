// ── ADMIN ACESSO VIEW ──────────────────────────────────────────────────────────

const PedidosView = {

  /**
   * Transforma "EM_SEPARACAO" em "Em Separacao"
   */
  capitalizarStatus(status) {
    if (!status) return '';

    const dicionarioAcentos = {
      'EM SEPARACAO': 'Em Separação',
      'AGUARDANDO PAGAMENTO': 'Aguardando Pagamento'
    };

    const statusLimpo = status.replace(/_/g, ' ').toUpperCase();

    if (dicionarioAcentos[statusLimpo]) {
      return dicionarioAcentos[statusLimpo];
    }

    return statusLimpo
        .toLowerCase()
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
  },

  calcularFrete(p) {
    const valorTotal = p.valorTotal || 0;

    // Soma o total acumulado dos itens (quantidade * precoVenda)
    const totalItens = p.itens ? p.itens.reduce((acumulado, item) => {
      const quantidade = item.quantidade || 0;
      const preco = item.precoVenda || 0;
      return acumulado + (quantidade * preco);
    }, 0) : 0;

    // O frete é a diferença
    const frete = valorTotal - totalItens;

    // Retorna formatado em Reais, ou "Grátis" se for zero/negativo
    if (frete <= 0) return 'Grátis';
    return frete.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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

      // ── CORREÇÃO: Mantemos a string pura do banco ("EM_SEPARACAO") ──
      const statusBanco = p.status ? p.status.toUpperCase() : '';
      const statusClass = PedidosModel.statusClasse[statusBanco] || '';
      const statusFormatado = this.capitalizarStatus(statusBanco);
      // Não sobrescrevemos mais p.status aqui para não quebrar o renderPainel
      // ────────────────────────────────────────────────────────────────

      return `
      <tr class="pedido-row" id="row-${safeId}">
        <td class="pedido-id">${p.numeroPedido}</td>
        <td>${dataFormatada}</td>
        <td class="pedido-itens">${nomesItens}</td>
        <td class="pedido-total">${totalFormatado}</td>
        <td>
          <span class="badge-status ${statusClass}">
            ${(PedidosModel.statusIcone[statusBanco] || (() => ''))() } ${statusFormatado}
          </span>
        </td>
        <td class="pedido-previsao">${ICONS.calendar} ${previsaoFormatada}</td>
        <td>
          <div style="display: flex; gap: 8px; align-items: center;">
            <button class="btn-detalhes" id="btn-${safeId}" onclick="PedidosController.toggleDetalhe('${safeId}')">
              Ver detalhes ▾
            </button>
            ${statusBanco === 'AGUARDANDO_PAGAMENTO' ? `
              <a href="/pagamento-simulado.html?id=${p.idPedido}" target="_blank" class="btn-pagar">
                Pagar
              </a>
            ` : ''}
          </div>
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
    const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Pagamento Processado', 'Em Separação', 'Em Viagem', 'Entregue'];

    const idxMap = {
      'AGUARDANDO_PAGAMENTO': 1,
      'PAGO':                 2,
      'EM_SEPARACAO':         3,
      'FATURADO':             3,
      'EM_VIAGEM':            4,
      'ENTREGUE':             5,
      'CANCELADO':           -1
    };

    // Agora p.status chega aqui como "EM_SEPARACAO", batendo perfeitamente com the idxMap!
    const statusBanco = p.status ? p.status.toUpperCase() : '';
    const atual = idxMap[statusBanco] ?? 0;

    const timeline = passos.map((passo, i) => {
      const estaAtivo = i <= atual && statusBanco !== 'CANCELADO';

      return `
        <div class="tl-passo ${estaAtivo ? 'tl-ativo' : ''}">
          <div class="tl-bolinha">${estaAtivo ? ICONS.check : i + 1}</div>
          <span>${passo}</span>
        </div>
      `;
    }).join('');

    const statusOpcoes = Object.keys(PedidosModel.statusIcone).map(s =>
        `<option value="${s}" ${s === statusBanco ? 'selected' : ''}>${this.capitalizarStatus(s)}</option>`
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
    const freteFormatado = this.calcularFrete(p);

    return `
    <div class="detalhe-painel">
      <div class="dp-secao">
        <div class="dp-secao-titulo">Itens:</div>
        <div class="orcamento-itens">${itensList}
          <div class="orcamento-item frete-row" style="border-top: 1px dashed var(--border-color);">
              <span class="oi-icone">${ICONS.truck}</span>
              <span class="oi-nome">1x Frete: <strong>${freteFormatado}</strong></span>
          </div>
        </div>
                
        <div class="orcamento-total">
          <span>${ICONS.clipboardList} Total do pedido</span>
          <strong>${totalFormatado}</strong>
        </div>
        
        <div class="orcamento-meta">
          <span>${ICONS.calendar} Data: <strong>${dataFormatada}</strong></span>
          <br>
          <span>${ICONS.truck} Previsão: <strong>${statusBanco === 'CANCELADO' ? 'Cancelada' : previsaoFormatada}</strong></span>
        </div>
      </div>
      
      <div class="timeline" id="tl-${safeId}">
        ${statusBanco === 'CANCELADO'
        ? `<div class="tl-cancelado-msg">${ICONS.xCircle} Este pedido foi cancelado.${p.motivoCancelamento ? ` <br><span style="font-weight:normal;color:#6B7280;">Motivo: ${p.motivoCancelamento}</span>` : ''}</div>`
        : timeline}
      </div>

      ${statusBanco === 'AGUARDANDO_PAGAMENTO' ? `
      <div class="dp-pagamento">
        <div class="dp-secao-titulo">Pagamento via Pix</div>
        <div class="qr-container">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.origin + '/pagamento-simulado.html?id=' + p.idPedido)}" alt="QR Code Pix" style="width: 150px; height: 150px; display: block;"/>
        </div>
        <div style="text-align: center; font-size: 11px; color: #6B7280; max-width: 180px; line-height: 1.4;">
          Escaneie o QR Code acima para pagar ou clique no botão abaixo.
        </div>
        <a href="/pagamento-simulado.html?id=${p.idPedido}" target="_blank" class="btn-ir-pagamento">
          Pagar Pedido (Simulador)
        </a>
      </div>
      ` : ''}
    </div>`;
  },

  renderRodape(el, total, filtrado) {
    el.textContent = `Mostrando ${filtrado} de ${total} pedidos`;
  }
};