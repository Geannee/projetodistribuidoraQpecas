// ── ADMIN FORNECEDOR CONTROLLER ────────────────────────────────────────────────

const AdminFornecedorController = {

  _toastTimer: null,

  init() {
    if (!Auth.checkAdmin()) return;
    this.renderizarTabela();
    this.registrarEventos();
  },

  registrarEventos() {
    const form = document.getElementById('form-fornecedor');
    if (form) {
      form.addEventListener('submit', (e) => this.cadastrarFornecedor(e));
    }
  },

  async renderizarTabela() {
    const fornecedores = await AdminFornecedorModel.getFornecedores();
    const tbody = document.getElementById('tbody-fornecedores');
    const countSpan = document.getElementById('count-fornecedores');

    if (!tbody) return;

    if (countSpan) {
      countSpan.textContent = `${fornecedores.length} ${fornecedores.length === 1 ? 'registro' : 'registros'}`;
    }

    if (fornecedores.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" class="empty-row">Nenhum fornecedor cadastrado.</td></tr>`;
      return;
    }

    tbody.innerHTML = fornecedores.map(f => `
      <tr>
        <td>#${f.idFabricante}</td>
        <td><strong>${f.nome}</strong></td>
        <td>${this.formatarCNPJ(f.cnpj)}</td>
      </tr>
    `).join('');
  },

  async cadastrarFornecedor(e) {
    e.preventDefault();

    const nomeInput = document.getElementById('f-nome');
    const cnpjInput = document.getElementById('f-cnpj');

    nomeInput.classList.remove('error');
    cnpjInput.classList.remove('error');

    const nome = nomeInput.value.trim();
    const cnpj = cnpjInput.value.trim();

    let valido = true;
    if (!nome) { nomeInput.classList.add('error'); valido = false; }
    if (!cnpj || cnpj.length < 14) { cnpjInput.classList.add('error'); valido = false; }

    if (!valido) {
      this.showToast('Preencha todos os campos obrigatórios corretamente.', 'error');
      return;
    }

    const btn = e.target.querySelector('button[type="submit"]');
    const btnText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Enviando...';

    try {
      await AdminFornecedorModel.salvarFornecedor({ nome, cnpj });
      this.showToast('Fornecedor cadastrado com sucesso!', 'success');
      this.limparFormulario();
      await this.renderizarTabela();
    } catch (error) {
      this.showToast('Erro ao cadastrar fornecedor: ' + error.message, 'error');
      cnpjInput.classList.add('error');
    } finally {
      btn.disabled = false;
      btn.textContent = btnText;
    }
  },

  limparFormulario() {
    const form = document.getElementById('form-fornecedor');
    if (form) form.reset();
    document.querySelectorAll('.form-input').forEach(i => i.classList.remove('error'));
  },

  formatarCNPJ(v) {
    if (!v) return '';
    v = v.replace(/\D/g, '').slice(0, 14);
    if (v.length < 14) return v;
    return v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  },

  showToast(msg, tipo = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = `toast toast-${tipo} show`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
  }
};

AdminFornecedorController.init();
