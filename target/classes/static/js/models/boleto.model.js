// ── BOLETO MODEL ──────────────────────────────────────────────────────────────
// Dados de boletos em aberto e histórico
// ─────────────────────────────────────────────────────────────────────────────

const BoletoModel = {

  boletosAbertos: [
    { num: '#BOL-4821', desc: 'Kit Suspensão Monroe',       valor: 'R$ 364,03', venc: '28/03/2026', urgente: true  },
    { num: '#BOL-4798', desc: 'Pastilha de Freio TRW Kit',  valor: 'R$ 210,00', venc: '02/04/2026', urgente: false },
    { num: '#BOL-4756', desc: 'Kit Amortecedor Dianteiro',   valor: 'R$ 380,00', venc: '05/04/2026', urgente: false },
  ],

  historico: [
    { num: '#BOL-4821', pedido: '#4821', desc: 'Kit Suspensão Monroe',       valor: 'R$ 364,03', venc: '28/03/2026', status: 'Pendente', statusClass: 'status-pendente' },
    { num: '#BOL-4798', pedido: '#4798', desc: 'Pastilha de Freio TRW Kit',  valor: 'R$ 210,00', venc: '02/04/2026', status: 'Pendente', statusClass: 'status-pendente' },
    { num: '#BOL-4756', pedido: '#4756', desc: 'Kit Amortecedor Dianteiro',   valor: 'R$ 380,00', venc: '05/04/2026', status: 'Pendente', statusClass: 'status-pendente' },
    { num: '#BOL-4710', pedido: '#4710', desc: 'Filtro de Óleo Bosch',        valor: 'R$ 94,90',  venc: '15/03/2026', status: 'Pago',     statusClass: 'status-pago'     },
    { num: '#BOL-4682', pedido: '#4682', desc: 'Kit Velas NGK Iridium',       valor: 'R$ 196,00', venc: '10/03/2026', status: 'Pago',     statusClass: 'status-pago'     },
  ]
};
