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
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch('http://localhost:8080/veiculos/historico', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.status === 401) {
        Auth.logout();
        return [];
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de veículos');
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no Model:", error);
      return [];
    }
  },

  async salvarVeiculo(dados) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch('http://localhost:8080/veiculos/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
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

      if (response.status === 401) {
        Auth.logout();
        return;
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Erro ao cadastrar veículo');
      }

      return await response.text();
    } catch (error) {
      console.error("Erro no Model:", error);
      throw error;
    }
  },


  async excluirVeiculo(id) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`http://localhost:8080/veiculos/${id}/deletar`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.status === 401) {
        Auth.logout();
        return;
      }

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
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch('http://localhost:8080/pecas/historico', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.status === 401) {
        Auth.logout();
        return [];
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de peças');
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
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch('http://localhost:8080/pecas/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
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

      if (response.status === 401) {
        Auth.logout();
        return;
      }

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
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`http://localhost:8080/pecas/${id}/deletar`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.status === 401) {
        Auth.logout();
        return;
      }

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