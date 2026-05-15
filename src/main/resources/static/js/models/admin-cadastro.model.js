// ── ADMIN CADASTRO MODEL ───────────────────────────────────────────────────────
// Persiste veículos e peças no localStorage como arrays JSON
// ─────────────────────────────────────────────────────────────────────────────

const AdminCadastroModel = {

  KEYS: {
    veiculos: 'qp_veiculos',
    pecas:    'qp_pecas'
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
