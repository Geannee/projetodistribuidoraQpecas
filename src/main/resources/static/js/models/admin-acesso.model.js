// ── ADMIN ACESSO MODEL ─────────────────────────────────────────────────────────

const AcessoModel = {

  KEYS: {
    usuarios:  'qp_usuarios_acesso',
    historico: 'qp_historico_acesso'
  },
<<<<<<< HEAD

  // Dados de demonstração carregados na primeira vez
  _seed() {
    if (localStorage.getItem(this.KEYS.usuarios)) return;
    const demo = [
      { id: 1, nome: 'Oficina Silva',   email: 'silva@oficina.com',  cnpj: '12.345.678/0001-90', tentativas: 5, bloqueado: true,  ultimoAcesso: '2026-05-01 08:12', bloqueadoEm: '2026-05-01 08:15' },
      { id: 2, nome: 'Auto Peças Ltda', email: 'contato@autopecas.com', cnpj: '98.765.432/0001-11', tentativas: 3, bloqueado: true,  ultimoAcesso: '2026-05-02 14:30', bloqueadoEm: '2026-05-02 14:35' },
      { id: 3, nome: 'Mecânica Boa',    email: 'mecanicaboa@gmail.com', cnpj: '11.222.333/0001-44', tentativas: 1, bloqueado: false, ultimoAcesso: '2026-05-03 09:00', bloqueadoEm: null }
=======
  // TODO: Verificar se e necessario manter essa seed
  _seed() {
    if (localStorage.getItem(this.KEYS.usuarios)) return;
    const demo = [
      { id: 1, nome: 'Oficina Silva',   email: 'silva@oficina.com',     cnpj: '12.345.678/0001-90', endereco: 'Rua das Flores, 100 – São Paulo/SP',  criadoEm: '2026-05-01 08:12', pendente: true, recusado: false },
      { id: 2, nome: 'Auto Peças Ltda', email: 'contato@autopecas.com', cnpj: '98.765.432/0001-11', endereco: 'Av. Brasil, 500 – Campinas/SP',         criadoEm: '2026-05-02 14:30', pendente: true, recusado: false },
      { id: 3, nome: 'Mecânica Boa',    email: 'mecanicaboa@gmail.com', cnpj: '11.222.333/0001-44', endereco: 'Rua Sete, 22 – Belo Horizonte/MG',      criadoEm: '2026-05-03 09:00', pendente: false, recusado: false }
>>>>>>> origin/dev
    ];
    localStorage.setItem(this.KEYS.usuarios, JSON.stringify(demo));
    localStorage.setItem(this.KEYS.historico, JSON.stringify([]));
  },

  getUsuarios() {
    this._seed();
    return JSON.parse(localStorage.getItem(this.KEYS.usuarios)) || [];
  },

<<<<<<< HEAD
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
=======
  async getPendentes() {
    try {
      // Adicionando a URL completa do servidor Spring
      const response = await fetch('http://localhost:8080/admin/usuarios/pendentes');

      if (!response.ok) throw new Error('Erro ao buscar pendentes');

      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  async getRecusados() {
    try {
      const response = await fetch('http://localhost:8080/admin/usuarios/reprovados');

      if (!response.ok) throw new Error('Erro ao buscar usuários recusados');

      return await response.json();
    } catch (error) {
      console.error("Erro no Model (getRecusados):", error);
      return [];
    }
  },

  async getAtivos() {
    try {
      const response = await fetch('http://localhost:8080/admin/usuarios/ativos');

      if (!response.ok) throw new Error('Erro ao buscar usuários recusados');

      return await response.json();
    } catch (error) {
      console.error("Erro no Model (getRecusados):", error);
      return [];
    }
>>>>>>> origin/dev
  },

  liberarAcesso(id) {
    const lista = this.getUsuarios().map(u =>
<<<<<<< HEAD
      u.id === id ? { ...u, bloqueado: false, tentativas: 0, bloqueadoEm: null } : u
    );
    localStorage.setItem(this.KEYS.usuarios, JSON.stringify(lista));
    this._registrarHistorico(id, 'Acesso liberado');
  },

  resetarSenha(id) {
    this._registrarHistorico(id, 'Senha redefinida');
=======
      u.id === id ? { ...u, pendente: false, recusado: false } : u
    );
    localStorage.setItem(this.KEYS.usuarios, JSON.stringify(lista));
    this._registrarHistorico(id, 'Cadastro liberado');
  },

  recusarCadastro(id, motivo) {
    const lista = this.getUsuarios().map(u =>
      u.id === id ? { ...u, pendente: false, recusado: true, motivoRecusa: motivo } : u
    );
    localStorage.setItem(this.KEYS.usuarios, JSON.stringify(lista));
    this._registrarHistorico(id, `Cadastro recusado: ${motivo || 'sem motivo'}`);
>>>>>>> origin/dev
  },

  _registrarHistorico(userId, acao) {
    const usuario  = this.getUsuarios().find(u => u.id === userId);
    const historico = this.getHistorico();
    historico.unshift({
<<<<<<< HEAD
      id:          Date.now(),
      usuario:     usuario?.nome || '—',
      email:       usuario?.email || '—',
      acao,
      realizadoPor: 'Admin',
      dataHora:    new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem(this.KEYS.historico, JSON.stringify(historico));

    // Registra na auditoria global
=======
      id:           Date.now(),
      usuario:      usuario?.nome || '—',
      email:        usuario?.email || '—',
      acao,
      realizadoPor: 'Admin',
      dataHora:     new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem(this.KEYS.historico, JSON.stringify(historico));
>>>>>>> origin/dev
    AuditoriaModel?.registrar('ACESSO_LIBERADO', usuario?.email || '—', acao);
  },

  getHistorico() {
    return JSON.parse(localStorage.getItem(this.KEYS.historico)) || [];
  }
};
