// ── ADMIN FORNECEDOR MODEL ──────────────────────────────────────────────────
// Persistência em localStorage dos dados de fornecedores de peças
// ─────────────────────────────────────────────────────────────────────────────

const AdminFornecedorModel = {

  _key: 'qp_fornecedores',

  getFornecedores() {
    return JSON.parse(localStorage.getItem(this._key) || '[]');
  },

  salvarFornecedor(dados) {
    const lista = this.getFornecedores();
    lista.push({ ...dados, id: Date.now() });
    localStorage.setItem(this._key, JSON.stringify(lista));
  },

  excluirFornecedor(id) {
    const lista = this.getFornecedores().filter(f => f.id !== id);
    localStorage.setItem(this._key, JSON.stringify(lista));
  },

  cnpjExiste(cnpj) {
    const raw = cnpj.replace(/\D/g, '');
    return this.getFornecedores().some(f => f.cnpj.replace(/\D/g, '') === raw);
  }
};
