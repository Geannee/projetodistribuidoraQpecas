// ── GARANTIA CONTROLLER ───────────────────────────────────────────────────────
// Orquestra a página de solicitação de garantia
// ─────────────────────────────────────────────────────────────────────────────

const GarantiaController = {

  init() {
    Auth.check();
    SharedView.preencherUsuario();
    GarantiaView.renderLista(
      document.getElementById('gar-list'),
      GarantiaModel.analise
    );
    GarantiaView.renderHistorico(
      document.getElementById('gar-historico'),
      GarantiaModel.historico
    );
    Modal.init();
  },

  enviarSolicitacao(e) {
    e.preventDefault();
    const pedido  = document.getElementById('gar-pedido');
    const data    = document.getElementById('gar-data');
    const produto = document.getElementById('gar-produto');
    const defeito = document.getElementById('gar-defeito');
    const desc    = document.getElementById('gar-desc');
    const errorEl = document.getElementById('gar-error');
    const btn     = document.getElementById('btn-gar');

    [pedido, data, produto, defeito, desc].forEach(f => f.classList.remove('error'));
    errorEl.style.display = 'none';

    let valido = true;
    if (!pedido.value.trim())  { pedido.classList.add('error');  valido = false; }
    if (!data.value)           { data.classList.add('error');    valido = false; }
    if (!produto.value.trim()) { produto.classList.add('error'); valido = false; }
    if (!defeito.value)        { defeito.classList.add('error'); valido = false; }
    if (!desc.value.trim())    { desc.classList.add('error');    valido = false; }

    if (!valido) {
      errorEl.textContent = 'Preencha todos os campos obrigatórios.';
      errorEl.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Enviando...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>🛡</span> Solicitar Garantia';

      const protocolo = 'GAR-' + String(Math.floor(Math.random() * 9000) + 1000);
      GarantiaView.mostrarModal(pedido.value.trim(), protocolo);

      document.getElementById('form-garantia').reset();
      document.getElementById('gar-arquivo-nome').textContent = '';
    }, 1200);
  }
};

// Aliases globais para chamadas inline nos HTML
function enviarSolicitacao(e) { GarantiaController.enviarSolicitacao(e); }

GarantiaController.init();
