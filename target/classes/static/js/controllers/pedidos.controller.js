// ── PEDIDOS CONTROLLER ────────────────────────────────────────────────────────
// Orquestra a tela de listagem e acompanhamento de pedidos
// ─────────────────────────────────────────────────────────────────────────────

const PedidosController = {

  pedidosFiltrados: [],

  init() {
    this.verificarSessao();
    this.pedidosFiltrados = PedidosModel.carregarPedidos();
    this.renderizar();
    this.bindFiltros();
  },

  verificarSessao() {
    const usuario = Auth.getUsuario();
    const perfil  = Auth.getPerfil();
    if (usuario) {
      const el = document.getElementById('sidebar-nome');
      const av = document.getElementById('sidebar-avatar');
      const ta = document.getElementById('topbar-avatar');
      if (el) el.textContent = usuario;
      if (av) av.textContent = Auth.getIniciais(usuario);
      if (ta) ta.textContent = Auth.getIniciais(usuario);
    }
  },

  renderizar() {
    const tbody   = document.getElementById('pedidos-tbody');
    const rodape  = document.getElementById('pedidos-rodape');
    if (tbody)  PedidosView.renderTabela(tbody, this.pedidosFiltrados);
    if (rodape) PedidosView.renderRodape(rodape, PedidosModel.pedidos.length, this.pedidosFiltrados.length);
  },

  bindFiltros() {
    const busca  = document.getElementById('busca-pedido');
    const filtro = document.getElementById('filtro-status');
    if (busca)  busca.addEventListener('input',  () => this.aplicarFiltros());
    if (filtro) filtro.addEventListener('change', () => this.aplicarFiltros());
  },

  aplicarFiltros() {
    const termo  = (document.getElementById('busca-pedido')?.value  || '').toLowerCase();
    const status = (document.getElementById('filtro-status')?.value || '');

    this.pedidosFiltrados = PedidosModel.carregarPedidos().filter(p => {
      const bateTexto  = !termo  || p.id.toLowerCase().includes(termo) || p.itens.toLowerCase().includes(termo);
      const bateStatus = !status || p.status === status;
      return bateTexto && bateStatus;
    });

    this.renderizar();
  },

  verDetalhes(id) {
    const pedido = PedidosModel.pedidos.find(p => p.id === id);
    if (!pedido) return;
    document.body.insertAdjacentHTML('beforeend', PedidosView.renderModal(pedido));
  },

  fecharModal(event) {
    if (event && event.target.id !== 'modal-pedido') return;
    const modal = document.getElementById('modal-pedido');
    if (modal) modal.remove();
  }
};

function logout(e) {
  e.preventDefault();
  Auth.logout();
}

PedidosController.init();
