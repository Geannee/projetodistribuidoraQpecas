// ── DEVOLUÇÃO CONTROLLER ──────────────────────────────────────────────────────
// Orquestra a página de solicitação de devolução
// ─────────────────────────────────────────────────────────────────────────────

const DevolucaoController = {

  init() {
    Auth.check();
    SharedView.preencherUsuario();
    DevolucaoView.renderLista(
      document.getElementById('dev-list'),
      DevolucaoModel.andamento
    );
    DevolucaoView.renderHistorico(
      document.getElementById('dev-historico'),
      DevolucaoModel.historico
    );
    Modal.init();
  },

  enviarSolicitacao(e) {
    e.preventDefault();
    const pedido  = document.getElementById('dev-pedido');
    const data    = document.getElementById('dev-data');
    const produto = document.getElementById('dev-produto');
    const motivo  = document.getElementById('dev-motivo');
    const desc    = document.getElementById('dev-desc');
    const errorEl = document.getElementById('dev-error');
    const btn     = document.getElementById('btn-dev');

    [pedido, data, produto, motivo, desc].forEach(f => f.classList.remove('error'));
    errorEl.style.display = 'none';

    let valido = true;
    if (!pedido.value.trim())  { pedido.classList.add('error');  valido = false; }
    if (!data.value)           { data.classList.add('error');    valido = false; }
    if (!produto.value.trim()) { produto.classList.add('error'); valido = false; }
    if (!motivo.value)         { motivo.classList.add('error');  valido = false; }
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
      btn.innerHTML = '<span>🔄</span> Abrir Devolução';

      const protocolo = 'DEV-' + String(Math.floor(Math.random() * 9000) + 1000);
      DevolucaoView.mostrarModal(pedido.value.trim(), protocolo);

      document.getElementById('form-devolucao').reset();
      document.getElementById('dev-arquivo-nome').textContent = '';
    }, 1200);
  }
};

// Aliases globais para chamadas inline nos HTML
function enviarSolicitacao(e) { DevolucaoController.enviarSolicitacao(e); }

DevolucaoController.init();
