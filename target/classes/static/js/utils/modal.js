// ── MODAL UTILS ───────────────────────────────────────────────────────────────
// Controle de modais e upload de arquivos (compartilhado)
// ─────────────────────────────────────────────────────────────────────────────

const Modal = {

  abrir(id) {
    const el = document.getElementById(id || 'modal-overlay');
    if (el) el.style.display = 'flex';
  },

  fechar(id) {
    const el = document.getElementById(id || 'modal-overlay');
    if (el) el.style.display = 'none';
  },

  /** Registra fechar ao clicar fora do modal */
  init(id) {
    const overlay = document.getElementById(id || 'modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', function (e) {
        if (e.target === this) Modal.fechar(id);
      });
    }
  },

  mostrarArquivos(input, spanId) {
    const span = document.getElementById(spanId);
    if (!span) return;
    if (!input.files.length) { span.textContent = ''; return; }
    span.textContent = Array.from(input.files).map(f => f.name).join(', ');
  }
};

// Aliases globais para chamadas inline nos HTML
function fecharModal()                       { Modal.fechar(); }
function mostrarArquivos(input, spanId)      { Modal.mostrarArquivos(input, spanId); }
