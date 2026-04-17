// ── DASHBOARD CONTROLLER ──────────────────────────────────────────────────────
// Orquestra a página do dashboard: usuário, tabela de atividades
// ─────────────────────────────────────────────────────────────────────────────

const DashboardController = {

  init() {
    Auth.check();
    SharedView.preencherUsuario();
    this.renderSaudacao();
    this.renderTabela();
  },

  renderSaudacao() {
    const usuario = Auth.getUsuario() || 'Cliente';
    const nome    = Auth.getNomeFormatado(usuario);
    DashboardView.renderSaudacao('greeting-nome', nome);
  },

  renderTabela() {
    const tbody = document.getElementById('activity-tbody');
    if (tbody) DashboardView.renderTabela(tbody, DashboardModel.atividades);
  },

  verDetalhes(tipo, desc) {
    alert(`${tipo}: ${desc}\n\nDetalhes completos disponíveis em breve.`);
  }
};

// Alias global para chamadas inline nos HTML
function verDetalhes(tipo, desc) { DashboardController.verDetalhes(tipo, desc); }

DashboardController.init();
