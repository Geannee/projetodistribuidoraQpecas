// ── ADMIN ESTOQUE VIEW ────────────────────────────────────────────────────────
// Renderiza os filtros, o catálogo agrupado por veículo e o modal de edição
// ─────────────────────────────────────────────────────────────────────────────

const AdminEstoqueView = {
  selectMarca:         document.getElementById('est-marca'),
  selectModelo:        document.getElementById('est-modelo'),
  selectAno:           document.getElementById('est-ano'),
  selectCategoria:     document.getElementById('est-categoria'),
  selectFabricante:    document.getElementById('est-fabricante'),
  inputBusca:          document.getElementById('est-busca'),
  divCatalogo:         document.getElementById('est-catalogo'),

  // Modal bindings
  modal:               document.getElementById('edit-modal-overlay'),
  editNome:            document.getElementById('edit-p-nome'),
  editSku:             document.getElementById('edit-p-sku'),
  editCompatibilidade: document.getElementById('edit-p-compatibilidade-container'),
  editPreco:           document.getElementById('edit-p-preco'),
  editEstoque:         document.getElementById('edit-p-estoque'),
  editFornecedor:      document.getElementById('edit-p-fornecedor'),
  editCategoria:       document.getElementById('edit-p-categoria'),
  editTipo:            document.getElementById('edit-p-tipo'),
  formEdit:            document.getElementById('form-edit-peca'),

  showToast(msg, tipo = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className   = `toast toast-${tipo} show`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
  },

  popularMarcas(marcas) {
    if (!this.selectMarca) return;
    this.selectMarca.innerHTML = '<option value="">Nenhum (Mostrar todas as peças)</option>';
    marcas.forEach(marca => {
      const opt = document.createElement('option');
      opt.value = marca;
      opt.textContent = marca;
      this.selectMarca.appendChild(opt);
    });
  },

  popularFabricantes(fabricantes) {
    if (!this.selectFabricante) return;
    this.selectFabricante.innerHTML = '<option value="">Todos os fabricantes</option>';
    fabricantes.forEach(fab => {
      const opt = document.createElement('option');
      opt.value = fab.idFabricante;
      opt.textContent = fab.nome;
      this.selectFabricante.appendChild(opt);
    });
  },

  popularModelos(modelos) {
    if (!this.selectModelo) return;
    this.selectModelo.innerHTML = '<option value="">Todos os modelos</option>';
    if (modelos && modelos.length > 0) {
      modelos.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        opt.textContent = m;
        this.selectModelo.appendChild(opt);
      });
      this.selectModelo.disabled = false;
    } else {
      this.selectModelo.disabled = true;
    }
  },

  popularAnos(anos) {
    if (!this.selectAno) return;
    this.selectAno.innerHTML = '<option value="">Todos os anos</option>';
    if (anos && anos.length > 0) {
      anos.forEach(a => {
        const opt = document.createElement('option');
        opt.value = a;
        opt.textContent = a;
        this.selectAno.appendChild(opt);
      });
      this.selectAno.disabled = false;
    } else {
      this.selectAno.disabled = true;
    }
  },

  renderCatalogo(dados, isFlat = false, sortField = 'nome', sortAsc = true, totalCount = null, currentPage = 1) {
    if (!this.divCatalogo) return;

    if (!dados || dados.length === 0) {
      this.divCatalogo.innerHTML = `
        <div class="empty-row" style="background:#fff; border-radius:14px; border:1px solid var(--border); padding: 48px 24px; text-align: center;">
          <div style="font-size: 24px; margin-bottom: 8px;">🔍</div>
          <h3 style="font-size: 16px; font-weight: 600; color: var(--dark-text); margin-bottom: 4px;">Nenhum veículo ou peça encontrados</h3>
          <p style="font-size: 13px; color: var(--gray-text);">Tente alterar os termos da pesquisa ou ajustar os filtros aplicados.</p>
        </div>
      `;
      return;
    }

    const renderHeaders = () => {
      const columns = [
        { key: 'sku', label: 'SKU' },
        { key: 'nome', label: 'Nome da Peça' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'fabricante', label: 'Fabricante' },
        { key: 'preco', label: 'Preço' },
        { key: 'estoque', label: 'Estoque' },
        { key: 'tipo', label: 'Tipo' }
      ];

      const headersHtml = columns.map(col => {
        const arrow = col.key === sortField ? (sortAsc ? ' ▲' : ' ▼') : ' ↕';
        const arrowColor = col.key === sortField ? 'var(--coral)' : 'var(--gray-text)';
        return `
          <th class="sortable-header" onclick="AdminEstoqueController.alterarOrdenacao('${col.key}')" style="user-select:none; cursor:pointer;">
            ${col.label} <span style="font-size:10px; color:${arrowColor};">${arrow}</span>
          </th>
        `;
      }).join('');

      return `
        <tr>
          ${headersHtml}
          <th>Ação</th>
        </tr>
      `;
    };

    if (isFlat) {
      const pecasHtml = dados.map(p => {
        const estoqueClass = p.estoque === 0 ? 'estoque-zero' : p.estoque <= 3 ? 'estoque-low' : 'estoque-ok';
        const estoqueLabel = p.estoque === 0 ? 'Sem estoque' : p.estoque <= 3 ? `Baixo (${p.estoque})` : p.estoque;
        const precoFormatado = p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        return `
          <tr>
            <td><code style="font-size:12px">${p.codigo}</code></td>
            <td style="font-weight: 600;">${p.nome}</td>
            <td>${p.categoria}</td>
            <td>${p.fabricante ? p.fabricante.nome : (p.marca || '—')}</td>
            <td style="font-weight: 700;">${precoFormatado}</td>
            <td><span class="badge-estoque ${estoqueClass}">${estoqueLabel}</span></td>
            <td><span style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--gray-text);">${p.tipoPeca}</span></td>
            <td>
              <button class="btn-alterar" onclick="AdminEstoqueController.abrirEditarPeca(${p.idPeca})">
                Editar
              </button>
            </td>
          </tr>
        `;
      }).join('');

      const totalPages = Math.ceil((totalCount || dados.length) / 25) || 1;
      const paginationHtml = totalPages > 1 ? `
        <div class="pagination-container" style="display: flex; justify-content: center; align-items: center; gap: 16px; margin-top: 24px;">
          <button type="button" class="btn-secondary" onclick="AdminEstoqueController.irParaPagina(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''} style="height:36px; padding:0 16px; font-weight: 500;">
            &larr; Anterior
          </button>
          <span style="font-weight: 500; font-size: 14px; color: var(--dark-text);">
            Página ${currentPage} de ${totalPages}
          </span>
          <button type="button" class="btn-secondary" onclick="AdminEstoqueController.irParaPagina(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''} style="height:36px; padding:0 16px; font-weight: 500;">
            Próximo &rarr;
          </button>
        </div>
      ` : '';

      this.divCatalogo.innerHTML = `
        <article class="catalog-vehicle-card">
          <header class="catalog-vehicle-header">
            <div class="catalog-vehicle-title">
              <strong>Todas as Peças em Estoque</strong>
            </div>
            <div class="catalog-vehicle-info">
              ${totalCount && totalCount > dados.length ? `Mostrando ${dados.length} de ${totalCount} peças` : `${dados.length} peça${dados.length !== 1 ? 's' : ''} encontrada${dados.length !== 1 ? 's' : ''}`}
            </div>
          </header>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                ${renderHeaders()}
              </thead>
              <tbody>
                ${pecasHtml}
              </tbody>
            </table>
          </div>
        </article>
        ${paginationHtml}
      `;
      return;
    }

    this.divCatalogo.innerHTML = dados.map(v => {
      const pecasHtml = v.pecas.map(p => {
        const estoqueClass = p.estoque === 0 ? 'estoque-zero' : p.estoque <= 3 ? 'estoque-low' : 'estoque-ok';
        const estoqueLabel = p.estoque === 0 ? 'Sem estoque' : p.estoque <= 3 ? `Baixo (${p.estoque})` : p.estoque;
        const precoFormatado = p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        return `
          <tr>
            <td><code style="font-size:12px">${p.codigo}</code></td>
            <td style="font-weight: 600;">${p.nome}</td>
            <td>${p.categoria}</td>
            <td>${p.fabricante ? p.fabricante.nome : (p.marca || '—')}</td>
            <td style="font-weight: 700;">${precoFormatado}</td>
            <td><span class="badge-estoque ${estoqueClass}">${estoqueLabel}</span></td>
            <td><span style="font-size:11px; font-weight:600; text-transform:uppercase; color:var(--gray-text);">${p.tipoPeca}</span></td>
            <td>
              <button class="btn-alterar" onclick="AdminEstoqueController.abrirEditarPeca(${p.idPeca})">
                Editar
              </button>
            </td>
          </tr>
        `;
      }).join('');

      return `
        <article class="catalog-vehicle-card">
          <header class="catalog-vehicle-header">
            <div class="catalog-vehicle-title">
              <strong>${v.marca} ${v.modelo}</strong>
              <span class="catalog-vehicle-badge">${v.anoFabricacao}</span>
              <span class="catalog-vehicle-badge" style="background:#EFF6FF; color:#2563EB;">Placa: ${v.placa}</span>
            </div>
            <div class="catalog-vehicle-info">
              ${v.pecas.length} peça${v.pecas.length !== 1 ? 's' : ''} compatível${v.pecas.length !== 1 ? 's' : ''}
            </div>
          </header>
          <div class="table-wrap">
            <table class="data-table">
              <thead>
                ${renderHeaders()}
              </thead>
              <tbody>
                ${pecasHtml}
              </tbody>
            </table>
          </div>
        </article>
      `;
    }).join('');
  },

  mostrarModalEdicao(peca, fornecedores) {
    if (!this.modal) return;

    // Preenche campos de texto
    this.editNome.value = peca.nome;
    this.editSku.value = peca.codigo;
    this.editPreco.value = peca.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
    this.editEstoque.value = peca.estoque;

    // Popula dropdown de fabricantes
    this.editFornecedor.innerHTML = '<option value="">Selecione...</option>' + fornecedores.map(f =>
      `<option value="${f.idFabricante}">${f.nome}</option>`
    ).join('');
    this.editFornecedor.value = peca.fabricante ? peca.fabricante.idFabricante : '';

    // Categoria e Tipo
    this.editCategoria.value = peca.categoria;
    this.editTipo.value = peca.tipoPeca;

    // Mostra o Modal
    this.modal.classList.add('show');
  },

  fecharModalEdicao() {
    if (!this.modal) return;
    this.modal.classList.remove('show');
    this.formEdit.reset();

    // Limpar marcações de erro
    ['edit-p-nome', 'edit-p-sku', 'edit-p-preco', 'edit-p-estoque', 'edit-p-fornecedor', 'edit-p-categoria', 'edit-p-tipo', 'edit-p-compatibilidade-container'].forEach(id => {
      document.getElementById(id)?.classList.remove('error');
    });
  }
};
