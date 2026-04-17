// ── CADASTRO CONTROLLER ───────────────────────────────────────────────────────
// Orquestra o formulário de criação de conta
// ─────────────────────────────────────────────────────────────────────────────

const CadastroController = {

  _campos: [
    'cnpj', 'razao', 'nome-oficina',
    'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado',
    'responsavel', 'telefone', 'email', 'senha', 'confirma-senha'
  ],

  init() {
    Modal.init();
  },

  toggleSenha(id, btn) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
      input.type = 'text';
      btn.textContent = '🙈';
    } else {
      input.type = 'password';
      btn.textContent = '👁';
    }
  },

  enviarCadastro(e) {
    e.preventDefault();
    const errorEl = document.getElementById('cad-error');
    const btn     = document.getElementById('btn-criar');

    this._campos.forEach(id => document.getElementById(id)?.classList.remove('error'));
    errorEl.style.display = 'none';

    let valido = true;
    this._campos.forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) { el.classList.add('error'); valido = false; }
    });

    if (!valido) {
      errorEl.textContent = 'Preencha todos os campos obrigatórios.';
      errorEl.style.display = 'block';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const senha    = document.getElementById('senha').value;
    const confirma = document.getElementById('confirma-senha').value;

    if (senha.length < 8) {
      document.getElementById('senha').classList.add('error');
      errorEl.textContent = 'A senha deve ter no mínimo 8 caracteres.';
      errorEl.style.display = 'block';
      return;
    }

    if (senha !== confirma) {
      document.getElementById('confirma-senha').classList.add('error');
      errorEl.textContent = 'As senhas não coincidem.';
      errorEl.style.display = 'block';
      return;
    }

    if (!document.getElementById('termos').checked) {
      errorEl.textContent = 'Você precisa aceitar os Termos de Uso e a Política de Privacidade.';
      errorEl.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.textContent = '⏳ Criando conta...';

    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = 'Criar minha conta →';
      Modal.abrir();
    }, 1400);
  }
};

// Aliases globais para chamadas inline nos HTML
function enviarCadastro(e)         { CadastroController.enviarCadastro(e); }
function toggleSenha(id, btn)      { CadastroController.toggleSenha(id, btn); }

CadastroController.init();
