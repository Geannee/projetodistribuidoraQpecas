// ── ADMIN ESTOQUE MODEL ───────────────────────────────────────────────────────
// Gerencia as chamadas de API para o estoque e catálogo
// ─────────────────────────────────────────────────────────────────────────────

const AdminEstoqueModel = {
  baseUrl: 'http://localhost:8080',

  async getVeiculos() {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/veiculos/historico`, {
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
      console.error("Erro no Model (getVeiculos):", error);
      return [];
    }
  },

  async getAssociacoes() {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/pecas/associacoes`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.status === 401) {
        Auth.logout();
        return [];
      }

      if (!response.ok) {
        throw new Error('Erro ao buscar associações de peças');
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no Model (getAssociacoes):", error);
      return [];
    }
  },

  async obterModelosPorMarca(marca) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/veiculos/modelos?marca=${encodeURIComponent(marca)}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return [];
      }
      if (!response.ok) throw new Error('Erro ao buscar modelos.');
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (obterModelosPorMarca):', error);
      return [];
    }
  },

  async obterAnoPorModelo(modelo) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/veiculos/anoDeFabricacao?modelo=${encodeURIComponent(modelo)}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return [];
      }
      if (!response.ok) throw new Error('Erro ao buscar Ano de fabricação.');
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (obterAnoPorModelo):', error);
      return [];
    }
  },

  async getFornecedores() {
    try {
      const response = await fetch(`${this.baseUrl}/fabricantes/historico`);
      if (!response.ok) {
        throw new Error('Erro ao buscar histórico de fabricantes');
      }
      return await response.json();
    } catch (error) {
      console.error("Erro no Model (getFornecedores):", error);
      return [];
    }
  },

  async atualizarPeca(id, dados) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/pecas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify({
          categoria:       dados.categoria.toUpperCase(),
          codigo:          dados.sku.toUpperCase(),
          descricao:       dados.descricao || "VAZIO",
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
        return false;
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Erro ao atualizar peça');
      }

      return true;
    } catch (error) {
      console.error("Erro no Model (atualizarPeca):", error);
      throw error;
    }
  }
};
