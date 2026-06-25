// ── AUTH UTILS ────────────────────────────────────────────────────────────────
// Gerencia sessão do usuário via sessionStorage
// ─────────────────────────────────────────────────────────────────────────────

const Auth = {

  getUsuario() {
    return sessionStorage.getItem('qp_usuario');
  },

  getToken() {
    return sessionStorage.getItem('qp_token');
  },

  getPerfil() {
    return sessionStorage.getItem('qp_perfil');
  },

  getTipo() {
    return sessionStorage.getItem('qp_tipo');
  },

  /** Redireciona para login se não houver sessão */
  check() {
    if (!this.getUsuario() || !this.getToken() || this.getTipo() !== 'MECANICO') {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  /** Redireciona para login administrativo se não houver sessão admin */
  checkAdmin() {
    if (!this.getUsuario() || !this.getToken() || this.getTipo() !== 'DISTRIBUIDOR') {
      window.location.href = 'admin-login.html';
      return false;
    }

    const usuario = this.getUsuario();
    const iniciais = this.getIniciais(usuario);
    const nome = this.getNomeFormatado(usuario);

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    set('sidebar-avatar', iniciais);
    set('topbar-avatar',  iniciais);
    set('sidebar-nome',   nome);
    return true;
  },

  /** Encerra a sessão e redireciona para a raiz */
  logout(e) {
    if (e) e.preventDefault();
    sessionStorage.removeItem('qp_usuario');
    sessionStorage.removeItem('qp_token');
    sessionStorage.removeItem('qp_perfil');
    sessionStorage.removeItem('qp_tipo');
    sessionStorage.removeItem('qp_nome');
    sessionStorage.removeItem('qp_id');
    window.location.href = '/';
  },

  /** Retorna as 2 iniciais do usuário */
  getIniciais(nome) {
    return nome.includes('@')
      ? nome.split('@')[0].slice(0, 2).toUpperCase()
      : nome.slice(0, 2).toUpperCase();
  },

  /** Retorna nome amigável (sem domínio de e-mail, capitalizado) */
  getNomeFormatado(nome) {
    const n = nome.includes('@') ? nome.split('@')[0] : nome;
    return n.charAt(0).toUpperCase() + n.slice(1);
  }
};

// Alias global para chamadas inline nos HTML
function logout(e) { Auth.logout(e); }
