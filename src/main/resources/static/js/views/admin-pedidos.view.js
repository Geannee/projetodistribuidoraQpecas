// ── ADMIN PEDIDOS VIEW ──────────────────────────────────────────────────────────
// Cuida da manipulação do DOM e renderização dos pedidos e modais
// ─────────────────────────────────────────────────────────────────────────────

const AdminPedidosView = {
  tbodyOrders: document.getElementById('orders-list'),
  countPendente: document.getElementById('count-pendente'),
  countSeparacao: document.getElementById('count-separacao'),
  countFaturado: document.getElementById('count-faturado'),
  countCancelado: document.getElementById('count-cancelado'),

  // Modal
  modal: document.getElementById('order-modal-overlay'),
  modalOrderNumber: document.getElementById('modal-order-number'),
  modalClientName: document.getElementById('modal-client-name'),
  modalClientCnpj: document.getElementById('modal-client-cnpj'),
  modalOrderDate: document.getElementById('modal-order-date'),
  modalOrderFrete: document.getElementById('modal-order-frete'),
  modalOrderTotal: document.getElementById('modal-order-total'),
  modalOrderItems: document.getElementById('modal-order-items'),
  modalActionsContainer: document.getElementById('modal-actions-container'),
  shortageAlert: document.getElementById('shortage-alert'),
  closeBtn: document.getElementById('modal-close-btn'),

  // Inputs
  searchInput: document.getElementById('search-input'),
  filterStatus: document.getElementById('filter-status'),
  filterStartDate: document.getElementById('filter-start-date'),
  filterEndDate: document.getElementById('filter-end-date'),

  showToast(msg, tipo = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = `toast toast-${tipo} show`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
  },

  renderCounters(stats) {
    if (this.countPendente) this.countPendente.textContent = stats.pendente || 0;
    if (this.countSeparacao) this.countSeparacao.textContent = stats.separacao || 0;
    if (this.countFaturado) this.countFaturado.textContent = stats.faturado || 0;
    if (this.countCancelado) this.countCancelado.textContent = stats.cancelado || 0;
  },

  renderOrders(orders) {
    if (!this.tbodyOrders) return;

    if (orders.length === 0) {
      this.tbodyOrders.innerHTML = `
        <tr>
          <td colspan="7" style="text-align: center; padding: 24px; color: var(--gray-text);">
            Nenhum pedido localizado para os critérios aplicados.
          </td>
        </tr>
      `;
      return;
    }

    this.tbodyOrders.innerHTML = orders.map(order => {
      const dataFormatada = new Date(order.data).toLocaleString('pt-BR');
      const statusLabel = this.getStatusBadge(order.status);
      const isPendente = order.status === 'PAGO' || order.status === 'AGUARDANDO_PAGAMENTO';
      const isSeparacao = order.status === 'EM_SEPARACAO';

      let acoesHtml = '';
      if (isPendente) {
        acoesHtml = `<button class="btn-action-sm btn-action-primary" onclick="event.stopPropagation(); AdminPedidosController.iniciarSeparacao(${order.idPedido})">Separar</button>`;
      } else if (isSeparacao) {
        acoesHtml = `
          <div style="display:flex; gap:6px; justify-content:flex-end;">
            <button class="btn-action-sm btn-action-primary" style="background:#10B981;" onclick="event.stopPropagation(); AdminPedidosController.faturarPedido(${order.idPedido})">Faturar</button>
            <button class="btn-action-sm btn-action-danger" onclick="event.stopPropagation(); AdminPedidosController.cancelarPedido(${order.idPedido})">Cancelar</button>
          </div>
        `;
      } else {
        acoesHtml = `<button class="btn-action-sm btn-action-secondary" onclick="event.stopPropagation(); AdminPedidosController.abrirPedido(${order.idPedido})">Ver</button>`;
      }

      return `
        <tr style="cursor:pointer;" onclick="AdminPedidosController.abrirPedido(${order.idPedido})">
          <td style="font-weight:700;">${order.numeroPedido}</td>
          <td>${dataFormatada}</td>
          <td>${order.nomeCliente || 'Desconhecido'}</td>
          <td style="font-size:12px; color:var(--gray-text);">${order.cnpjCliente || '-'}</td>
          <td>${statusLabel}</td>
          <td style="font-weight:700; color:var(--primary);">R$ ${order.valorTotal.toFixed(2).replace('.', ',')}</td>
          <td style="text-align:right;">${acoesHtml}</td>
        </tr>
      `;
    }).join('');
  },

  getStatusBadge(status) {
    const badges = {
      'AGUARDANDO_PAGAMENTO': '<span class="catalog-vehicle-badge" style="background:#FEF08A; color:#854D0E;">Aguard. Pagamento</span>',
      'PAGO': '<span class="catalog-vehicle-badge" style="background:#FEF08A; color:#854D0E;">Pendente</span>',
      'EM_SEPARACAO': '<span class="catalog-vehicle-badge" style="background:#DBEAFE; color:#1E40AF;">Em Separação</span>',
      'FATURADO': '<span class="catalog-vehicle-badge" style="background:#D1FAE5; color:#065F46;">Faturado</span>',
      'EM_VIAGEM': '<span class="catalog-vehicle-badge" style="background:#D1FAE5; color:#065F46;">Em Viagem</span>',
      'ENTREGUE': '<span class="catalog-vehicle-badge" style="background:#D1FAE5; color:#065F46;">Entregue</span>',
      'CANCELADO': '<span class="catalog-vehicle-badge" style="background:#FEE2E2; color:#991B1B;">Cancelado</span>'
    };
    return badges[status] || `<span class="catalog-vehicle-badge">${status}</span>`;
  },

  abrirModalDetails(order) {
    if (!this.modal) return;
    this.shortageAlert.style.display = 'none';

    this.modalOrderNumber.textContent = `Detalhes do Pedido - ${order.numeroPedido}`;
    this.modalClientName.textContent = order.nomeCliente || 'Desconhecido';
    this.modalClientCnpj.textContent = order.cnpjCliente || '-';
    this.modalOrderDate.textContent = new Date(order.data).toLocaleString('pt-BR');
    this.modalOrderFrete.textContent = `R$ ${order.valorFrete.toFixed(2).replace('.', ',')}`;
    this.modalOrderTotal.textContent = `R$ ${order.valorTotal.toFixed(2).replace('.', ',')}`;

    // Render items
    const isSeparacao = order.status === 'EM_SEPARACAO';
    this.modalOrderItems.innerHTML = order.itens.map(item => {
      const inputHtml = isSeparacao
        ? `<input type="number" class="item-qty-input" min="1" value="${item.quantidade}" onchange="AdminPedidosController.alterarQuantidadeItem(${order.idPedido}, ${item.idPeca}, this.value)"/>`
        : `<strong>${item.quantidade}</strong>`;

      const removeBtnHtml = isSeparacao
        ? `<button class="btn-action-sm btn-action-danger" style="padding:4px 8px; font-size:11px;" onclick="AdminPedidosController.removerItemPedido(${order.idPedido}, ${item.idPeca})">Remover</button>`
        : `-`;

      return `
        <tr>
          <td style="font-weight:600;">${item.nomePeca}</td>
          <td style="text-align:center;">${inputHtml}</td>
          <td>R$ ${item.precoVenda.toFixed(2).replace('.', ',')}</td>
          <td style="font-weight:700;">R$ ${item.subtotal.toFixed(2).replace('.', ',')}</td>
          <td style="text-align:right;">${removeBtnHtml}</td>
        </tr>
      `;
    }).join('');

    // Actions container in side panel
    let actionsHtml = '';
    if (order.status === 'PAGO' || order.status === 'AGUARDANDO_PAGAMENTO') {
      actionsHtml = `<button class="btn-primary btn-coral" style="width:100%;" onclick="AdminPedidosController.iniciarSeparacao(${order.idPedido})">Iniciar Separação</button>`;
    } else if (order.status === 'EM_SEPARACAO') {
      actionsHtml = `
        <button class="btn-primary btn-green" style="width:100%;" onclick="AdminPedidosController.faturarPedido(${order.idPedido})">Faturar Pedido</button>
        <button class="btn-primary" style="width:100%; background:#EF4444; margin-top:8px;" onclick="AdminPedidosController.cancelarPedido(${order.idPedido})">Cancelar Pedido</button>
      `;
    }
    this.modalActionsContainer.innerHTML = actionsHtml;

    // Render cancel reason if canceled
    const cancelReasonRow = document.getElementById('modal-cancel-reason-row');
    const cancelReasonVal = document.getElementById('modal-cancel-reason');
    if (cancelReasonRow && cancelReasonVal) {
      if (order.status === 'CANCELADO' && order.motivoCancelamento) {
        cancelReasonVal.textContent = order.motivoCancelamento;
        cancelReasonRow.style.display = 'flex';
      } else {
        cancelReasonRow.style.display = 'none';
      }
    }

    this.modal.classList.add('show');
  },

  fecharModal() {
    if (this.modal) this.modal.classList.remove('show');
  },

  mostrarErroFaturamento(mensagem) {
    if (this.shortageAlert) {
      this.shortageAlert.textContent = mensagem;
      this.shortageAlert.style.display = 'block';
    }
  }
};
