// ── ADMIN ACESSO CONTROLLER ────────────────────────────────────────────────────

const AcessoController = {

  init() {
    this._render();
  },

  _render() {
    const bloqueados = AcessoModel.getBloqueados();
    const historico  = AcessoModel.getHistorico();
    const todos      = AcessoModel.getUsuarios();
    const tentativas = todos.reduce((s, u) => s + u.tentativas, 0);
    const liberados  = historico.filter(h => h.acao === 'Acesso liberado').length;

    AcessoView.renderStats(bloqueados.length, tentativas, liberados);
    AcessoView.renderBloqueados(bloqueados);
    AcessoView.renderHistorico(historico);
  },

  buscar() {
    const termo = document.getElementById('busca-usuario')?.value.trim();
    if (!termo) return;
    const usuario = AcessoModel.buscar(termo);
    AcessoView.renderResultadoBusca(usuario);
  },

  liberar(id) {
    if (!confirm('Liberar o acesso deste usuário?')) return;
    AcessoModel.liberarAcesso(id);
    AcessoView.showToast('Acesso liberado com sucesso!', 'success');
    document.getElementById('resultado-busca').innerHTML = '';
    this._render();
  },

  resetar(id) {
    if (!confirm('Redefinir a senha deste usuário? Uma senha temporária será gerada.')) return;
    AcessoModel.resetarSenha(id);
    AcessoView.showToast('Senha redefinida! O usuário receberá as novas credenciais.', 'success');
    this._render();
  }
};

AcessoController.init();
