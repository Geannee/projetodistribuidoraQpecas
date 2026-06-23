const PedidosController = {
  pedidosFiltrados: [],

  async init() {
    this.verificarSessao();
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
    const statusFiltro = (document.getElementById('filtro-status')?.value || '');

    this.pedidosFiltrados = PedidosModel.cachePedidos.filter(p => {
      const bateTexto = !termo ||
          p.numeroPedido.toLowerCase().includes(termo) ||
          p.itens.some(i => i.nomePeca.toLowerCase().includes(termo));

      const bateStatus = !statusFiltro || p.status === statusFiltro;
      return bateTexto && bateStatus;
    });

    this.renderizar();
  },

  toggleDetalhe(safeId) {
    const row = document.getElementById('detalhe-' + safeId);
    const btn = document.getElementById('btn-' + safeId);
    if (!row || !btn) return;

    const jaEstavaAberto = row.classList.contains('aberto');

    // Fecha todas as outras linhas, mantendo apenas a atual intocada
    document.querySelectorAll('.detalhe-row.aberto').forEach(r => {
      if (r.id !== 'detalhe-' + safeId) {
        r.classList.remove('aberto');
        const k = r.id.replace('detalhe-', '');
        const b = document.getElementById('btn-' + k);
        if (b) b.textContent = 'Ver detalhes ▾';
      }
    });

    // Abre ou fecha a linha atual corretamente
    if (jaEstavaAberto) {
      row.classList.remove('aberto');
      btn.textContent = 'Ver detalhes ▾';
    } else {
      row.classList.add('aberto');
      btn.textContent = 'Fechar ▴';
    }
  },

  async atualizarStatus(idPedido, novoStatus) {
    const pedido = PedidosModel.cachePedidos.find(p => p.idPedido === idPedido);
    if (!pedido) return;

    pedido.status = novoStatus;
    const statusChave = novoStatus; // Mantém o padrão original do objeto
    const classeStatus = PedidosModel.statusClasse[novoStatus.toUpperCase()] || '';

    const safeId = pedido.numeroPedido.replace(/-/g, '');

    // Atualiza o elemento visual na linha master
    const badgeCell = document.querySelector(`#row-${safeId} .badge-status`);
    if (badgeCell) {
      badgeCell.className = `badge-status ${classeStatus}`;
      const iconeFn = PedidosModel.statusIcone[statusChave];
      const iconeHtml = iconeFn ? iconeFn() : '';
      badgeCell.innerHTML = `${iconeHtml} ${novoStatus}`;
    }

    // Recria a Timeline
    const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
    const idxMap = { 'Aguardando Pagamento': 1, 'Em Separação': 2, 'Em Viagem': 3, 'Entregue': 4, 'Cancelado': -1 };
    const atual = idxMap[novoStatus] ?? 0;
    const tl = document.getElementById('tl-' + safeId);

    if (tl) {
      tl.innerHTML = novoStatus === 'Cancelado'
          ? `<div class="tl-cancelado-msg">${ICONS.xCircle} Este pedido foi cancelado.</div>`
          : passos.map((passo, i) => `
            <div class="tl-passo ${i <= atual ? 'tl-ativo' : ''}">
              <div class="tl-bolinha">${i <= atual ? ICONS.check : i + 1}</div>
              <span>${passo}</span>
            </div>`).join('');
    }
  }
};

function logout(e) {
  e.preventDefault();
  if (typeof Auth !== 'undefined') Auth.logout();
}

