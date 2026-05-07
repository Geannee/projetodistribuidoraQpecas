// ── ADMIN ACESSO CONTROLLER ────────────────────────────────────────────────────

const AcessoController = {

  init() {
    this._render();
  },

  _render() {
    const pendentes = AcessoModel.getPendentes();
    const recusados = AcessoModel.getRecusados();
    const historico = AcessoModel.getHistorico();
    const liberados = historico.filter(h => h.acao === 'Cadastro liberado').length;

    AcessoView.renderStats(pendentes.length, recusados.length, liberados);
    AcessoView.renderBloqueados(pendentes);
    AcessoView.renderHistorico(historico);
  },

  liberar(id) {
    if (!confirm('Liberar o cadastro deste usuário?')) return;
    AcessoModel.liberarAcesso(id);
    AcessoView.showToast('Cadastro liberado com sucesso!', 'success');
    this._render();
  },

  mostrarCampoRecusa(id) {
    const inline = document.getElementById(`recusa-inline-${id}`);
    if (inline) inline.style.display = 'block';
  },

  cancelarRecusa(id) {
    const inline = document.getElementById(`recusa-inline-${id}`);
    if (inline) inline.style.display = 'none';
    const input = document.getElementById(`motivo-${id}`);
    if (input) input.value = '';
  },

  confirmarRecusa(id) {
    const input = document.getElementById(`motivo-${id}`);
    const motivo = input?.value.trim();
    if (!motivo) {
      AcessoView.showToast('Informe o motivo da recusa.', 'error');
      input?.focus();
      return;
    }
    if (!confirm(`Recusar este cadastro?\nMotivo: ${motivo}`)) return;
    AcessoModel.recusarCadastro(id, motivo);
    AcessoView.showToast('Cadastro recusado.', 'error');
    this._render();
  }
};

AcessoController.init();
