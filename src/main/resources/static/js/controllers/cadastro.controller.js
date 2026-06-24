// ── CADASTRO CONTROLLER ───────────────────────────────────────────────────────
// Orquestra o formulário de criação de conta
// ─────────────────────────────────────────────────────────────────────────────

const CadastroController = {

  _campos: [
    'cnpj', 'razao', 'nome-fantasia',
    'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado',
    'responsavel', 'telefone', 'email', 'senha', 'confirma-senha'
  ],

  _lastCep: '',

  init() {
    Modal.init();
    const cepInput = document.getElementById('cep');
    if (cepInput) {
      cepInput.addEventListener('input', () => this.handleCepInput(cepInput));
      cepInput.addEventListener('blur', () => this.handleCepBlur(cepInput));
    }
  },

  handleCepInput(input) {
    const cepVal = input.value.replace(/\D/g, '');
    if (cepVal.length === 8) {
      if (cepVal === this._lastCep) return;
      this._lastCep = cepVal;
      this.buscarCEP(cepVal);
    } else {
      this.limparErroCep();
    }
  },

  handleCepBlur(input) {
    const cepVal = input.value.replace(/\D/g, '');
    if (cepVal.length === 8) {
      if (cepVal === this._lastCep) return;
      this._lastCep = cepVal;
      this.buscarCEP(cepVal);
    } else if (cepVal.length > 0 && cepVal.length < 8) {
      this.exibirErroCep('CEP inválido. Deve conter 8 dígitos.');
    }
  },

  async buscarCEP(cep) {
    this.exibirCarregamentoCep();
    const camposEnd = ['logradouro', 'bairro', 'cidade', 'estado'];
    
    // Disable inputs while loading
    camposEnd.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.disabled = true;
    });

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      if (!response.ok) {
        throw new Error();
      }
      const data = await response.json();
      if (data.erro === true || data.erro === 'true') {
        this.exibirErroCep('CEP não encontrado.');
        camposEnd.forEach(id => {
          const el = document.getElementById(id);
          if (el) {
            el.disabled = false;
            if (id !== 'estado') {
              el.value = '';
            } else {
              el.value = '';
            }
          }
        });
        return;
      }

      this.limparErroCep();

      const logradouroEl = document.getElementById('logradouro');
      const bairroEl     = document.getElementById('bairro');
      const cidadeEl     = document.getElementById('cidade');
      const estadoEl     = document.getElementById('estado');

      if (logradouroEl) logradouroEl.value = data.logradouro || '';
      if (bairroEl)     bairroEl.value = data.bairro || '';
      if (cidadeEl)     cidadeEl.value = data.localidade || '';
      if (estadoEl)     estadoEl.value = (data.uf || '').toUpperCase();

      // Enable fields so the user can edit/review
      camposEnd.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = false;
      });

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      this.exibirErroCep('Erro ao buscar CEP. Verifique a conexão ou preencha manualmente.');
      camposEnd.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = false;
      });
    }
  },

  exibirErroCep(mensagem) {
    const statusEl = document.getElementById('cep-status');
    const cepInput = document.getElementById('cep');
    if (statusEl) {
      statusEl.textContent = mensaje || mensagem; // matching the parameter or variable
      statusEl.style.color = '#dc2626'; // red-600
      statusEl.style.display = 'block';
    }
    if (cepInput) {
      cepInput.classList.add('error');
    }
  },

  limparErroCep() {
    const statusEl = document.getElementById('cep-status');
    const cepInput = document.getElementById('cep');
    if (statusEl) {
      statusEl.textContent = '';
      statusEl.style.display = 'none';
    }
    if (cepInput) {
      cepInput.classList.remove('error');
    }
  },

  exibirCarregamentoCep() {
    const statusEl = document.getElementById('cep-status');
    const cepInput = document.getElementById('cep');
    if (statusEl) {
      statusEl.textContent = 'Buscando CEP...';
      statusEl.style.color = '#2563eb'; // blue-600
      statusEl.style.display = 'block';
    }
    if (cepInput) {
      cepInput.classList.remove('error');
    }
  },

  toggleSenha(id, btn) {
    const input = document.getElementById(id);
    if (input.type === 'password') {
      input.type = 'text';
      btn.innerHTML = ICONS.eyeOff;
    } else {
      input.type = 'password';
      btn.innerHTML = ICONS.eye;
    }
  },

  async enviarCadastro(e) {
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
    btn.textContent = 'Criando conta...';

    const payload = {
      cnpj: document.getElementById('cnpj').value.trim(), // ← corrigido: era 'ccnpj'
      razaoSocial: document.getElementById('razao').value.trim(),
      nomeFantasia: document.getElementById('nome-fantasia').value.trim(),
      representanteLegal: document.getElementById('responsavel').value.trim(),
      senha: senha,
      email: document.getElementById('email').value.trim(),

      endereco: {
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        logradouro: document.getElementById('logradouro').value.trim(),
        numero: parseInt(document.getElementById('numero').value.replace(/\D/g, ''), 10),
        bairro: document.getElementById('bairro').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value.trim()
      },

      telefone: [
        {
          telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
          tipo: 'CELULAR'
        }
      ]
    };

    try {
      const response = await fetch('http://localhost:8080/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const text = await response.text(); // ← lê o body UMA só vez
        console.error('Erro do servidor:', text);
        let message = text;
        try {
          const json = JSON.parse(text);
          message = json.message || JSON.stringify(json);
        } catch {}
        throw new Error(message);
      }

      btn.textContent = 'Conta criada com sucesso!';
      Modal.abrir();

    } catch (error) {
      console.error('Erro no Fetch:', error);
      errorEl.textContent = error.message;
      errorEl.style.display = 'block';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      btn.textContent = 'Criar minha conta →';
      btn.disabled = false;
    }
  }
};

function enviarCadastro(e)    { CadastroController.enviarCadastro(e); }
function toggleSenha(id, btn) { CadastroController.toggleSenha(id, btn); }

CadastroController.init();