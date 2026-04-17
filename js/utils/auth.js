// ── AUTH UTILS ────────────────────────────────────────────────────────────────
// Gerencia sessão do usuário via sessionStorage
// ─────────────────────────────────────────────────────────────────────────────

const Auth = {

  getUsuario() {
    return sessionStorage.getItem('qp_usuario');
  },

  getPerfil() {
    return sessionStorage.getItem('qp_perfil');
  },

  /** Redireciona para login se não houver sessão */
  check() {
    if (!this.getUsuario()) {
      window.location.href = 'login.html';
    }
  },

  /** Encerra a sessão e redireciona para login */
  logout(e) {
    if (e) e.preventDefault();
    sessionStorage.removeItem('qp_usuario');
    sessionStorage.removeItem('qp_perfil');
    window.location.href = 'login.html';
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
