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
          tipoDeCombustivel: dados.combustivel,
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

  async getPecas() {
    try {
      const response = await fetch('http://localhost:8080/pecas/historico');

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de veículos');
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no Model:", error);
      return [];
    }
  },

  async getFornecedores() {
    try {
      const response = await fetch('http://localhost:8080/fabricantes/historico');
      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de fabricantes');
      }
      return await response.json();
    } catch (error) {
      console.error("Erro no Model (Fornecedores):", error);
      return [];
    }
  },

  async salvarPeca(dados) {
    try {
      const response = await fetch('http://localhost:8080/pecas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          categoria:       dados.categoria.toUpperCase(),
          codigo:          dados.sku.toUpperCase(),
          descricao:       "VAZIO",
          nome:            dados.nome,
          estoque:         Number(dados.estoque),
          tipoPeca:        dados.tipo.toUpperCase(),
          precoBase:       parseFloat(dados.preco.toString().replace(',', '.')),
          fabricanteId:    Number(dados.fabricanteId),
          veiculosIds:     dados.compatibilidade || []
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Erro ao cadastrar peça');
      }

      return await response.text();

    } catch (error) {
      console.error("Erro no Model (Peças):", error);
      throw error;
    }
  },

  async excluirPeca(id) {
    try {
      const response = await fetch(`http://localhost:8080/pecas/${id}/deletar`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir a peça no servidor');
      }

    } catch (error) {
      console.error("Ops! Algo deu errado:", error);
      throw error;
    }
  },

  async skuExiste(sku) {
    const lista = await this.getPecas();
    return lista.some(p => p.codigo?.toLowerCase() === sku?.toLowerCase());
  }
};