const PedidosModel = {
  baseUrl: 'http://localhost:8080',
  USUARIO_LOGADO_ID: sessionStorage.getItem('qp_id'),
  cachePedidos: [], // Cache local para que os filtros continuem instantâneos na tela

  async carregarPedidos() {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/pedidos/historico/${this.USUARIO_LOGADO_ID}`, {
        method: 'GET',
        headers: {'Authorization': token ? `Bearer ${token}` : ''}
      });
      if (response.status === 401) {
        if (typeof Auth !== 'undefined') Auth.logout();
        return [];
      }

      if (!response.ok) throw new Error('Erro ao buscar histórico de pedidos');
      this.cachePedidos = await response.json();
      return this.cachePedidos;
    } catch (error) {
      console.error("Erro no Model (carregarPedidos):", error);
      return [];
    }
  },

  statusIcone: {
    'EM_SEPARACAO':         () => ICONS.package,
    'EM_VIAGEM':            () => ICONS.truck,
    'AGUARDANDO_PAGAMENTO': () => ICONS.creditCard,
    'ENTREGUE':             () => ICONS.checkCircle,
    'CANCELADO':            () => ICONS.xCircle,
    'PAGO':                 () => ICONS.checkCircle,
    'FATURADO':             () => ICONS.fileText
  },

  statusClasse: {
    'AGUARDANDO_PAGAMENTO': 'status-aguardando',
    'EM_SEPARACAO':         'status-separacao',
    'EM_VIAGEM':            'status-viagem',
    'ENTREGUE':             'status-entregue',
    'CANCELADO':            'status-cancelado',
    'PAGO':                 'status-entregue',
    'FATURADO':             'status-entregue'
  }
};