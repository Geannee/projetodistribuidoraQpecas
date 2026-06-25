// ── DASHBOARD CONTROLLER ──────────────────────────────────────────────────────
const DashboardController = {

  init() {
    // 1º Bloqueia o acesso se o usuário não estiver logado de verdade
    if (!this.verificarSessao()) {
      window.location.href = 'login.html';
      return; // Para a execução aqui
    }

    // 2º Se passou na verificação, renderiza os dados reais do usuário
    if (typeof SharedView !== 'undefined' && SharedView.preencherUsuario) {
      SharedView.preencherUsuario();
    }
    this.renderSaudacao();
    this.renderTabela();
  },

  verificarSessao() {
    if (!Auth.check()) return false;
    const usuario    = Auth.getUsuario();
    const perfil     = Auth.getPerfil();
    const navActions = document.getElementById('nav-actions');

    if (navActions) {
      HomeView.renderNavLogado(navActions, usuario, perfil);
    }
    return true;
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