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
        const btn = document.querySelector('.btn-toggle-pw');
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

        btnEntrar.disabled = true;
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
            sessionStorage.setItem('qp_usuario', dados.usuario);
            sessionStorage.setItem('qp_nome', dados.nomeFantasia);
            sessionStorage.setItem('qp_id', dados.id);

            window.location.href = 'dashboard.html';

        } catch (error) {
            this.showError(error.message || 'Erro ao conectar com o servidor.');
            btnEntrar.disabled = false;
            btnEntrar.textContent = 'Entrar';
        }
    },

    init() {
        document.getElementById('email').addEventListener('input', () => this.clearErrors());
        document.getElementById('senha').addEventListener('input', () => this.clearErrors());
    }
};

// Aliases globais para chamadas inline nos HTML
function selectProfile(card) {
    LoginController.selectProfile(card);
}

function togglePassword() {
    LoginController.togglePassword();
}

function handleLogin(e) {
    LoginController.handleLogin(e);
}

LoginController.init();
