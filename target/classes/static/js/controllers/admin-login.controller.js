// ── ADMIN LOGIN CONTROLLER ─────────────────────────────────────────────────────
// Gerencia o modal de login do administrador
// ─────────────────────────────────────────────────────────────────────────────

const AdminLoginController = {

  // Credenciais do administrador
  CREDENCIAIS: {
    email: 'admin@queropeças.com.br',
    senha: 'admin123'
  },

  abrirModal() {
    document.getElementById('modal-overlay').classList.add('open');
    setTimeout(() => document.getElementById('admin-email')?.focus(), 100);
  },

  fecharModal(e) {
    if (e && e.target !== document.getElementById('modal-overlay')) return;
    document.getElementById('modal-overlay').classList.remove('open');
    this._limpar();
  },

  toggleSenha() {
    const input = document.getElementById('admin-senha');
    const btn   = document.querySelector('.btn-toggle-pw');
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  },

  handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('btn-entrar');
    btn.disabled    = true;
    btn.textContent = 'Entrando...';
    setTimeout(() => {
      sessionStorage.setItem('qp_admin', 'true');
      sessionStorage.setItem('qp_usuario', 'admin');
      window.location.href = 'admin-cadastro.html';
    }, 700);
  },

  _mostrarErro(msg) {
    const el = document.getElementById('admin-error');
    el.textContent = msg;
    el.style.display = 'block';
  },

  _limparErros() {
    document.getElementById('admin-email')?.classList.remove('error');
    document.getElementById('admin-senha')?.classList.remove('error');
    const el = document.getElementById('admin-error');
    if (el) el.style.display = 'none';
  },

  _limpar() {
    const email = document.getElementById('admin-email');
    const senha = document.getElementById('admin-senha');
    if (email) email.value = '';
    if (senha) { senha.value = ''; senha.type = 'password'; }
    const btn = document.querySelector('.btn-toggle-pw');
    if (btn) btn.textContent = '👁';
    this._limparErros();
  },

  _init() {
    // Fecha modal com Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        document.getElementById('modal-overlay').classList.remove('open');
        this._limpar();
      }
    });
  }
};

AdminLoginController._init();
