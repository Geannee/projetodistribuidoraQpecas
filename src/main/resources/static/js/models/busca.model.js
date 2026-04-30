// ── BUSCA MODEL ───────────────────────────────────────────────────────────────
// Dados de veículo simulado, categorias e equivalências de peças
// ─────────────────────────────────────────────────────────────────────────────

const BuscaModel = {

  veiculo: {
    modelo:  'Volkswagen Gol 1.0',
    ano:     '2019 / 2020',
    motor:   '1.0 MPI Flex 82cv',
    cambio:  'Manual 5 marchas',
    chassis: '9BWZZZ377VT004251'
  },

  categorias: [
    { id: 'acc-pastilha', nome: 'Pastilha de Freio Dianteira', icon: '🛑', sub: 'Dianteira / Traseira', count: 12 },
    { id: 'acc-disco',    nome: 'Disco de Freio Dianteiro',    icon: '⭕', sub: 'Dianteiro / Traseiro', count: 8  },
    { id: 'acc-vela',     nome: 'Vela de Ignição',             icon: '⚡', sub: 'Simples / Iridium',   count: 9  },
    { id: 'acc-cabo',     nome: 'Cabo de Vela — Kit Completo', icon: '🔌', sub: 'Kit completo',         count: 6  },
    { id: 'acc-filtro',   nome: 'Filtro de Óleo',              icon: '🔧', sub: 'Original / Premium',  count: 7  },
    { id: 'acc-comb',     nome: 'Filtro de Combustível',       icon: '💧', sub: 'Flex',                count: 4  },
    { id: 'acc-ar',       nome: 'Filtro de Ar',                icon: '🌬', sub: 'Painel / Cabine',     count: 5  },
    { id: 'acc-amor',     nome: 'Amortecedor Dianteiro',       icon: '🔩', sub: 'Dianteiro / Traseiro',count: 6  },
  ],

  equivalencias: {
    'acc-pastilha': [
      { marca: 'TRW',    desc: 'Pastilha de Freio Dianteira', ref: 'GDB 1497',      badges: ['original','compat','destaque'], destaque: '⭐ Mais vendida',      estoque: 'ok',  preco: 'R$ 87,50'  },
      { marca: 'Bosch',  desc: 'Pastilha de Freio Dianteira', ref: 'BP 714',         badges: ['premium','compat','destaque'],  destaque: '🔝 Alta durabilidade', estoque: 'ok',  preco: 'R$ 112,00' },
      { marca: 'Ferodo', desc: 'Pastilha de Freio Dianteira', ref: 'FDB 1678',       badges: ['original','compat'],            destaque: '',                     estoque: 'ok',  preco: 'R$ 94,90'  },
      { marca: 'Jurid',  desc: 'Pastilha de Freio Dianteira', ref: '573 107 J',      badges: ['economico','compat'],           destaque: '',                     estoque: 'low', preco: 'R$ 62,00'  },
      { marca: 'ATE',    desc: 'Pastilha de Freio Dianteira', ref: '13.0460-2891',   badges: ['premium','compat','destaque'],  destaque: '✔ OEM',                estoque: 'ok',  preco: 'R$ 128,00' },
      { marca: 'Cofap',  desc: 'Pastilha de Freio Dianteira', ref: 'MPF20345',       badges: ['economico','compat'],           destaque: '',                     estoque: 'ok',  preco: 'R$ 54,90'  },
    ],
    'acc-disco': [
      { marca: 'Bosch',  desc: 'Disco de Freio Dianteiro', ref: 'BD 1072',    badges: ['premium','compat'],           destaque: '',               estoque: 'ok', preco: 'R$ 198,00' },
      { marca: 'Fremax', desc: 'Disco de Freio Dianteiro', ref: 'BD-3701',    badges: ['original','compat','destaque'],destaque: '⭐ Mais vendido', estoque: 'ok', preco: 'R$ 142,00' },
      { marca: 'Brembo', desc: 'Disco de Freio Dianteiro', ref: '08.9450.21', badges: ['premium','compat','destaque'], destaque: '🔝 Performance', estoque: 'ok', preco: 'R$ 264,00' },
    ],
    'acc-vela': [
      { marca: 'NGK',   desc: 'Vela de Ignição Iridium — Kit 4 peças',  ref: 'ILFR6B',       badges: ['premium','compat','destaque'], destaque: '⭐ Mais vendida', estoque: 'ok', preco: 'R$ 196,00', label: 'kit com 4' },
      { marca: 'Bosch', desc: 'Vela de Ignição Platina — Kit 4 peças',  ref: 'FR 7 KPP 33+', badges: ['premium','compat'],            destaque: '',               estoque: 'ok', preco: 'R$ 168,00', label: 'kit com 4' },
      { marca: 'Denso', desc: 'Vela de Ignição Simples — Kit 4 peças',  ref: 'W20EP-U',      badges: ['original','compat'],           destaque: '',               estoque: 'ok', preco: 'R$ 98,00',  label: 'kit com 4' },
    ],
    'acc-cabo': [
      { marca: 'Labo',  desc: 'Cabo de Vela — Kit 4 cabos',        ref: 'LB-GN001', badges: ['original','compat','destaque'], destaque: '⭐ Mais vendido', estoque: 'ok', preco: 'R$ 78,00',  label: 'kit com 4' },
      { marca: 'Bosch', desc: 'Cabo de Vela Premium — Kit 4 cabos', ref: 'B 915',    badges: ['premium','compat'],             destaque: '',               estoque: 'ok', preco: 'R$ 112,00', label: 'kit com 4' },
    ]
  }
};
