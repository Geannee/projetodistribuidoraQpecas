const PedidosController = {
  pedidosFiltrados: [],

  async init() {
    this.verificarSessao();
    // Aguarda o retorno real da API Spring Boot
    const pedidosDoBanco = await PedidosModel.carregarPedidos();
    this.pedidosFiltrados = [...pedidosDoBanco];

    this.renderizar();
    this.bindFiltros();
  },

  verificarSessao() {
    const usuario = typeof Auth !== 'undefined' ? Auth.getUsuario() : 'Oficina Silva';
    if (usuario) {
      const el = document.getElementById('sidebar-nome');
      const av = document.getElementById('sidebar-avatar');
      const ta = document.getElementById('topbar-avatar');
      if (el) el.textContent = usuario;
      if (av) av.textContent = typeof Auth !== 'undefined' ? Auth.getIniciais(usuario) : 'OF';
      if (ta) ta.textContent = typeof Auth !== 'undefined' ? Auth.getIniciais(usuario) : 'OF';
    }
  },

  renderizar() {
    const tbody = document.getElementById('pedidos-tbody');
    const rodape = document.getElementById('pedidos-rodape');
    if (tbody) PedidosView.renderTabela(tbody, this.pedidosFiltrados);
    if (rodape) PedidosView.renderRodape(rodape, PedidosModel.cachePedidos.length, this.pedidosFiltrados.length);
  },

  bindFiltros() {
    const busca = document.getElementById('busca-pedido');
    const filtro = document.getElementById('filtro-status');
    if (busca) busca.addEventListener('input', () => this.aplicarFiltros());
    if (filtro) filtro.addEventListener('change', () => this.aplicarFiltros());
  },

  aplicarFiltros() {
    const termo = (document.getElementById('busca-pedido')?.value || '').toLowerCase().trim();
    const statusFiltro = (document.getElementById('filtro-status')?.value || '').toUpperCase();

    this.pedidosFiltrados = PedidosModel.cachePedidos.filter(p => {
      // Procura o termo no número do pedido ou varre a lista de itens mapeada
      const bateTexto = !termo ||
          p.numeroPedido.toLowerCase().includes(termo) ||
          p.itens.some(i => i.nomePeca.toLowerCase().includes(termo));

      const bateStatus = !statusFiltro || p.status.toUpperCase() === statusFiltro;
      return bateTexto && bateStatus;
    });

    this.renderizar();
  },

  toggleDetalhe(idPedido) {
    const row = document.getElementById('detalhe-' + idPedido);
    const btn = document.getElementById('btn-' + idPedido);
    if (!row) return;

    const aberto = row.classList.contains('aberto');

    document.querySelectorAll('.detalhe-row.aberto').forEach(r => {
      r.classList.remove('aberto');
      const k = r.id.replace('detalhe-', '');
      const b = document.getElementById('btn-' + k);
      if (b) b.textContent = 'Ver detalhes ▾';
    });

    if (!aberto) {
      row.classList.add('aberto');
      btn.textContent = 'Fechar ▴';
    }
  },

  async atualizarStatus(idPedido, novoStatus) {
    // Altera o estado em memória local instantaneamente
    const pedido = PedidosModel.cachePedidos.find(p => p.idPedido === idPedido);
    if (!pedido) return;

    pedido.status = novoStatus;
    const statusChave = novoStatus.toUpperCase();
    const classeStatus = PedidosModel.statusClasse[statusChave] || '';

    // Atualiza o elemento visual na linha master
    const badgeCell = document.querySelector(`#row-${idPedido} .badge-status`);
    if (badgeCell) {
      badgeCell.className = `badge-status ${classeStatus}`;
      badgeCell.textContent = `${PedidosModel.statusIcone[statusChave]} ${novoStatus}`;
    }

    // Recria dinamicamente a Timeline interna do painel expandido
    const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
    const idxMap = { 'AGUARDANDO PAGAMENTO': 1, 'EM SEPARAÇÃO': 2, 'EM VIAGEM': 3, 'ENTREGUE': 4, 'CANCELADO': -1, 'PAGO': 1 };
    const atual = idxMap[statusChave] ?? 0;
    const tl = document.getElementById('tl-' + idPedido);

    if (tl) {
      tl.innerHTML = statusChave === 'CANCELADO'
          ? '<div class="tl-cancelado-msg">❌ Este pedido foi cancelado.</div>'
          : passos.map((passo, i) => `
            <div class="tl-passo ${i <= atual ? 'tl-ativo' : ''}">
              <div class="tl-bolinha">${i <= atual ? '✓' : i + 1}</div>
              <span>${passo}</span>
            </div>`).join('');
    }
  }
};

function logout(e) {
  e.preventDefault();
  if (typeof Auth !== 'undefined') Auth.logout();
}

// Dispara o init
PedidosController.init();

