// ── DEVOLUÇÃO MODEL ───────────────────────────────────────────────────────────
// Dados de devoluções em andamento e histórico
// ─────────────────────────────────────────────────────────────────────────────

const DevolucaoModel = {

  andamento: [
    {
      prot: 'DEV-0041',
      desc: 'Kit Amortecedor Dianteiro — Peça errada entregue',
      data: '22/03/2026',
      status: 'Em andamento',
      statusClass: 'status-andamento'
    }
  ],

  historico: [
    { prot: 'DEV-0041', pedido: '#4756', produto: 'Kit Amortecedor Dianteiro',  motivo: 'Peça errada',     data: '22/03/2026', status: 'Em andamento', statusClass: 'status-andamento' },
    { prot: 'DEV-0038', pedido: '#4682', produto: 'Filtro de Combustível Bosch', motivo: 'Defeito fabric.', data: '10/03/2026', status: 'Aprovada',     statusClass: 'status-aprovada'  },
    { prot: 'DEV-0032', pedido: '#4601', produto: 'Pastilha de Freio TRW',       motivo: 'Incompatível',    data: '20/02/2026', status: 'Aprovada',     statusClass: 'status-aprovada'  },
    { prot: 'DEV-0028', pedido: '#4520', produto: 'Vela de Ignição NGK',          motivo: 'Avariado entrega',data: '05/02/2026', status: 'Negada',       statusClass: 'status-negada'    },
  ]
};
