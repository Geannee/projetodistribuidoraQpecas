// ── ADMIN ACESSO MODEL ─────────────────────────────────────────────────────────

const AcessoModel = {

  KEYS: {
    usuarios:  'qp_usuarios_acesso',
    historico: 'qp_historico_acesso'
  },

  // Dados de demonstração carregados na primeira vez
  _seed() {
    if (localStorage.getItem(this.KEYS.usuarios)) return;
    const demo = [
      { id: 1, nome: 'Oficina Silva',   email: 'silva@oficina.com',  cnpj: '12.345.678/0001-90', tentativas: 5, bloqueado: true,  ultimoAcesso: '2026-05-01 08:12', bloqueadoEm: '2026-05-01 08:15' },
      { id: 2, nome: 'Auto Peças Ltda', email: 'contato@autopecas.com', cnpj: '98.765.432/0001-11', tentativas: 3, bloqueado: true,  ultimoAcesso: '2026-05-02 14:30', bloqueadoEm: '2026-05-02 14:35' },
      { id: 3, nome: 'Mecânica Boa',    email: 'mecanicaboa@gmail.com', cnpj: '11.222.333/0001-44', tentativas: 1, bloqueado: false, ultimoAcesso: '2026-05-03 09:00', bloqueadoEm: null }
    ];
    localStorage.setItem(this.KEYS.usuarios, JSON.stringify(demo));
    localStorage.setItem(this.KEYS.historico, JSON.stringify([]));
  },

  getUsuarios() {
    this._seed();
    return JSON.parse(localStorage.getItem(this.KEYS.usuarios)) || [];
  },

  getBloqueados() {
    return this.getUsuarios().filter(u => u.bloqueado);
  },

  buscar(termo) {
    const t = termo.toLowerCase().trim();
    return this.getUsuarios().find(u =>
      u.email.toLowerCase().includes(t) ||
      u.cnpj.replace(/\D/g, '').includes(t.replace(/\D/g, '')) ||
      u.nome.toLowerCase().includes(t)
    ) || null;
  },

  liberarAcesso(id) {
    const lista = this.getUsuarios().map(u =>
      u.id === id ? { ...u, bloqueado: false, tentativas: 0, bloqueadoEm: null } : u
    );
    localStorage.setItem(this.KEYS.usuarios, JSON.stringify(lista));
    this._registrarHistorico(id, 'Acesso liberado');
  },

  resetarSenha(id) {
    this._registrarHistorico(id, 'Senha redefinida');
  },

  _registrarHistorico(userId, acao) {
    const usuario  = this.getUsuarios().find(u => u.id === userId);
    const historico = this.getHistorico();
    historico.unshift({
      id:          Date.now(),
      usuario:     usuario?.nome || '—',
      email:       usuario?.email || '—',
      acao,
      realizadoPor: 'Admin',
      dataHora:    new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem(this.KEYS.historico, JSON.stringify(historico));

    // Registra na auditoria global
    AuditoriaModel?.registrar('ACESSO_LIBERADO', usuario?.email || '—', acao);
  },

  getHistorico() {
    return JSON.parse(localStorage.getItem(this.KEYS.historico)) || [];
  }
};
