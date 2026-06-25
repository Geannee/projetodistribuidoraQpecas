// ── GARANTIA MODEL ────────────────────────────────────────────────────────────
// Dados de chamados de garantia em análise e histórico
// ─────────────────────────────────────────────────────────────────────────────

const GarantiaModel = {

  analise: [
    { prot: 'GAR-0087', desc: 'Pastilha de Freio TRW GDB1497 — Desgaste prematuro', data: '21/03/2026', status: 'Em análise', statusClass: 'status-analise' },
    { prot: 'GAR-0084', desc: 'Amortecedor Monroe 34050 — Defeito de fabricação',    data: '18/03/2026', status: 'Em análise', statusClass: 'status-analise' },
  ],

  historico: [
    { prot: 'GAR-0087', pedido: '#4798', produto: 'Pastilha de Freio TRW',   defeito: 'Desgaste prematuro',  data: '21/03/2026', status: 'Em análise', statusClass: 'status-analise'  },
    { prot: 'GAR-0084', pedido: '#4756', produto: 'Amortecedor Monroe 34050', defeito: 'Defeito fabricação',  data: '18/03/2026', status: 'Em análise', statusClass: 'status-analise'  },
    { prot: 'GAR-0071', pedido: '#4620', produto: 'Kit Velas NGK Iridium',    defeito: 'Falha de material',   data: '05/03/2026', status: 'Aprovada',   statusClass: 'status-aprovada' },
    { prot: 'GAR-0065', pedido: '#4570', produto: 'Filtro de Ar Mann-Filter', defeito: 'Dimensão incorreta',  data: '18/02/2026', status: 'Aprovada',   statusClass: 'status-aprovada' },
  ]
};
