// ── ADMIN LOGIN CONTROLLER ────────────────────────────────────────────────────

const AdminLoginController = {
  selectProfile(card) {
    document.querySelectorAll('.profile-card').forEach(c => c.classList.remove('active'));
    card.classList.add('active')
  },

  togglePassword() {
    const input = document.getElementById('senha');
    const btn = document.querySelector('.btn-toggle-pw');
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = ICONS.eyeOff;
    } else {
      input.type = 'password';
      btn.innerHTML = ICONS.eye;
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

  async handleLogin(e) {
    e.preventDefault();
    const loginInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const btnEntrar = document.querySelector('.btn-entrar');

    this.clearErrors();

    if (!loginInput.value.trim() || !senhaInput.value.trim()) {
      this.showError('Preencha todos os campos para continuar.');
      return;
    }

    btnEntrar.disable = true;
    btnEntrar.textContent = 'Entrando...';

    try {
      const response = await fetch('http://localhost:8080/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: loginInput.value.trim(),
          senha: senhaInput.value.trim()
        })
      })

      if (!response.ok) {
        throw new Error('Login ou Senha incorretos.');
      }

      const dados = await response.json();

      sessionStorage.setItem('qp_token', dados.token);
      sessionStorage.setItem('qp_usuario', dados.email);
      sessionStorage.setItem('qp_nome', dados.nome);
      sessionStorage.setItem('qp_perfil', dados.cnpj);
      sessionStorage.setItem('qp_id', dados.id);
      sessionStorage.setItem(`qp_tipo`, dados.tipoUsuario);

      window.location.href = 'admin-veiculo.html'
    } catch (error) {
      this.showError(error.message || 'Erro ao conectar com o servidor.');
      btnEntrar.disable = false;
      btnEntrar.textContent = 'Entrar';
    }
  },

  handleReset(e) {
    e.preventDefault();
    const email = document.getElementById('reset-email');
    const btn = document.getElementById('btn-reset');
    const errEl = document.getElementById('reset-error');
    const okEl = document.getElementById('reset-success');

    email.classList.remove('error');
    errEl.style.display = 'none';
    okEl.style.display = 'none';

    if (!email.value.trim()) {
      email.classList.add('error');
      errEl.textContent = 'Informe o e-mail da conta.';
      errEl.style.display = 'block';
      return;
    }

    btn.disable = true;
    btn.textContent = 'Enviando...';

    setTimeout(() => {
      okEl.style.display = 'block';
      email.value = '';
      btn.disable = false;
      btn.textContent = 'Enviar link de redefinição →';
    }, 1200);
  },

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
    document.getElementById('email').focus();
  },

  init() {
    document.getElementById('email').addEventListener('input', () => this.clearErrors());
    document.getElementById('senha').addEventListener('input', () => this.clearErrors());
    document.getElementById('reset-email')?.addEventListener('input', () => {
      document.getElementById('reset-email').classList.remove('error');
      document.getElementById('reset-error').style.display = 'none';
    });
  }
};


function selectProfile(card) {
  AdminLoginController.selectProfile(card);
}

function togglePassword() {
  AdminLoginController.togglePassword();
}

function handleLogin(e) {
  AdminLoginController.handleLogin(e);
}

function handleReset(e) {
  AdminLoginController.handleReset(e);
}

function mostrarReset(e) {
  AdminLoginController.mostrarReset(e);
}

function mostrarLogin(e) {
  AdminLoginController.mostrarLogin(e);
}

AdminLoginController.init();