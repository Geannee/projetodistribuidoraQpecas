// ── ADMIN ACESSO MODEL ─────────────────────────────────────────────────────────

const AcessoModel = {
  BASE_URL: 'http://localhost:8080/admin/usuarios',

  _getHeaders() {
    const token = sessionStorage.getItem('qp_token');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    };
  },

  async _fetchData(url) {
    const response = await fetch(url, { headers: this._getHeaders() });
    if (response.status === 401) throw { status: 401, message: 'Não autorizado' };
    if (!response.ok) throw new Error(`Erro na requisição: ${response.status}`);
    return await response.json();
  },

  async getPendentes() {
    return this._fetchData(`${this.BASE_URL}/pendentes`);
  },

  async getRecusados() {
    return this._fetchData(`${this.BASE_URL}/reprovados`);
  },

  async getAtivos() {
    return this._fetchData(`${this.BASE_URL}/ativos`);
  },

  async aprovarUsuario(id) {
    const response = await fetch(`${this.BASE_URL}/${id}/aprovar`, {
      method: 'PATCH',
      headers: this._getHeaders()
    });
    if (response.status === 401) throw { status: 401 };
    return response.ok;
  },

  async reprovarUsuario(id, motivo) {
    const response = await fetch(`${this.BASE_URL}/${id}/reprovar`, {
      method: 'PATCH',
      headers: {
        ...this._getHeaders(),
        'Content-Type': 'text/plain' // Casando com o @RequestBody String do Java
      },
      body: motivo
    });
    if (response.status === 401) throw { status: 401 };
    return response.ok;
  },

  // Histórico mantido localmente apenas se o Back-end ainda não possuir tabela de logs
  getHistorico() {
    return JSON.parse(localStorage.getItem('qp_historico_acesso')) || [];
  },

  registrarHistoricoLocal(usuario, acao) {
    const historico = this.getHistorico();
    historico.unshift({
      id: Date.now(),
      usuario: usuario?.razaoSocial || '—',
      email: usuario?.email || '—',
      acao,
      realizadoPor: 'Admin',
      dataHora: new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem('qp_historico_acesso', JSON.stringify(historico));
  }
};