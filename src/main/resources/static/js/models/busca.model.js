


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
      const response = await fetch(`${this.baseUrl}/veiculos/modelos?marca=${encodeURIComponent(marca)}`);
      if (!response.ok) throw new Error('Erro ao buscar modelos.');
      return await response.json(); // Retorna array de strings: ["Gol", "Fox", "Golf"]
    } catch (error) {
      console.error('Erro no Model (obterModelosPorMarca):', error);
      return [];
    }
  },

  async obterAnoPorModelo(modelo) {
    try {
      const response = await fetch(`${this.baseUrl}/veiculos/anoDeFabricacao?modelo=${encodeURIComponent(modelo)}`);
      if (!response.ok) throw new Error('Erro ao buscar Ano de fabricação.');
      return await response.json(); // Retorna array de strings: ["Gol", "Fox", "Golf"]
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
      // Cria dinamicamente os Query Parameters ignorando campos vazios
      const params = new URLSearchParams();
      if (marca) params.append('marca', marca);
      if (modelo) params.append('modelo', modelo);
      if (ano) params.append('ano', ano);
      if (categoria) params.append('categoria', categoria.toUpperCase()); // Enums do back são UPPERCASE

      const response = await fetch(`${this.baseUrl}/pecas/busca-inteligente?${params.toString()}`);
      if (!response.ok) throw new Error('Erro ao buscar peças.');
      return await response.json(); // Retorna a lista de entidades Peca
    } catch (error) {
      console.error('Erro no Model (buscarPecasInteligente):', error);
      return [];
    }
  },

  /**
   * Realiza a busca de veículo e suas respectivas peças através da placa
   */
  async buscarPorPlaca(placa) {
    try {
      const response = await fetch(`${this.baseUrl}/veiculos/findByPlaca?placa=${encodeURIComponent(placa)}`);

      // Se retornar 404, lidamos de forma limpa retornando null
      if (response.status === 404) {
        return null;
      }

      if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);

      return await response.json(); // Retorna o objeto { veiculo: {...}, pecas: [...] }
    } catch (error) {
      console.error('Erro no Model (buscarPorPlaca):', error);
      // Retorna null para o controller saber que houve uma falha ou não encontrou nada
      return null;
    }
  }
};
