// ── ADMIN CADASTRO MODEL ───────────────────────────────────────────────────────
// Persiste veículos e peças no localStorage como arrays JSON
// ─────────────────────────────────────────────────────────────────────────────

const AdminCadastroModel = {

  KEYS: {
    veiculos: 'qp_veiculos',
    pecas:    'qp_pecas'
  },

  // ── SEED DE DEMONSTRAÇÃO ───────────────────────────────────────────────────

  _seed() {
    if (!localStorage.getItem(this.KEYS.veiculos)) {
      localStorage.setItem(this.KEYS.veiculos, JSON.stringify([
        { id: 1, placa: 'PBQ2694', chassi: '9BWAL45U0KT104252', marca: 'VW',   modelo: 'Gol',   ano: 2020, combustivel: 'Flex',     obs: '' },
        { id: 2, placa: 'ABC1D23', chassi: '9BWZZZ377VT004251', marca: 'Fiat', modelo: 'Palio', ano: 2018, combustivel: 'Gasolina', obs: '' }
      ]));
    }
    if (!localStorage.getItem(this.KEYS.pecas)) {
      localStorage.setItem(this.KEYS.pecas, JSON.stringify([
        { id: 3, sku: 'G8197', nome: 'Amortecedor Dianteiro Monroe', categoria: 'Suspensão', tipo: 'Original', compatibilidade: 'VW Gol 2010-2020', preco: 187.00, estoque: 10, fornecedor: 'Monroe' },
        { id: 4, sku: 'F0012', nome: 'Filtro de Óleo Bosch',         categoria: 'Filtros',   tipo: 'Premium',  compatibilidade: 'Fiat Palio 2012-2018', preco: 35.90, estoque: 2,  fornecedor: 'Bosch'  }
      ]));
    }
  },

  // ── VEÍCULOS ───────────────────────────────────────────────────────────────

  getVeiculos() {
    this._seed();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.veiculos)) || [];
    } catch {
      return [];
    }
  },

  salvarVeiculo(dados) {
    const lista = this.getVeiculos();
    const novo  = {
      id:          Date.now(),
      placa:       dados.placa.toUpperCase(),
      chassi:      dados.chassi.toUpperCase(),
      marca:       dados.marca,
      modelo:      dados.modelo,
      ano:         Number(dados.ano),
      combustivel: dados.combustivel,
      obs:         dados.obs || ''
    };
    lista.push(novo);
    localStorage.setItem(this.KEYS.veiculos, JSON.stringify(lista));
    return novo;
  },

  atualizarVeiculo(id, dados) {
    const lista = this.getVeiculos().map(v =>
      v.id === id
        ? { ...v, placa: dados.placa.toUpperCase(), chassi: dados.chassi.toUpperCase(), marca: dados.marca, modelo: dados.modelo, ano: Number(dados.ano), combustivel: dados.combustivel, obs: dados.obs || '' }
        : v
    );
    localStorage.setItem(this.KEYS.veiculos, JSON.stringify(lista));
  },

  excluirVeiculo(id) {
    const lista = this.getVeiculos().filter(v => v.id !== id);
    localStorage.setItem(this.KEYS.veiculos, JSON.stringify(lista));
  },

  placaExiste(placa, excludeId = null) {
    return this.getVeiculos().some(v => v.placa === placa.toUpperCase() && v.id !== excludeId);
  },

  // ── PEÇAS ──────────────────────────────────────────────────────────────────

  getPecas() {
    this._seed();
    try {
      return JSON.parse(localStorage.getItem(this.KEYS.pecas)) || [];
    } catch {
      return [];
    }
  },

  salvarPeca(dados) {
    const lista = this.getPecas();
    const novo  = {
      id:              Date.now(),
      sku:             dados.sku,
      nome:            dados.nome,
      categoria:       dados.categoria,
      tipo:            dados.tipo,
      compatibilidade: dados.compatibilidade,
      preco:           parseFloat(dados.preco.replace(',', '.')),
      estoque:         Number(dados.estoque),
      fornecedor:      dados.fornecedor
    };
    lista.push(novo);
    localStorage.setItem(this.KEYS.pecas, JSON.stringify(lista));
    return novo;
  },

  atualizarPeca(id, dados) {
    const lista = this.getPecas().map(p =>
      p.id === id
        ? { ...p, sku: dados.sku, nome: dados.nome, categoria: dados.categoria, tipo: dados.tipo, compatibilidade: dados.compatibilidade, preco: parseFloat(dados.preco.replace(',', '.')), estoque: Number(dados.estoque), fornecedor: dados.fornecedor }
        : p
    );
    localStorage.setItem(this.KEYS.pecas, JSON.stringify(lista));
  },

  excluirPeca(id) {
    const lista = this.getPecas().filter(p => p.id !== id);
    localStorage.setItem(this.KEYS.pecas, JSON.stringify(lista));
  },

  skuExiste(sku, excludeId = null) {
    return this.getPecas().some(p => p.sku.toLowerCase() === sku.toLowerCase() && p.id !== excludeId);
  }
};
