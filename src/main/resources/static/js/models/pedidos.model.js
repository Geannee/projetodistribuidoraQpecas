// ── PEDIDOS MODEL ─────────────────────────────────────────────────────────────
// Dados dos pedidos do cliente e seus status
// ─────────────────────────────────────────────────────────────────────────────

const PedidosModel = {

  pedidos: [
    {
      id: '#5021',
      data: '19/04/2026',
      itens: 'Kit Suspensão Monroe + Amortecedor Cofap',
      total: 'R$ 744,03',
      status: 'Em Separação',
      statusClass: 'status-separacao',
      previsao: '22/04/2026'
    },
    {
      id: '#4998',
      data: '17/04/2026',
      itens: 'Pastilha de Freio TRW + Cabo de Vela NGK',
      total: 'R$ 608,00',
      status: 'Em Viagem',
      statusClass: 'status-viagem',
      previsao: '21/04/2026'
    },
    {
      id: '#4975',
      data: '15/04/2026',
      itens: 'Kit Filtros Mann-Filter Completo',
      total: 'R$ 315,26',
      status: 'Aguardando Pagamento',
      statusClass: 'status-aguardando',
      previsao: '—'
    },
    {
      id: '#4950',
      data: '10/04/2026',
      itens: 'Bobina de Ignição Bosch + Velas Iridium NGK',
      total: 'R$ 645,90',
      status: 'Entregue',
      statusClass: 'status-entregue',
      previsao: '—'
    },
    {
      id: '#4921',
      data: '05/04/2026',
      itens: 'Kit Embreagem Sachs Completo',
      total: 'R$ 398,33',
      status: 'Entregue',
      statusClass: 'status-entregue',
      previsao: '—'
    },
    {
      id: '#4890',
      data: '01/04/2026',
      itens: 'Correia Dentada Gates + Tensor',
      total: 'R$ 287,50',
      status: 'Cancelado',
      statusClass: 'status-cancelado',
      previsao: '—'
    }
  ],

  carregarPedidos() {
    const salvos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    return [...salvos, ...this.pedidos];
  },

  statusIcone: {
    'Em Separação':         () => ICONS.package,
    'Em Viagem':            () => ICONS.truck,
    'Aguardando Pagamento': () => ICONS.creditCard,
    'Entregue':             () => ICONS.checkCircle,
    'Cancelado':            () => ICONS.xCircle,
  },

  statusClasse: {
    'Em Separação':         'status-separacao',
    'Em Viagem':            'status-viagem',
    'Aguardando Pagamento': 'status-aguardando',
    'Entregue':             'status-entregue',
    'Cancelado':            'status-cancelado'
  }
};
