// ── ADMIN CADASTRO MODEL ───────────────────────────────────────────────────────
// Persiste veículos e peças no localStorage como arrays JSON
// ─────────────────────────────────────────────────────────────────────────────

const AdminCadastroModel = {

  KEYS: {
    veiculos: 'qp_veiculos',
    pecas:    'qp_pecas'
  },

  // ── VEÍCULOS ───────────────────────────────────────────────────────────────

  getVeiculos() {
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

  excluirVeiculo(id) {
    const lista = this.getVeiculos().filter(v => v.id !== id);
    localStorage.setItem(this.KEYS.veiculos, JSON.stringify(lista));
  },

  placaExiste(placa) {
    return this.getVeiculos().some(v => v.placa === placa.toUpperCase());
  },

  // ── PEÇAS ──────────────────────────────────────────────────────────────────

  getPecas() {
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

  excluirPeca(id) {
    const lista = this.getPecas().filter(p => p.id !== id);
    localStorage.setItem(this.KEYS.pecas, JSON.stringify(lista));
  },

  skuExiste(sku) {
    return this.getPecas().some(p => p.sku.toLowerCase() === sku.toLowerCase());
  }
};
