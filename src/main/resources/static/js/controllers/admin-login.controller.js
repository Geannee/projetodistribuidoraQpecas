// ── ADMIN LOGIN CONTROLLER ────────────────────────────────────────────────────

const AdminLoginController = {

  // ── LOGIN ──────────────────────────────────────────────────────────────────

  async handleLogin(e) {
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

    btn.disabled    = true;
    btn.textContent = 'Entrando...';

    try {
      const response = await fetch('http://localhost:8080/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          login: email.value.trim(),
          senha: senha.value.trim()
        })
      });

      if (!response.ok) {
        throw new Error('E-mail ou senha incorretos.');
      }

      const dados = await response.json();

      if (dados.tipoUsuario !== 'DISTRIBUIDOR') {
        throw new Error('Acesso negado. Apenas administradores.');
      }

      sessionStorage.setItem('qp_token', dados.token);
      sessionStorage.setItem('qp_usuario', dados.email);
      sessionStorage.setItem('qp_nome', dados.nome);
      sessionStorage.setItem('qp_perfil', dados.cnpj);
      sessionStorage.setItem('qp_tipo', dados.tipoUsuario);
      sessionStorage.setItem('qp_id', dados.id);

      window.location.href = 'admin-veiculo.html';
    } catch (error) {
      email.classList.add('error');
      senha.classList.add('error');
      this._mostrarErro('error-msg', error.message || 'Erro ao conectar com o servidor.');
      btn.disabled    = false;
      btn.textContent = 'Entrar';
    }
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
      btn.innerHTML = ICONS.eyeOff;
    } else {
      input.type = 'password';
      btn.innerHTML = ICONS.eye;
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
