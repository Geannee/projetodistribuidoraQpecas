// ── ADMIN SOLICITAÇÕES CONTROLLER ─────────────────────────────────────────────

const SolicitacoesController = {

  lista: [],

  init() {
    Auth.checkAdmin();
    this.lista = SolicitacoesModel.carregar();
    this.renderizar();
    this.bindFiltros();
  },

  renderizar() {
    const todos   = SolicitacoesModel.carregar();
    const tbody   = document.getElementById('sol-tbody');
    const rodape  = document.getElementById('sol-rodape');

    SolicitacoesView.renderStats(todos);

    const termo  = (document.getElementById('busca-sol')?.value || '').toLowerCase();
    const status = document.getElementById('filtro-sol-status')?.value || '';

    const filtrada = todos.filter(s => {
      const bateTexto  = !termo  ||
        s.nomeOficina.toLowerCase().includes(termo) ||
        s.razao.toLowerCase().includes(termo) ||
        s.cnpj.includes(termo) ||
        s.responsavel.toLowerCase().includes(termo);
      const bateStatus = !status || s.status === status;
      return bateTexto && bateStatus;
    });

    if (tbody)  SolicitacoesView.renderTabela(tbody, filtrada);
    if (rodape) SolicitacoesView.renderRodape(rodape, todos.length, filtrada.length);
  },

  bindFiltros() {
    const busca   = document.getElementById('busca-sol');
    const filtro  = document.getElementById('filtro-sol-status');
    if (busca)  busca.addEventListener('input',  () => this.renderizar());
    if (filtro) filtro.addEventListener('change', () => this.renderizar());
  },

  toggleDetalhe(id) {
    const row = document.getElementById('sol-det-' + id);
    const btn = document.getElementById('btn-sol-' + id);
    if (!row) return;

    const aberto = row.classList.contains('aberto');

    document.querySelectorAll('.sol-detalhe-row.aberto').forEach(r => {
      r.classList.remove('aberto');
      const k = r.id.replace('sol-det-', '');
      const b = document.getElementById('btn-sol-' + k);
      if (b) b.textContent = 'Ver detalhes ▾';
    });

    if (!aberto) {
      row.classList.add('aberto');
      if (btn) btn.textContent = 'Fechar ▴';
    }
  },

  aprovar(id) {
    SolicitacoesModel.atualizar(id, 'aprovado');
    this.renderizar();

    // Reabre o detalhe após re-render
    const row = document.getElementById('sol-det-' + id);
    const btn = document.getElementById('btn-sol-' + id);
    if (row) { row.classList.add('aberto'); }
    if (btn) btn.textContent = 'Fechar ▴';

    SolicitacoesView.mostrarToast('Cadastro aprovado com sucesso!', 'ok');
  },

  recusar(id) {
    SolicitacoesModel.atualizar(id, 'recusado');
    this.renderizar();

    const row = document.getElementById('sol-det-' + id);
    const btn = document.getElementById('btn-sol-' + id);
    if (row) { row.classList.add('aberto'); }
    if (btn) btn.textContent = 'Fechar ▴';

    SolicitacoesView.mostrarToast('Cadastro recusado.', 'erro');
  }
};

SolicitacoesController.init();