PedidosController.init();
// const PedidosController = {
//   pedidosFiltrados: [],
//
//   async init() {
//     this.verificarSessao();
//     // Aguarda o retorno real da API Spring Boot
//     const pedidosDoBanco = await PedidosModel.carregarPedidos();
//     this.pedidosFiltrados = [...pedidosDoBanco];
//
//     this.renderizar();
//     this.bindFiltros();
//   },
//
//   verificarSessao() {
//     const usuario = typeof Auth !== 'undefined' ? Auth.getUsuario() : 'Oficina Silva';
//     if (usuario) {
//       const el = document.getElementById('sidebar-nome');
//       const av = document.getElementById('sidebar-avatar');
//       const ta = document.getElementById('topbar-avatar');
//       if (el) el.textContent = usuario;
//       if (av) av.textContent = typeof Auth !== 'undefined' ? Auth.getIniciais(usuario) : 'OF';
//       if (ta) ta.textContent = typeof Auth !== 'undefined' ? Auth.getIniciais(usuario) : 'OF';
//     }
//   },
//
//   renderizar() {
//     const tbody = document.getElementById('pedidos-tbody');
//     const rodape = document.getElementById('pedidos-rodape');
//     if (tbody) PedidosView.renderTabela(tbody, this.pedidosFiltrados);
//     if (rodape) PedidosView.renderRodape(rodape, PedidosModel.cachePedidos.length, this.pedidosFiltrados.length);
//   },
//
//   bindFiltros() {
//     const busca = document.getElementById('busca-pedido');
//     const filtro = document.getElementById('filtro-status');
//     if (busca) busca.addEventListener('input', () => this.aplicarFiltros());
//     if (filtro) filtro.addEventListener('change', () => this.aplicarFiltros());
//   },
//
//   aplicarFiltros() {
//     const termo = (document.getElementById('busca-pedido')?.value || '').toLowerCase().trim();
//     const statusFiltro = (document.getElementById('filtro-status')?.value || '').toUpperCase();
//
//     this.pedidosFiltrados = PedidosModel.cachePedidos.filter(p => {
//       // Procura o termo no número do pedido ou varre a lista de itens mapeada
//       const bateTexto = !termo ||
//           p.numeroPedido.toLowerCase().includes(termo) ||
//           p.itens.some(i => i.nomePeca.toLowerCase().includes(termo));
//
//       const bateStatus = !statusFiltro || p.status.toUpperCase() === statusFiltro;
//       return bateTexto && bateStatus;
//     });
//
//     this.renderizar();
//   },
//
//   toggleDetalhe(idPedido) {
//     const row = document.getElementById('detalhe-' + idPedido);
//     const btn = document.getElementById('btn-' + idPedido);
//     if (!row) return;
//
//     // 1. Verifica se ESTA linha específica já está aberta
//     const jaEstavaAberto = row.classList.contains('aberto');
//
//     // 2. Fecha todas as outras abas que estiverem abertas na tela (menos a atual)
//     document.querySelectorAll('.detalhe-row').forEach(r => {
//       if (r.id !== 'detalhe-' + idPedido) {
//         r.classList.remove('aberto');
//         const k = r.id.replace('detalhe-', '');
//         const b = document.getElementById('btn-' + k);
//         if (b) b.textContent = 'Ver detalhes ▾';
//       }
//     });
//
//     // 3. Controla o estado da linha atual baseando-se no histórico dela
//     if (jaEstavaAberto) {
//       row.classList.remove('aberto');
//       btn.textContent = 'Ver detalhes ▾';
//     } else {
//       row.classList.add('aberto');
//       btn.textContent = 'Fechar ▴';
//     }
//   },
//
//   async atualizarStatus(idPedido, novoStatus) {
//     // Altera o estado em memória local instantaneamente
//     const pedido = PedidosModel.cachePedidos.find(p => p.idPedido === idPedido);
//     if (!pedido) return;
//
//     pedido.status = novoStatus;
//     const statusChave = novoStatus.toUpperCase();
//     const classeStatus = PedidosModel.statusClasse[statusChave] || '';
//
//     // Atualiza o elemento visual na linha master
//     const badgeCell = document.querySelector(`#row-${idPedido} .badge-status`);
//     if (badgeCell) {
//       badgeCell.className = `badge-status ${classeStatus}`;
//       badgeCell.textContent = `${PedidosModel.statusIcone[statusChave]} ${novoStatus}`;
//     }
//
//     // Recria dinamicamente a Timeline interna do painel expandido
//     const passos = ['Pedido Realizado', 'Aguardando Pagamento', 'Em Separação', 'Em Viagem', 'Entregue'];
//     const idxMap = { 'AGUARDANDO PAGAMENTO': 1, 'EM SEPARAÇÃO': 2, 'EM VIAGEM': 3, 'ENTREGUE': 4, 'CANCELADO': -1, 'PAGO': 1 };
//     const atual = idxMap[statusChave] ?? 0;
//     const tl = document.getElementById('tl-' + idPedido);
//
//     if (tl) {
//       tl.innerHTML = novoStatus === 'Cancelado'
//         ? '<div class="tl-cancelado-msg">Este pedido foi cancelado.</div>'
//         : passos.map((passo, i) => `
//             <div class="tl-passo ${i <= atual ? 'tl-ativo' : ''}">
//               <div class="tl-bolinha">${i <= atual ? '&#10003;' : i + 1}</div>
//               <span>${passo}</span>
//             </div>`).join('');
//     }
//   }
// };
//
// function logout(e) {
//   e.preventDefault();
//   if (typeof Auth !== 'undefined') Auth.logout();
// }
//
// // Dispara o init
// PedidosController.init();
