// ── ADMIN PEDIDOS CONTROLLER ──────────────────────────────────────────────────
// Orquestra a listagem, filtragem, busca e atualização dos pedidos
// ─────────────────────────────────────────────────────────────────────────────

const AdminPedidosController = {
  allOrders: [],
  filteredOrders: [],
  selectedOrderId: null,

  async init() {
    if (!Auth.checkAdmin()) return;

    this.bindEvents();
    await this.carregarPedidos();
  },

  async carregarPedidos() {
    try {
      this.allOrders = await AdminPedidosModel.getPedidos();
      this.filtrarPedidos();
      this.atualizarContadores();
      
      // Se tiver um modal aberto, atualiza seus dados
      if (this.selectedOrderId) {
        const order = this.allOrders.find(o => o.idPedido == this.selectedOrderId);
        if (order) {
          AdminPedidosView.abrirModalDetails(order);
        } else {
          AdminPedidosView.fecharModal();
          this.selectedOrderId = null;
        }
      }
    } catch (e) {
      console.error(e);
      AdminPedidosView.showToast("Erro ao carregar pedidos.", "error");
    }
  },

  bindEvents() {
    AdminPedidosView.searchInput?.addEventListener('input', () => this.filtrarPedidos());
    AdminPedidosView.filterStatus?.addEventListener('change', () => this.filtrarPedidos());
    AdminPedidosView.filterStartDate?.addEventListener('change', () => this.filtrarPedidos());
    AdminPedidosView.filterEndDate?.addEventListener('change', () => this.filtrarPedidos());

    AdminPedidosView.closeBtn?.addEventListener('click', () => {
      AdminPedidosView.fecharModal();
      this.selectedOrderId = null;
    });

    // Close modal when clicking overlay
    AdminPedidosView.modal?.addEventListener('click', (e) => {
      if (e.target === AdminPedidosView.modal) {
        AdminPedidosView.fecharModal();
        this.selectedOrderId = null;
      }
    });
  },

  filtrarPedidos() {
    const query = AdminPedidosView.searchInput?.value.toLowerCase().trim() || '';
    const status = AdminPedidosView.filterStatus?.value || '';
    const startDate = AdminPedidosView.filterStartDate?.value ? new Date(AdminPedidosView.filterStartDate.value) : null;
    const endDate = AdminPedidosView.filterEndDate?.value ? new Date(AdminPedidosView.filterEndDate.value) : null;

    if (startDate) startDate.setHours(0, 0, 0, 0);
    if (endDate) endDate.setHours(23, 59, 59, 999);

    this.filteredOrders = this.allOrders.filter(order => {
      // 1. Filtro textual (Nº Pedido, Nome Lojista, CNPJ)
      if (query) {
        const numPedido = order.numeroPedido.toLowerCase();
        const nomeCliente = (order.nomeCliente || '').toLowerCase();
        const cnpjCliente = (order.cnpjCliente || '').replace(/\D/g, '');
        const queryClean = query.replace(/\D/g, '');

        const matchesNum = numPedido.includes(query);
        const matchesNome = nomeCliente.includes(query);
        const matchesCNPJ = queryClean ? cnpjCliente.includes(queryClean) : false;

        if (!matchesNum && !matchesNome && !matchesCNPJ) return false;
      }

      // 2. Filtro de Status
      if (status) {
        if (status === 'PENDENTE') {
          if (order.status !== 'PAGO' && order.status !== 'AGUARDANDO_PAGAMENTO') return false;
        } else if (order.status !== status) {
          return false;
        }
      }

      // 3. Filtro de Datas
      if (startDate || endDate) {
        const orderDate = new Date(order.data);
        if (startDate && orderDate < startDate) return false;
        if (endDate && orderDate > endDate) return false;
      }

      return true;
    });

    AdminPedidosView.renderOrders(this.filteredOrders);
  },

  atualizarContadores() {
    const stats = {
      pendente: 0,
      separacao: 0,
      faturado: 0,
      cancelado: 0
    };

    this.allOrders.forEach(o => {
      if (o.status === 'PAGO' || o.status === 'AGUARDANDO_PAGAMENTO') {
        stats.pendente++;
      } else if (o.status === 'EM_SEPARACAO') {
        stats.separacao++;
      } else if (o.status === 'FATURADO' || o.status === 'EM_VIAGEM' || o.status === 'ENTREGUE') {
        stats.faturado++;
      } else if (o.status === 'CANCELADO') {
        stats.cancelado++;
      }
    });

    AdminPedidosView.renderCounters(stats);
  },

  abrirPedido(id) {
    const order = this.allOrders.find(o => o.idPedido == id);
    if (order) {
      this.selectedOrderId = id;
      AdminPedidosView.abrirModalDetails(order);
    }
  },

  async iniciarSeparacao(id) {
    try {
      const order = await AdminPedidosModel.updateStatus(id, 'EM_SEPARACAO');
      if (order) {
        AdminPedidosView.showToast(`Pedido ${order.numeroPedido} está em separação no estoque!`, 'success');
        
        // Add a real-time notification to localStorage for the lojista
        this.addNotification(order.idUsuario, "Pedido em Separação", `O distribuidor iniciou a separação dos itens do seu pedido ${order.numeroPedido}.`);

        await this.carregarPedidos();
      }
    } catch (e) {
      console.error(e);
      AdminPedidosView.showToast("Erro ao iniciar separação.", "error");
    }
  },

  async faturarPedido(id) {
    try {
      const order = await AdminPedidosModel.updateStatus(id, 'FATURADO');
      if (order) {
        AdminPedidosView.showToast(`Pedido ${order.numeroPedido} faturado com sucesso!`, 'success');
        
        // Add a real-time notification to localStorage for the lojista
        this.addNotification(order.idUsuario, "Pedido Faturado", `O seu pedido ${order.numeroPedido} foi faturado e enviado para a logística!`);

        await this.carregarPedidos();
        AdminPedidosView.fecharModal();
        this.selectedOrderId = null;
      }
    } catch (e) {
      console.error(e);
      AdminPedidosView.mostrarErroFaturamento(e.message || "Erro ao faturar pedido.");
    }
  },

  async cancelarPedido(id) {
    const motivo = prompt("Deseja realmente cancelar este pedido? Informe o motivo do cancelamento:");
    if (motivo === null) return; // Clicou em Cancelar
    
    const motivoLimpo = motivo.trim();
    if (!motivoLimpo) {
      alert("É necessário informar um motivo para cancelar o pedido.");
      return;
    }

    try {
      const order = await AdminPedidosModel.updateStatus(id, 'CANCELADO', motivoLimpo);
      if (order) {
        AdminPedidosView.showToast(`Pedido ${order.numeroPedido} foi cancelado.`, 'success');
        
        // Add a real-time notification to localStorage for the lojista
        this.addNotification(order.idUsuario, "Pedido Cancelado", `O seu pedido ${order.numeroPedido} foi cancelado pelo distribuidor. Motivo: ${motivoLimpo}`);

        await this.carregarPedidos();
        AdminPedidosView.fecharModal();
        this.selectedOrderId = null;
      }
    } catch (e) {
      console.error(e);
      AdminPedidosView.showToast("Erro ao cancelar pedido.", "error");
    }
  },

  async alterarQuantidadeItem(idPedido, idPeca, quantidade) {
    const qty = parseInt(quantidade);
    if (isNaN(qty) || qty < 1) {
      alert("Informe uma quantidade válida.");
      return;
    }
    try {
      const order = await AdminPedidosModel.adjustItemQuantity(idPedido, idPeca, qty);
      if (order) {
        AdminPedidosView.showToast("Quantidade ajustada com sucesso!", "success");
        await this.carregarPedidos();
      }
    } catch (e) {
      console.error(e);
      AdminPedidosView.showToast(e.message || "Erro ao ajustar quantidade.", "error");
    }
  },

  async removerItemPedido(idPedido, idPeca) {
    if (!confirm("Deseja realmente remover este item do pedido? O estoque deste item voltará para o catálogo.")) return;
    try {
      const order = await AdminPedidosModel.removeItem(idPedido, idPeca);
      if (order) {
        AdminPedidosView.showToast("Item removido com sucesso!", "success");
        await this.carregarPedidos();
      }
    } catch (e) {
      console.error(e);
      AdminPedidosView.showToast(e.message || "Erro ao remover item.", "error");
    }
  },

  // Helper to add notification to localStorage
  addNotification(userId, title, message) {
    const notification = {
      id: Date.now(),
      titulo: title,
      mensagem: message,
      data: new Date().toLocaleString('pt-BR'),
      lida: false
    };
    const currentNotifs = JSON.parse(localStorage.getItem('qp_notificacoes') || '[]');
    currentNotifs.unshift(notification);
    localStorage.setItem('qp_notificacoes', JSON.stringify(currentNotifs));

    // Trigger cross-tab notification
    localStorage.setItem('qp_notif_trigger', Date.now());
  }
};

// Auto-run controller
document.addEventListener('DOMContentLoaded', () => {
  AdminPedidosController.init();
});
