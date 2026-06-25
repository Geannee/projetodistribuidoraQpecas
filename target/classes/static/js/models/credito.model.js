// ── CRÉDITO MODEL ─────────────────────────────────────────────────────────────
// Dados de solicitações de crédito em andamento e histórico
// ─────────────────────────────────────────────────────────────────────────────

const CreditoModel = {

  andamento: [],

  historico: [
    { prot: 'CRE-0012', limite: 'R$ 8.000,00', finalidade: 'Aumento de estoque',  data: '10/03/2026', status: 'Aprovada', statusClass: 'status-aprovada', resposta: 'Limite aprovado: R$ 5.000' },
    { prot: 'CRE-0009', limite: 'R$ 5.000,00', finalidade: 'Manutenção de frota', data: '15/01/2026', status: 'Aprovada', statusClass: 'status-aprovada', resposta: 'Limite aprovado: R$ 5.000' },
    { prot: 'CRE-0005', limite: 'R$ 3.000,00', finalidade: 'Demanda sazonal',     data: '20/10/2025', status: 'Aprovada', statusClass: 'status-aprovada', resposta: 'Limite aprovado: R$ 3.000' },
  ]
};
