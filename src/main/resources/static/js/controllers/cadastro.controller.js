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

  // Tornamos a função async para podermos usar o await no fetch
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
    btn.textContent = '⏳ Criando conta...';

    // 1. Montar o Payload mapeado EXATAMENTE como o seu UsuarioDTO.Save espera
    const payload = {
      cnpj: document.getElementById('cnpj').value.replace(/\D/g, ''), // Remove máscara, envia só números
      razaoSocial: document.getElementById('razao').value.trim(),
      nomeFantasia: document.getElementById('nome-fantasia').value.trim(),
      representanteLegal: document.getElementById('responsavel').value.trim(),
      senha: senha,
      email: document.getElementById('email').value.trim(),

      endereco: {
        cep: document.getElementById('cep').value.replace(/\D/g, ''),
        logradouro: document.getElementById('logradouro').value.trim(),
        numero: parseInt(document.getElementById('numero').value.replace(/\D/g, ''), 10), // Converte para Integer
        bairro: document.getElementById('bairro').value.trim(),
        cidade: document.getElementById('cidade').value.trim(),
        estado: document.getElementById('estado').value.trim()
      },

      telefone: [
        {
          telefone: document.getElementById('telefone').value.replace(/\D/g, ''),
          tipo: 'CELULAR' // Deixei fixo, mas você pode pegar de um select se houver
        }
      ]
    };

    // 2. Realizar a requisição Fetch para o Backend Spring Boot
    try {
      // ATENÇÃO: Substitua a URL abaixo pela rota correta do seu Controller no Java
      const response = await fetch('http://localhost:8080/usuarios/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Se o Java retornar um erro (ex: 400 Validation Error, 500 Internal Server Error)
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
      }

      // 3. Sucesso!
      btn.textContent = 'Conta criada com sucesso!';
      Modal.abrir();

      // Opcional: Limpar o formulário após o sucesso
      // document.querySelector('form').reset();

    } catch (error) {
      // 4. Tratamento de Erros
      console.error('Erro no Fetch:', error);
      errorEl.textContent = error.message;
      errorEl.style.display = 'block';
      errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Restaura o botão para o usuário tentar novamente
      btn.textContent = 'Criar minha conta →';
      btn.disabled = false;
    }
  }
};

// Aliases globais para chamadas inline nos HTML
function enviarCadastro(e)         { CadastroController.enviarCadastro(e); }
function toggleSenha(id, btn)      { CadastroController.toggleSenha(id, btn); }

CadastroController.init();