// // ── PEDIDOS CONTROLLER ────────────────────────────────────────────────────────
// // Orquestra a tela de listagem e acompanhamento de pedidos
// // ─────────────────────────────────────────────────────────────────────────────
//
// const PedidosController = {
//
//   pedidosFiltrados: [],
//
//   init() {
//     this.verificarSessao();
//     this.pedidosFiltrados = PedidosModel.carregarPedidos();
//     this.renderizar();
//     this.bindFiltros();
//   },
//
//   verificarSessao() {
//     const usuario = Auth.getUsuario();
//     const perfil  = Auth.getPerfil();
//     if (usuario) {
//       const el = document.getElementById('sidebar-nome');
//       const av = document.getElementById('sidebar-avatar');
//       const ta = document.getElementById('topbar-avatar');
//       if (el) el.textContent = usuario;
//       if (av) av.textContent = Auth.getIniciais(usuario);
//       if (ta) ta.textContent = Auth.getIniciais(usuario);
//     }
//   },
//
//   renderizar() {
//     const tbody   = document.getElementById('pedidos-tbody');
//     const rodape  = document.getElementById('pedidos-rodape');
//     if (tbody)  PedidosView.renderTabela(tbody, this.pedidosFiltrados);
//     if (rodape) PedidosView.renderRodape(rodape, PedidosModel.pedidos.length, this.pedidosFiltrados.length);
//   },
//
//   bindFiltros() {
//     const busca  = document.getElementById('busca-pedido');
//     const filtro = document.getElementById('filtro-status');
//     if (busca)  busca.addEventListener('input',  () => this.aplicarFiltros());
//     if (filtro) filtro.addEventListener('change', () => this.aplicarFiltros());
//   },
//
//   aplicarFiltros() {
//     const termo  = (document.getElementById('busca-pedido')?.value  || '').toLowerCase();
//     const status = (document.getElementById('filtro-status')?.value || '');
//
//     this.pedidosFiltrados = PedidosModel.carregarPedidos().filter(p => {
//       const bateTexto  = !termo  || p.id.toLowerCase().includes(termo) || p.itens.toLowerCase().includes(termo);
//       const bateStatus = !status || p.status === status;
//       return bateTexto && bateStatus;
//     });
//
//     this.renderizar();
//   },
//
//   toggleDetalhe(id) {
//     const key     = id.replace('#', '');
//     const row     = document.getElementById('detalhe-' + key);
//     const btn     = document.getElementById('btn-' + key);
//     if (!row) return;
//
//     const aberto = row.classList.contains('aberto');
//
//     // Fecha todas as outras abas abertas
//     document.querySelectorAll('.detalhe-row.aberto').forEach(r => {
//       r.classList.remove('aberto');
//       const k = r.id.replace('detalhe-', '');
//       const b = document.getElementById('btn-' + k);
//       if (b) b.textContent = 'Ver detalhes ▾';
//     });
//
//     if (!aberto) {
//       row.classList.add('aberto');
//       btn.textContent = 'Fechar ▴';
//     }
//   },
//
//   atualizarStatus(id, novoStatus) {
//     const key    = id.replace('#', '');
//     const todos  = PedidosModel.carregarPedidos();
//     const pedido = todos.find(p => p.id === id);
//     if (!pedido) return;
//
//     pedido.status      = novoStatus;
//     pedido.statusClass = PedidosModel.statusClasse[novoStatus] || '';
//
//     // Persiste se for pedido do localStorage
//     const salvos = JSON.parse(localStorage.getItem('pedidos') || '[]');
//     const idx    = salvos.findIndex(p => p.id === id);
//     if (idx !== -1) {
//       salvos[idx].status      = novoStatus;
//       salvos[idx].statusClass = pedido.statusClass;
//       localStorage.setItem('pedidos', JSON.stringify(salvos));
//     }
//
//     // Atualiza badge na linha da tabela
//     const badgeCell = document.querySelector(`#row-${key} .badge-status`);
//     if (badgeCell) {
//       badgeCell.className  = `badge-status ${pedido.statusClass}`;
//       badgeCell.textContent = `${PedidosModel.statusIcone[novoStatus]} ${novoStatus}`;
//     }
//
//     // Atualiza timeline na aba
//     const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
//     const idxMap = { 'Aguardando Pagamento': 1, 'Em Separação': 2, 'Em Viagem': 3, 'Entregue': 4, 'Cancelado': -1 };
//     const atual  = idxMap[novoStatus] ?? 0;
//     const tl     = document.getElementById('tl-' + key);
//     if (tl) {
//       tl.innerHTML = novoStatus === 'Cancelado'
//         ? '<div class="tl-cancelado-msg">❌ Este pedido foi cancelado.</div>'
//         : passos.map((passo, i) => `
//             <div class="tl-passo ${i <= atual ? 'tl-ativo' : ''}">
//               <div class="tl-bolinha">${i <= atual ? '✓' : i + 1}</div>
//               <span>${passo}</span>
//             </div>`).join('');
//     }
//   }
// };
//
// function logout(e) {
//   e.preventDefault();
//   Auth.logout();
// }
//
// PedidosController.init();
