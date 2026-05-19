// ── ADMIN LOGIN CONTROLLER ────────────────────────────────────────────────────

const AdminLoginController = {

  CREDENCIAIS: {
    email: 'admin@queropecas.com',
    senha: 'queropecas'
  },

  // ── LOGIN ──────────────────────────────────────────────────────────────────

  handleLogin(e) {
    e.preventDefault();
    this._limparErros('error-msg');

    const email = document.getElementById('admin-email');
    const senha = document.getElementById('admin-senha');
    const btn   = document.getElementById('btn-entrar');

    let valido = true;
    if (!email.value.trim()) { email.classList.add('error'); valido = false; }
    if (!senha.value.trim()) { senha.classList.add('error'); valido = false; }

    if (!valido) {
      this._mostrarErro('error-msg', 'Preencha todos os campos para continuar.');
      return;
    }

    if (
      email.value.trim().toLowerCase() !== this.CREDENCIAIS.email ||
      senha.value !== this.CREDENCIAIS.senha
    ) {
      email.classList.add('error');
      senha.classList.add('error');
      this._mostrarErro('error-msg', 'E-mail ou senha incorretos. Tente novamente.');
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Entrando...';

    setTimeout(() => {
      sessionStorage.setItem('qp_admin', 'true');
      sessionStorage.setItem('qp_usuario', email.value.trim());
      window.location.href = 'admin-cadastro.html';
    }, 700);
  },

  // ── REDEFINIÇÃO DE SENHA ───────────────────────────────────────────────────

  handleReset(e) {
    e.preventDefault();
    this._limparErros('reset-error');
    document.getElementById('reset-success').style.display = 'none';

    const email = document.getElementById('reset-email');
    const btn   = document.getElementById('btn-reset');

    if (!email.value.trim()) {
      email.classList.add('error');
      this._mostrarErro('reset-error', 'Informe o e-mail do administrador.');
      return;
    }

    btn.disabled    = true;
    btn.textContent = 'Enviando...';

    setTimeout(() => {
      document.getElementById('reset-success').style.display = 'block';
      email.value     = '';
      btn.disabled    = false;
      btn.textContent = 'Enviar link de redefinição →';
    }, 1200);
  },

  // ── NAVEGAÇÃO ENTRE VIEWS ──────────────────────────────────────────────────

  mostrarReset(e) {
    e.preventDefault();
    document.getElementById('view-login').style.display = 'none';
    document.getElementById('view-reset').style.display = 'block';
    document.getElementById('reset-email').focus();
  },

  mostrarLogin(e) {
    e.preventDefault();
    document.getElementById('view-reset').style.display = 'none';
    document.getElementById('view-login').style.display = 'block';
    document.getElementById('admin-email').focus();
  },

  // ── TOGGLE SENHA ───────────────────────────────────────────────────────────

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

  // ── HELPERS ────────────────────────────────────────────────────────────────

  _mostrarErro(id, msg) {
    const el = document.getElementById(id);
    el.textContent = msg;
    el.style.display = 'block';
  },

  _limparErros(errorId) {
    document.querySelectorAll('.field-input').forEach(i => i.classList.remove('error'));
    const el = document.getElementById(errorId);
    if (el) el.style.display = 'none';
  },

  _init() {
    document.getElementById('admin-email')
      ?.addEventListener('input', () => {
        document.getElementById('admin-email').classList.remove('error');
        document.getElementById('error-msg').style.display = 'none';
      });
    document.getElementById('admin-senha')
      ?.addEventListener('input', () => {
        document.getElementById('admin-senha').classList.remove('error');
        document.getElementById('error-msg').style.display = 'none';
      });
    document.getElementById('reset-email')
      ?.addEventListener('input', () => {
        document.getElementById('reset-email').classList.remove('error');
        document.getElementById('reset-error').style.display = 'none';
      });
  }
};

AdminLoginController._init();
