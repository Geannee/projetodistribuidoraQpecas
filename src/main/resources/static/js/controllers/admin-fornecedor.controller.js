// ── ADMIN FORNECEDOR CONTROLLER ─────────────────────────────────────────────
// Orquestra o formulário de cadastro de fornecedor, validação de CNPJ
// via BrasilAPI e preenchimento automático de endereço via ViaCEP.
// ─────────────────────────────────────────────────────────────────────────────

const AdminFornecedorController = {

  _camposObrigatorios: [
    'f-razao-social', 'f-cnpj', 'f-cnae-principal', 'f-porte',
    'f-cep', 'f-logradouro', 'f-numero', 'f-bairro', 'f-cidade', 'f-uf',
    'f-telefone-comercial', 'f-email-comercial', 'f-representante'
  ],

  init() {
    this._bindForm();
    this._bindMasks();
    this._bindClearErrors();
    AdminFornecedorView.renderFornecedores(AdminFornecedorModel.getFornecedores());
  },

  // ── BIND ───────────────────────────────────────────────────────────────────

  _bindForm() {
    document.getElementById('form-fornecedor')
      ?.addEventListener('submit', e => { e.preventDefault(); this.submeter(); });

    document.getElementById('btn-validar-cnpj')
      ?.addEventListener('click', () => this.validarCNPJ());

    document.getElementById('btn-buscar-cep')
      ?.addEventListener('click', () => this.buscarCEP());

    document.getElementById('f-cnpj')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); this.validarCNPJ(); }
    });

    document.getElementById('f-cep')?.addEventListener('blur', () => this.buscarCEP());
  },

  _bindMasks() {
    document.getElementById('f-cnpj')
      ?.addEventListener('input', function() { Masks.cnpj(this); });
    document.getElementById('f-cep')
      ?.addEventListener('input', function() { Masks.cep(this); });
    document.getElementById('f-telefone-comercial')
      ?.addEventListener('input', function() { Masks.telefone(this); });
    document.getElementById('f-celular')
      ?.addEventListener('input', function() { Masks.telefone(this); });
  },

  _bindClearErrors() {
    this._camposObrigatorios.forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        document.getElementById(id)?.classList.remove('error');
      });
    });
  },

  // ── VALIDAÇÃO DE CNPJ (BrasilAPI) ─────────────────────────────────────────

  async validarCNPJ() {
    const input = document.getElementById('f-cnpj');
    const cnpj  = input?.value.replace(/\D/g, '');

    if (!cnpj || cnpj.length !== 14) {
      AdminFornecedorView.showToast('Informe um CNPJ com 14 dígitos.', 'error');
      input?.classList.add('error');
      return;
    }

    AdminFornecedorView.setLoadingCNPJ(true);
    try {
      const res   = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cnpj}`);
      if (!res.ok) throw new Error('não encontrado');
      const dados = await res.json();
      AdminFornecedorView.preencherCNPJ(dados);
      AdminFornecedorView.showToast('CNPJ validado com sucesso!', 'success');
      input?.classList.remove('error');
    } catch {
      AdminFornecedorView.mostrarErroCNPJ();
      AdminFornecedorView.showToast('CNPJ não encontrado na Receita Federal.', 'error');
      input?.classList.add('error');
    } finally {
      AdminFornecedorView.setLoadingCNPJ(false);
    }
  },

  // ── BUSCA DE CEP (ViaCEP) ─────────────────────────────────────────────────

  async buscarCEP() {
    const input = document.getElementById('f-cep');
    const cep   = input?.value.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    AdminFornecedorView.setLoadingCEP(true);
    try {
      const res   = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const dados = await res.json();
      if (dados.erro) throw new Error('CEP inválido');
      AdminFornecedorView.preencherCEP(dados);
      input?.classList.remove('error');
    } catch {
      AdminFornecedorView.showToast('CEP não encontrado.', 'error');
      input?.classList.add('error');
    } finally {
      AdminFornecedorView.setLoadingCEP(false);
    }
  },

  // ── SUBMISSÃO ──────────────────────────────────────────────────────────────

  submeter() {
    const get = id => document.getElementById(id)?.value.trim() || '';

    const campos = {
      razaoSocial:       get('f-razao-social'),
      nomeFantasia:      get('f-nome-fantasia'),
      cnpj:              get('f-cnpj'),
      inscricaoEstadual: get('f-inscricao-estadual'),
      inscricaoMunicipal:get('f-inscricao-municipal'),
      cnaePrincipal:     get('f-cnae-principal'),
      cnaeSecundarios:   get('f-cnae-secundarios'),
      porte:             get('f-porte'),
      cep:               get('f-cep'),
      logradouro:        get('f-logradouro'),
      numero:            get('f-numero'),
      complemento:       get('f-complemento'),
      bairro:            get('f-bairro'),
      cidade:            get('f-cidade'),
      uf:                get('f-uf'),
      telefoneComercial: get('f-telefone-comercial'),
      celular:           get('f-celular'),
      emailComercial:    get('f-email-comercial'),
      emailFinanceiro:   get('f-email-financeiro'),
      site:              get('f-site'),
      redesSociais:      get('f-redes-sociais'),
      representante:     get('f-representante')
    };

    const erros = this._validar(campos);
    if (erros.length) {
      erros.forEach(id => AdminFornecedorView.marcarErro(id));
      AdminFornecedorView.showToast('Preencha todos os campos obrigatórios.', 'error');
      document.getElementById(erros[0])?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (AdminFornecedorModel.cnpjExiste(campos.cnpj)) {
      AdminFornecedorView.marcarErro('f-cnpj');
      AdminFornecedorView.showToast('Este CNPJ já está cadastrado.', 'error');
      return;
    }

    AdminFornecedorModel.salvarFornecedor(campos);
    AdminFornecedorView.showToast('Fornecedor cadastrado com sucesso!', 'success');
    this.limpar();
    AdminFornecedorView.renderFornecedores(AdminFornecedorModel.getFornecedores());
  },

  _validar(c) {
    const erros   = [];
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!c.razaoSocial)                                       erros.push('f-razao-social');
    if (!c.cnpj || c.cnpj.replace(/\D/g, '').length !== 14) erros.push('f-cnpj');
    if (!c.cnaePrincipal)                                     erros.push('f-cnae-principal');
    if (!c.porte)                                             erros.push('f-porte');
    if (!c.cep  || c.cep.replace(/\D/g, '').length !== 8)   erros.push('f-cep');
    if (!c.logradouro)                                        erros.push('f-logradouro');
    if (!c.numero)                                            erros.push('f-numero');
    if (!c.bairro)                                            erros.push('f-bairro');
    if (!c.cidade)                                            erros.push('f-cidade');
    if (!c.uf)                                                erros.push('f-uf');
    if (!c.telefoneComercial)                                 erros.push('f-telefone-comercial');
    if (!c.emailComercial || !emailRe.test(c.emailComercial)) erros.push('f-email-comercial');
    if (!c.representante)                                     erros.push('f-representante');

    return erros;
  },

  // ── LIMPAR ─────────────────────────────────────────────────────────────────

  limpar() {
    const ids = [
      'f-razao-social', 'f-nome-fantasia', 'f-cnpj', 'f-inscricao-estadual',
      'f-inscricao-municipal', 'f-cnae-principal', 'f-cnae-secundarios', 'f-porte',
      'f-cep', 'f-logradouro', 'f-numero', 'f-complemento', 'f-bairro',
      'f-cidade', 'f-uf', 'f-telefone-comercial', 'f-celular',
      'f-email-comercial', 'f-email-financeiro', 'f-site',
      'f-redes-sociais', 'f-representante'
    ];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error'); }
    });
    AdminFornecedorView.ocultarBadgeCNPJ();
  },

  // ── EXCLUIR ────────────────────────────────────────────────────────────────

  excluirFornecedor(id) {
    if (!confirm('Deseja excluir este fornecedor?')) return;
    AdminFornecedorModel.excluirFornecedor(id);
    AdminFornecedorView.renderFornecedores(AdminFornecedorModel.getFornecedores());
    AdminFornecedorView.showToast('Fornecedor excluído.', 'success');
  }
};

AdminFornecedorController.init();
