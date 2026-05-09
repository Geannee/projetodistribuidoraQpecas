// ── LOGIN CONTROLLER ──────────────────────────────────────────────────────────
// Lógica de autenticação e seleção de perfil
// ─────────────────────────────────────────────────────────────────────────────

const LoginController = {

  selectProfile(card) {
    document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active');
  },

  togglePassword() {
    const input = document.getElementById('senha');
    const btn   = document.querySelector('.btn-toggle-pw');
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  },

  showError(msg) {
    const el = document.getElementById('error-msg');
    el.textContent = msg;
    el.style.display = 'block';
  },

  clearErrors() {
    document.getElementById('email').classList.remove('error');
    document.getElementById('senha').classList.remove('error');
    document.getElementById('error-msg').style.display = 'none';
  },

  handleLogin(e) {
    e.preventDefault();
    const email    = document.getElementById('email');
    const senha    = document.getElementById('senha');
    const btnEntrar = document.querySelector('.btn-entrar');

    this.clearErrors();

    let valido = true;
    if (!email.value.trim()) { email.classList.add('error'); valido = false; }
    if (!senha.value.trim()) { senha.classList.add('error'); valido = false; }

    if (!valido) {
      this.showError('Preencha todos os campos para continuar.');
      return;
    }

    btnEntrar.disabled = true;
    btnEntrar.textContent = 'Entrando...';

    setTimeout(() => {
      const perfil = document.querySelector('.profile-card.active .profile-name').textContent;
      sessionStorage.setItem('qp_usuario', email.value.trim());
      sessionStorage.setItem('qp_perfil', perfil);
      window.location.href = 'dashboard.html';
    }, 1500);
  },

  init() {
    document.getElementById('email').addEventListener('input', () => this.clearErrors());
    document.getElementById('senha').addEventListener('input', () => this.clearErrors());
  }
};

// Aliases globais para chamadas inline nos HTML
function selectProfile(card)  { LoginController.selectProfile(card); }
function togglePassword()     { LoginController.togglePassword(); }
function handleLogin(e)       { LoginController.handleLogin(e); }

LoginController.init();
