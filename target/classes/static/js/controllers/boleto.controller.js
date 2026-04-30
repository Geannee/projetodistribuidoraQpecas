// ── BOLETO CONTROLLER ─────────────────────────────────────────────────────────
// Orquestra emissão de boleto: renderização, validação e modal
// ─────────────────────────────────────────────────────────────────────────────

const BoletoController = {

  init() {
    Auth.check();
    SharedView.preencherUsuario();
    this.setDataPadrao();
    BoletoView.renderBoletosAbertos(
      document.getElementById('boletos-list'),
      BoletoModel.boletosAbertos
    );
    BoletoView.renderHistorico(
      document.getElementById('historico-tbody'),
      BoletoModel.historico
    );
    Modal.init();
  },

  setDataPadrao() {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const el = document.getElementById('vencimento');
    if (el) el.value = d.toISOString().split('T')[0];
  },

  gerarBoleto(e) {
    e.preventDefault();
    const numPedido  = document.getElementById('num-pedido');
    const valor      = document.getElementById('valor');
    const descricao  = document.getElementById('descricao');
    const vencimento = document.getElementById('vencimento');
    const errorEl    = document.getElementById('boleto-error');
    const btnGerar   = document.getElementById('btn-gerar');

    [numPedido, valor, descricao, vencimento].forEach(f => f.classList.remove('error'));
    errorEl.style.display = 'none';

    let valido = true;
    if (!numPedido.value.trim())  { numPedido.classList.add('error');  valido = false; }
    if (!valor.value.trim())      { valor.classList.add('error');      valido = false; }
    if (!descricao.value.trim())  { descricao.classList.add('error');  valido = false; }
    if (!vencimento.value)        { vencimento.classList.add('error'); valido = false; }

    if (!valido) {
      errorEl.textContent = 'Preencha todos os campos obrigatórios.';
      errorEl.style.display = 'block';
      return;
    }

    btnGerar.disabled = true;
    btnGerar.innerHTML = '<span>⏳</span> Gerando...';

    setTimeout(() => {
      btnGerar.disabled = false;
      btnGerar.innerHTML = '<span>🧾</span> Gerar Boleto';

      const codigo    = this._gerarCodigoBarras();
      const numBoleto = '#BOL-' + numPedido.value.trim().replace(/\D/g, '').padStart(4, '0');

      BoletoView.mostrarModal(numBoleto, valor.value, codigo);
      this.limparForm();
    }, 1200);
  },

  _gerarCodigoBarras() {
    const bloco = () => Math.random().toString().slice(2, 10);
    return `${bloco().slice(0,4)}.${bloco().slice(0,5)} ${bloco().slice(0,5)}.${bloco().slice(0,6)} ${bloco().slice(0,5)}.${bloco().slice(0,6)} 1 ${bloco()}`;
  },

  limparForm() {
    document.getElementById('form-boleto').reset();
    document.querySelectorAll('.field-input').forEach(f => f.classList.remove('error'));
    document.getElementById('boleto-error').style.display = 'none';
    this.setDataPadrao();
  },

  copiarCodigo() {
    const codigo = document.getElementById('modal-codigo').textContent;
    navigator.clipboard.writeText(codigo).then(() => {
      const btn = document.querySelector('.btn-copiar');
      btn.textContent = '✓ Copiado!';
      setTimeout(() => { btn.textContent = 'Copiar código'; }, 2000);
    });
  },

  imprimirBoleto() {
    window.print();
  },

  baixarBoleto(num) {
    alert(`Baixando boleto ${num}...\n\nEm produção: integrar com API bancária.`);
  }
};

// Aliases globais para chamadas inline nos HTML
function gerarBoleto(e)      { BoletoController.gerarBoleto(e); }
function copiarCodigo()      { BoletoController.copiarCodigo(); }
function imprimirBoleto()    { BoletoController.imprimirBoleto(); }
function baixarBoleto(num)   { BoletoController.baixarBoleto(num); }

BoletoController.init();
