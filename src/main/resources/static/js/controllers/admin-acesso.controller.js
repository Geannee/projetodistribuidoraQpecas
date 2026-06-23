// ── ADMIN ACESSO CONTROLLER ────────────────────────────────────────────────────

const AcessoController = {
  // Guardamos uma referência local dos pendentes para conseguir achar os dados do usuário na hora de gravar o histórico
  _cachePendentes: [],

  init() {
    if (!Auth.checkAdmin()) return;
    this._render();
  },

  async _render() {
    try {
      // 1. Buscamos os dados das fontes
      this._cachePendentes = await AcessoModel.getPendentes();
      const recusados = await AcessoModel.getRecusados();
      const liberados = await AcessoModel.getAtivos();
      const historico = AcessoModel.getHistorico(); // Lê o localStorage local

      // 2. Manda a View desenhar tudo na tela
      AcessoView.renderStats(this._cachePendentes.length, recusados.length, liberados.length);
      AcessoView.renderBloqueados(this._cachePendentes);
      AcessoView.renderHistorico(historico);
    } catch (error) {
      if (error.status === 401) { Auth.logout(); return; }
      AcessoView.showToast('Erro ao carregar dados do servidor.', 'error');
    }
  },

  async liberar(id) {
    // Localiza o usuário no cache antes que ele suma da lista de pendentes
    const usuario = this._cachePendentes.find(u => u.idUsuario === id);
    if (!confirm(`Liberar o cadastro de "${usuario?.razaoSocial || 'este usuário'}"?`)) return;

    try {
      const sucesso = await AcessoModel.aprovarUsuario(id);

      if (sucesso) {
        // Grava o log no histórico local usando os dados que capturamos do Java
        AcessoModel.registrarHistoricoLocal(usuario, 'Cadastro liberado');
        AcessoView.showToast('Cadastro liberado com sucesso!', 'success');
        this._render(); // Recarrega a tela (o usuário vai sumir de pendentes e o histórico vai atualizar)
      } else {
        AcessoView.showToast('Erro ao liberar no servidor.', 'error');
      }
    } catch (error) {
      if (error.status === 401) { Auth.logout(); return; }
      AcessoView.showToast('Erro de conexão com o servidor.', 'error');
    }
  },

  mostrarCampoRecusa(id) {
    AcessoView.exibirPainelRecusa(id);
  },

  cancelarRecusa(id) {
    AcessoView.ocultarPainelRecusa(id);
  },

  async confirmarRecusa(id) {
    const motivo = AcessoView.getMotivoRecusa(id);
    const usuario = this._cachePendentes.find(u => u.idUsuario === id);

    if (!motivo) {
      AcessoView.showToast('Informe o motivo da recusa.', 'error');
      AcessoView.focarMotivoRecusa(id);
      return;
    }

    if (!confirm(`Recusar o cadastro de "${usuario?.razaoSocial || 'este usuário'}"?\nMotivo: ${motivo}`)) return;

    try {
      const sucesso = await AcessoModel.reprovarUsuario(id, motivo);

      if (sucesso) {
        // Grava o log salvando também o motivo na string da ação
        AcessoModel.registrarHistoricoLocal(usuario, `Cadastro recusado: ${motivo}`);
        AcessoView.showToast('Cadastro recusado.', 'error');
        this._render(); // Atualiza a tela
      } else {
        AcessoView.showToast('Erro ao recusar no servidor.', 'error');
      }
    } catch (error) {
      if (error.status === 401) { Auth.logout(); return; }
      AcessoView.showToast('Erro de conexão.', 'error');
    }
  }
};

AcessoController.init();