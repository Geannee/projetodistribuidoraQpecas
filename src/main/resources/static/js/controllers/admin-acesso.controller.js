// ── ADMIN ACESSO CONTROLLER ────────────────────────────────────────────────────

const AcessoController = {

  init() {
    Auth.checkAdmin();
    this._render();
  },

   async _render() {
    const pendentes = await AcessoModel.getPendentes();
    const recusados = await AcessoModel.getRecusados();
    const liberados = await AcessoModel.getAtivos();
    const historico = AcessoModel.getHistorico();

    AcessoView.renderStats(pendentes.length, recusados.length, liberados.length);
    AcessoView.renderBloqueados(pendentes);
    AcessoView.renderHistorico(historico);
  },

  async liberar(id) {
    if (!confirm('Liberar o cadastro deste usuário?')) return;

    try {
      // Faz a chamada para o seu Back-end Java
      const response = await fetch(`http://localhost:8080/admin/usuarios/${id}/aprovar`, {
        method: 'PATCH'
      });

      if (response.ok) {
        AcessoView.showToast('Cadastro liberado com sucesso!', 'success');
        // Idealmente, o Model deveria buscar os dados atualizados do banco agora
        this._render();
      } else {
        AcessoView.showToast('Erro ao liberar no servidor.', 'error');
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
      AcessoView.showToast('Erro de conexão com o servidor.', 'error');
    }
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

  async confirmarRecusa(id) {
    const input = document.getElementById(`motivo-${id}`);
    const motivo = input?.value.trim();

    if (!motivo) {
      AcessoView.showToast('Informe o motivo da recusa.', 'error');
      input?.focus();
      return;
    }

    if (!confirm(`Recusar este cadastro?\nMotivo: ${motivo}`)) return;

    try {
      const response = await fetch(`http://localhost:8080/admin/usuarios/${id}/reprovar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'text/plain' // Como seu Java recebe @RequestBody String
        },
        body: motivo
      });

      if (response.ok) {
        AcessoView.showToast('Cadastro recusado.', 'error');
        this._render();
      } else {
        AcessoView.showToast('Erro ao recusar no servidor.', 'error');
      }
    } catch (error) {
      AcessoView.showToast('Erro de conexão.', 'error');
    }
  }
};

AcessoController.init();
