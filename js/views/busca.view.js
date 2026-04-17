// ── BUSCA VIEW ────────────────────────────────────────────────────────────────
const BuscaView = {

  mostrarResultados(veiculo, pecas) {
    // Formata e exibe a placa no card Mercosul
    const fmt = veiculo.placa.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    document.getElementById('plateDisplay').textContent =
      fmt.slice(0, 3) + '·' + fmt.slice(3);

    // Preenche dados reais do veículo
    document.getElementById('vcModel').textContent =
      `${veiculo.marca} ${veiculo.modelo} ${veiculo.motor}`;
    document.getElementById('vcDetail1').textContent =
      `${veiculo.ano_fab} / ${veiculo.ano_mod}`;
    document.getElementById('vcDetail2').textContent =
      `Motor ${veiculo.motor} · Cor: ${this._capitalize(veiculo.cor)}`;
    document.getElementById('vcChassis').textContent =
      `Chassis: ${veiculo.chassis}`;

    // Subtítulo do painel direito
    const rSub = document.getElementById('rSub');
    if (rSub) rSub.textContent =
      `${veiculo.modelo} ${veiculo.motor} · ${veiculo.ano_fab}/${veiculo.ano_mod} — Clique para ver as opções`;

    // Renderiza o acordeão com as peças do JSON
    this.renderAcordeon(pecas);

    // Mostra card, oculta "não encontrado"
    document.getElementById('vcCard').style.display     = 'flex';
    document.getElementById('vcNotFound').style.display = 'none';

    // Exibe confirmação do veículo no painel esquerdo
    document.getElementById('vehicleConfirm').style.display = 'flex';

    // Troca estado vazio pela lista de peças no painel direito
    document.getElementById('emptyState').style.display    = 'none';
    document.getElementById('resultSection').style.display = 'block';

    // Scroll do painel direito volta ao topo
    const panelRight = document.querySelector('.panel-right');
    if (panelRight) panelRight.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderAcordeon(pecas) {
    const container = document.getElementById('partsAccordion');
    if (!container) return;

    const BADGE_CLASS = { 'Original': 'badge-original', 'Premium': 'badge-premium', 'Econômico': 'badge-economico' };
    const ESTOQUE_MAP = {
      ok:  { cls: 'estoque-ok',  txt: '● Estoque' },
      low: { cls: 'estoque-low', txt: '⚠ Últimas unid.' },
      out: { cls: 'estoque-out', txt: '✕ Sem estoque' }
    };

    container.innerHTML = pecas.map(cat => {
      const filtrosBtns = cat.filtros.map((f, i) =>
        `<button class="qf-btn${i === 0 ? ' active' : ''}" onclick="filterEquiv(this)">${f}</button>`
      ).join('');

      const linhas = cat.opcoes.map(op => {
        const est     = ESTOQUE_MAP[op.estoque] || ESTOQUE_MAP.ok;
        const badgeTipo = `<span class="badge ${BADGE_CLASS[op.tipo] || ''}">${op.tipo}</span>`;
        const badgeComp = `<span class="badge badge-compat">✓ compatível</span>`;
        const badgeDest = op.destaque
          ? `<span class="badge badge-destaque">${op.destaque}</span>` : '';
        const preco = 'R$ ' + op.preco.toFixed(2).replace('.', ',');

        return `
          <div class="equiv-row">
            <div class="equiv-thumb">⚙</div>
            <div class="equiv-info">
              <div class="equiv-brand">${op.marca}</div>
              <div class="equiv-ref">Ref.: ${op.ref}</div>
              <div class="equiv-badges">${badgeTipo}${badgeComp}${badgeDest}</div>
            </div>
            <div class="equiv-estoque ${est.cls}">${est.txt}</div>
            <div class="equiv-preco">
              <div class="price">${preco}</div>
              <div class="label">${op.label}</div>
            </div>
            <button class="btn-add" onclick="addToCart(this)">+ Add</button>
          </div>`;
      }).join('');

      return `
        <div class="pa-item" id="pa-${cat.id}">
          <div class="pa-header" onclick="togglePart('pa-${cat.id}')">
            <span class="pa-icon">${cat.icon}</span>
            <div class="pa-info">
              <span class="pa-name">${cat.nome}</span>
              <span class="pa-sub">${cat.sub}</span>
            </div>
            <span class="pa-count">${cat.opcoes.length} opções</span>
            <span class="pa-arrow">›</span>
          </div>
          <div class="pa-body">
            <div class="quick-filters">${filtrosBtns}</div>
            <div class="equiv-list">${linhas}</div>
          </div>
        </div>`;
    }).join('');
  },

  mostrarResultadosApp(appData, pecas) {
    const { marca, modelo, ano, categoria } = appData;

    // Monta label do veículo
    const veiculoLabel = [marca, modelo, ano].filter(Boolean).join(' ');
    const catLabel     = categoria || 'Todas as categorias';

    // Preenche card de confirmação (sem placa)
    document.getElementById('vcCard').style.display     = 'flex';
    document.getElementById('vcNotFound').style.display = 'none';
    document.querySelector('.vc-plate').style.display   = 'none';
    document.getElementById('vcModel').textContent      = veiculoLabel;
    document.getElementById('vcDetail1').textContent    = ano ? `Ano: ${ano}` : 'Ano: não informado';
    document.getElementById('vcDetail2').textContent    = `Categoria: ${catLabel}`;
    document.getElementById('vcChassis').style.display  = 'none';

    // Subtítulo do painel direito
    const rSub = document.getElementById('rSub');
    if (rSub) rSub.textContent = `${veiculoLabel} · ${catLabel} — Clique para ver as opções`;

    // Renderiza acordeão com peças filtradas ou mensagem vazia
    if (pecas.length === 0) {
      document.getElementById('partsAccordion').innerHTML = `
        <div style="text-align:center;padding:48px 24px;color:#737373;">
          <div style="font-size:40px;margin-bottom:12px;">🔍</div>
          <p>Nenhuma peça encontrada para <strong>${catLabel}</strong>.</p>
        </div>`;
    } else {
      this.renderAcordeon(pecas);
    }

    document.getElementById('vehicleConfirm').style.display = 'flex';
    document.getElementById('emptyState').style.display     = 'none';
    document.getElementById('resultSection').style.display  = 'block';

    const panelRight = document.querySelector('.panel-right');
    if (panelRight) panelRight.scrollTo({ top: 0, behavior: 'smooth' });
  },

  mostrarNaoEncontrado(placa) {
    // Exibe placa digitada no card mesmo sem encontrar
    const fmt = placa.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    document.getElementById('plateDisplay').textContent =
      fmt.slice(0, 3) + '·' + fmt.slice(3);

    // Oculta card de dados, exibe mensagem de erro
    document.getElementById('vcCard').style.display     = 'none';
    document.getElementById('vcNotFound').style.display = 'flex';

    document.getElementById('vehicleConfirm').style.display = 'flex';

    // Mantém painel direito vazio
    document.getElementById('emptyState').style.display    = 'flex';
    document.getElementById('resultSection').style.display = 'none';
  },

  ocultarResultados() {
    document.getElementById('vehicleConfirm').style.display  = 'none';
    document.getElementById('resultSection').style.display   = 'none';
    document.getElementById('emptyState').style.display      = 'flex';

    // Restaura elementos que podem ter sido ocultados pela busca por aplicação
    const vcPlate   = document.querySelector('.vc-plate');
    const vcChassis = document.getElementById('vcChassis');
    if (vcPlate)   vcPlate.style.display   = '';
    if (vcChassis) vcChassis.style.display = '';

    // Fecha todos os itens abertos
    document.querySelectorAll('.pa-item.open').forEach(i => i.classList.remove('open'));

    document.getElementById('plateInput').value = '';
    document.getElementById('plateInput').focus();
  },

  togglePart(id) {
    const item   = document.getElementById(id);
    const aberto = item.classList.contains('open');
    // Fecha todos e abre o clicado (se estava fechado)
    document.querySelectorAll('.pa-item').forEach(i => i.classList.remove('open'));
    if (!aberto) item.classList.add('open');
  },

  filtrarEquivalencias(btn) {
    const filtro = btn.textContent.trim();
    btn.closest('.quick-filters').querySelectorAll('.qf-btn')
      .forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const rows = btn.closest('.pa-body').querySelectorAll('.equiv-row');
    rows.forEach(row => {
      const match = filtro === 'Todas' ||
        Array.from(row.querySelectorAll('.badge'))
          .some(b => b.textContent.trim().toLowerCase()
            .includes(filtro.toLowerCase()));
      row.style.display = match ? '' : 'none';
    });
  },

  _capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
};
