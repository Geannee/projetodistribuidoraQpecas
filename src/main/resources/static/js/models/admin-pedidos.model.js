// ── ADMIN PEDIDOS MODEL ────────────────────────────────────────────────────────
// Gerencia as chamadas de API para o painel de pedidos do distribuidor
// ─────────────────────────────────────────────────────────────────────────────

const AdminPedidosModel = {
  baseUrl: 'http://localhost:8080',

  async getPedidos() {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/pedidos`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return [];
      }
      if (!response.ok) throw new Error('Erro ao buscar pedidos.');
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (getPedidos):', error);
      return [];
    }
  },

  async updateStatus(id, status, motivoCancelamento = '') {
    try {
      const token = sessionStorage.getItem('qp_token');
      let url = `${this.baseUrl}/pedidos/${id}/status?status=${status}`;
      if (status === 'CANCELADO' && motivoCancelamento) {
        url += `&motivoCancelamento=${encodeURIComponent(motivoCancelamento)}`;
      }
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return null;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao atualizar status.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (updateStatus):', error);
      throw error;
    }
  },

  async adjustItemQuantity(idPedido, idPeca, quantidade) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/pedidos/${idPedido}/itens/${idPeca}?quantidade=${quantidade}`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return null;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao ajustar quantidade do item.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (adjustItemQuantity):', error);
      throw error;
    }
  },

  async removeItem(idPedido, idPeca) {
    try {
      const token = sessionStorage.getItem('qp_token');
      const response = await fetch(`${this.baseUrl}/pedidos/${idPedido}/itens/${idPeca}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      if (response.status === 401) {
        Auth.logout();
        return null;
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Erro ao remover item.');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro no Model (removeItem):', error);
      throw error;
    }
  }
};
