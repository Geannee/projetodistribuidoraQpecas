const OrcamentoModel = {
  baseUrl: 'http://localhost:8080',

  async salvarOrcamento(orcamentoDados) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/orcamentos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(orcamentoDados)
      });

      if (response.status === 401) {
        if (typeof Auth !== 'undefined') Auth.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        const text = await response.text();
        let message = 'Falha ao salvar orçamento.';
        try {
          const json = JSON.parse(text);
          message = json.message || message;
        } catch {}
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no Model (salvarOrcamento):", error);
      throw error;
    }
  },

  async getOrcamentos() {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/orcamentos/meus-orcamentos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.status === 401) {
        if (typeof Auth !== 'undefined') Auth.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      if (!response.ok) {
        const text = await response.text();
        let message = 'Falha ao buscar orçamentos.';
        try {
          const json = JSON.parse(text);
          message = json.message || message;
        } catch {}
        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro no Model (getOrcamentos):", error);
      throw error;
    }
  }
};
