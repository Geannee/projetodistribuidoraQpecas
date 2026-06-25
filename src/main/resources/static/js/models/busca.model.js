/**
 * MODEL: Gerencia as requisições assíncronas com o Back-end (Spring Boot)
 */
const BuscaModel = {
  baseUrl: 'http://localhost:8080',

  /**
   * Obtém a lista de modelos cadastrados para uma determinada marca
   */
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

  /**
   * Realiza a busca cumulativa e inteligente de peças no back-end
   */
  async buscarPecasInteligente(marca, modelo, ano, categoria) {
    try {
      const token = sessionStorage.getItem('qp_token');
      // Cria dinamicamente os Query Parameters ignorando campos vazios
      const params = new URLSearchParams();
      if (marca) params.append('marca', marca);
      if (modelo) params.append('modelo', modelo);
      if (ano) params.append('ano', ano);
      if (categoria) params.append('categoria', categoria.toUpperCase()); // Enums do back são UPPERCASE

      const response = await fetch(`${this.baseUrl}/pecas/busca-inteligente?${params.toString()}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return [];
      }
      if (!response.ok) throw new Error('Erro ao buscar peças.');
      return await response.json(); // Retorna a lista de entidades Peca
    } catch (error) {
      console.error('Erro no Model (buscarPecasInteligente):', error);
      return [];
    }
  },

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
      if (!response.ok) throw new Error('Erro ao buscar histórico de veículos.');
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (getVeiculos):', error);
      return [];
    }
  },

  /**
   * Realiza a busca de veículo e suas respectivas peças através da placa
   */
  async buscarPorPlaca(placa) {
    try {
        const token = sessionStorage.getItem('qp_token');

        const response = await fetch(`${this.baseUrl}/veiculos/findByPlaca?placa=${encodeURIComponent(placa)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token ? `Bearer ${token}` : ''
            }
        });
        if (response.status === 401) {
            Auth.logout();
            return null;
        }
        if (response.status === 404) {
            return null;
        }

        if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

        return await response.json();
    } catch (error) {
        console.error('Erro no Model (buscarPorPlaca):', error);
        return null;
    }
  },

  async buscarPorCodigo(codigo) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/pecas/buscar-por-codigo?codigo=${encodeURIComponent(codigo)}`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return [];
      }
      if (!response.ok) throw new Error('Erro ao buscar peças por código.');
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (buscarPorCodigo):', error);
      return [];
    }
  }
};
