// ── CRÉDITO CONTROLLER ────────────────────────────────────────────────────────
// Orquestra a página de solicitação de crédito
// ─────────────────────────────────────────────────────────────────────────────

const CreditoController = {

  init() {
    Auth.check();
    SharedView.preencherUsuario();
    CreditoView.renderLista(
      document.getElementById('cred-list'),
      CreditoModel.andamento
    );
    CreditoView.renderHistorico(
      document.getElementById('cred-historico'),
      CreditoModel.historico
    );
    Modal.init();
  },

  enviarCredito(e) {
    e.preventDefault();
    const limite        = document.getElementById('cred-limite');
    const finalidade    = document.getElementById('cred-finalidade');
    const faturamento   = document.getElementById('cred-faturamento');
    const justificativa = document.getElementById('cred-justificativa');
    const errorEl       = document.getElementById('cred-error');
    const btn           = document.getElementById('btn-cred');

    [limite, finalidade, faturamento, justificativa].forEach(f => f.classList.remove('error'));
    errorEl.style.display = 'none';

    let valido = true;
    if (!limite.value.trim())         { limite.classList.add('error');        valido = false; }
    if (!finalidade.value)            { finalidade.classList.add('error');    valido = false; }
    if (!faturamento.value.trim())    { faturamento.classList.add('error');   valido = false; }
    if (!justificativa.value.trim())  { justificativa.classList.add('error'); valido = false; }

    if (!valido) {
      errorEl.textContent = 'Preencha todos os campos obrigatórios.';
      errorEl.style.display = 'block';
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<span>⏳</span> Enviando...';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<span>💳</span> Enviar Solicitação';

      const protocolo = 'CRE-' + String(Math.floor(Math.random() * 9000) + 1000);
      CreditoView.mostrarModal(limite.value, protocolo);

      document.getElementById('form-credito').reset();
      document.getElementById('cred-arquivo-nome').textContent = '';
    }, 1200);
  }
};

// Aliases globais para chamadas inline nos HTML
function enviarCredito(e) { CreditoController.enviarCredito(e); }

CreditoController.init();
