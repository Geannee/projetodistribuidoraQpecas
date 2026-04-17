// ── DASHBOARD MODEL ───────────────────────────────────────────────────────────
// Dados da tabela de atividades recentes
// ─────────────────────────────────────────────────────────────────────────────

const DashboardModel = {

  atividades: [
    { icone: '🧾', tipo: 'Boleto',    desc: 'Pedido #4821 – Kit Suspensão Monroe',    data: '24/03/2026', status: 'Pendente',   statusClass: 'status-pendente' },
    { icone: '📦', tipo: 'Pedido',    desc: 'Filtro de Óleo Bosch + Velas NGK (kit)', data: '22/03/2026', status: 'Entregue',   statusClass: 'status-entregue' },
    { icone: '🔄', tipo: 'Devolução', desc: 'Amortecedor Dianteiro – peça errada',     data: '20/03/2026', status: 'Em análise', statusClass: 'status-analise'  },
    { icone: '🛡', tipo: 'Garantia',  desc: 'Pastilha de Freio TRW – defeito fab.',    data: '18/03/2026', status: 'Aprovada',   statusClass: 'status-aprovada' },
    { icone: '📦', tipo: 'Pedido',    desc: 'Correia dentada Gates + tensor',          data: '15/03/2026', status: 'Entregue',   statusClass: 'status-entregue' },
  ]
};
