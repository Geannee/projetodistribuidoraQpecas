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

  async getVeiculos() {
    try {
      const response = await fetch('http://localhost:8080/veiculos/historico');

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de veículos');
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no Model:", error);
      return [];
    }
    // try {
    //   return JSON.parse(localStorage.getItem(this.KEYS.veiculos)) || [];
    // } catch {
    //   return [];
    // }
  },

  async salvarVeiculo(dados) {
    try {
      const response = await fetch('http://localhost:8080/veiculos/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Transformamos o objeto JS no JSON que o seu VeiculoDTO espera
        body: JSON.stringify({
          placa: dados.placa.toUpperCase(),
          chassi: dados.chassi.toUpperCase(),
          marca: dados.marca,
          modelo: dados.modelo,
          anoFabricacao: dados.ano,
          tipoDeCompustivel: dados.combustivel,
          observacoes: dados.obs || ''
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Erro ao cadastrar veículo');
      }

      // Se o Java retorna texto puro, use .text() em vez de .json()
      return await response.text();
    } catch (error) {
      console.error("Erro no Model:", error);
      throw error; // Repassa o erro para o Controller exibir um alerta
    }
  },


  async excluirVeiculo(id) {
    // const lista = this.getVeiculos().filter(v => v.id !== id);
    // localStorage.setItem(this.KEYS.veiculos, JSON.stringify(lista));
    try {
      const response = await fetch(`http://localhost:8080/veiculos/${id}/deletar`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir o veículo no servidor');
      }

    } catch (error) {
      console.error("Ops! Algo deu errado:", error);
      throw error;
    }
  },

  async placaExiste(placa) {
    const lista = await this.getVeiculos();
    return lista.some(v => v.placa.toUpperCase() === placa.toUpperCase());
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
