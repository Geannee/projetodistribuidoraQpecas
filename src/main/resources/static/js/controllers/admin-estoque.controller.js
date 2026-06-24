// ── ADMIN ESTOQUE CONTROLLER ──────────────────────────────────────────────────
// Orquestra a filtragem, busca, ordenação e edição das peças
// ─────────────────────────────────────────────────────────────────────────────

const AdminEstoqueController = {
  veiculos: [],
  associacoes: [],
  fornecedores: [],
  idPecaSendoEditada: null,
  editSelectedVehicleIds: new Set(),

  async init() {
    if (!Auth.checkAdmin()) return;

    this.bindEvents();
    await this.carregarDados();
  },

  async carregarDados() {
    try {
      this.veiculos = await AdminEstoqueModel.getVeiculos();
      this.associacoes = await AdminEstoqueModel.getAssociacoes();
      this.fornecedores = await AdminEstoqueModel.getFornecedores();

      const marcasUnicas = [...new Set(this.veiculos.map(v => v.marca))].sort();
      AdminEstoqueView.popularMarcas(marcasUnicas);

      this.filtrarEstoque();
    } catch (e) {
      console.error("Erro ao inicializar dados de estoque:", e);
      AdminEstoqueView.showToast("Erro ao carregar dados do catálogo.", "error");
    }
  },

  bindEvents() {
    AdminEstoqueView.inputBusca?.addEventListener('input', () => this.filtrarEstoque());

    AdminEstoqueView.selectMarca?.addEventListener('change', async () => {
      await this.lidarComMudancaMarca();
      this.filtrarEstoque();
    });

    AdminEstoqueView.selectModelo?.addEventListener('change', async () => {
      await this.lidarComMudancaModelo();
      this.filtrarEstoque();
    });

    AdminEstoqueView.selectAno?.addEventListener('change', () => this.filtrarEstoque());
    AdminEstoqueView.selectCategoria?.addEventListener('change', () => this.filtrarEstoque());

    // Bind submit de edição
    AdminEstoqueView.formEdit?.addEventListener('submit', (e) => this.submeterEdicao(e));

    // Bind eventos do widget de edição
    const editBuscaInput = document.getElementById('edit-p-comp-busca');
    const editFiltroMarca = document.getElementById('edit-p-comp-filtro-marca');
    const editBtnTodos = document.getElementById('edit-p-comp-btn-todos');
    const editBtnNenhum = document.getElementById('edit-p-comp-btn-nenhum');

    editBuscaInput?.addEventListener('input', () => this.filtrarERenderizarWidgetEdicao());
    editFiltroMarca?.addEventListener('change', () => this.filtrarERenderizarWidgetEdicao());

    editBtnTodos?.addEventListener('click', () => {
      const filtered = this.obterVeiculosFiltradosEdicao();
      filtered.forEach(v => this.editSelectedVehicleIds.add(v.idVeiculo));
      this.atualizarWidgetEdicaoUI();
    });

    editBtnNenhum?.addEventListener('click', () => {
      const filtered = this.obterVeiculosFiltradosEdicao();
      filtered.forEach(v => this.editSelectedVehicleIds.delete(v.idVeiculo));
      this.atualizarWidgetEdicaoUI();
    });

    // Limpar erros ao digitar
    ['edit-p-nome', 'edit-p-sku', 'edit-p-preco', 'edit-p-estoque', 'edit-p-fornecedor', 'edit-p-categoria', 'edit-p-tipo'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        document.getElementById(id)?.classList.remove('error');
      });
    });
  },

  async lidarComMudancaMarca() {
    const marcaSelecionada = AdminEstoqueView.selectMarca.value;

    if (!marcaSelecionada) {
      AdminEstoqueView.popularModelos([]);
      AdminEstoqueView.popularAnos([]);
      return;
    }

    const modelos = await AdminEstoqueModel.obterModelosPorMarca(marcaSelecionada);
    AdminEstoqueView.popularModelos(modelos);
    AdminEstoqueView.popularAnos([]);
  },

  async lidarComMudancaModelo() {
    const modeloSelecionado = AdminEstoqueView.selectModelo.value;

    if (!modeloSelecionado) {
      AdminEstoqueView.popularAnos([]);
      return;
    }

    const anos = await AdminEstoqueModel.obterAnoPorModelo(modeloSelecionado);
    AdminEstoqueView.popularAnos(anos);
  },

  filtrarEstoque() {
    const query = AdminEstoqueView.inputBusca?.value.trim().toLowerCase() || '';
    const marca = AdminEstoqueView.selectMarca?.value || '';
    const modelo = AdminEstoqueView.selectModelo?.value || '';
    const ano = AdminEstoqueView.selectAno?.value || '';
    const categoria = AdminEstoqueView.selectCategoria?.value || '';

    const associacoesFiltradas = this.associacoes.filter(assoc => {
      if (categoria && assoc.peca.categoria !== categoria) {
        return false;
      }
      if (query) {
        const nomePeca = assoc.peca.nome ? assoc.peca.nome.toLowerCase() : '';
        const skuPeca = assoc.peca.codigo ? assoc.peca.codigo.toLowerCase() : '';
        if (!nomePeca.includes(query) && !skuPeca.includes(query)) {
          return false;
        }
      }
      return true;
    });

    const pecasPorVeiculo = {};
    associacoesFiltradas.forEach(assoc => {
      const vId = assoc.veiculo.idVeiculo;
      if (!pecasPorVeiculo[vId]) {
        pecasPorVeiculo[vId] = [];
      }
      if (!pecasPorVeiculo[vId].some(p => p.idPeca === assoc.peca.idPeca)) {
        pecasPorVeiculo[vId].push(assoc.peca);
      }
    });

    const catalogo = this.veiculos
      .filter(v => {
        if (marca && v.marca !== marca) return false;
        if (modelo && v.modelo !== modelo) return false;
        if (ano && v.anoFabricacao.toString() !== ano) return false;
        if (!pecasPorVeiculo[v.idVeiculo] || pecasPorVeiculo[v.idVeiculo].length === 0) return false;
        return true;
      })
      .map(v => {
        const pecas = [...pecasPorVeiculo[v.idVeiculo]];
        pecas.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
        return {
          ...v,
          pecas
        };
      });

    catalogo.sort((a, b) => {
      const brandCompare = a.marca.localeCompare(b.marca, 'pt-BR');
      if (brandCompare !== 0) return brandCompare;
      return a.modelo.localeCompare(b.modelo, 'pt-BR');
    });

    AdminEstoqueView.renderCatalogo(catalogo);
  },

  // ── EDIÇÃO DE PEÇAS ──────────────────────────────────────────────────────────
  abrirEditarPeca(idPeca) {
    const assoc = this.associacoes.find(a => a.peca.idPeca === idPeca);
    if (!assoc) {
      AdminEstoqueView.showToast("Peça não encontrada.", "error");
      return;
    }

    const peca = assoc.peca;
    this.idPecaSendoEditada = peca.idPeca;

    // Acha todos os veículos compatíveis com essa peça
    const veiculosIdsAssociados = this.associacoes
      .filter(a => a.peca.idPeca === peca.idPeca)
      .map(a => a.veiculo.idVeiculo);

    this.editSelectedVehicleIds = new Set(veiculosIdsAssociados);

    // Popular o filtro de marcas do modal
    const filtroMarca = document.getElementById('edit-p-comp-filtro-marca');
    if (filtroMarca) {
      const marcasUnicas = [...new Set(this.veiculos.map(v => v.marca))].sort();
      filtroMarca.innerHTML = '<option value="">Todas as Marcas</option>' +
        marcasUnicas.map(m => `<option value="${m}">${m}</option>`).join('');
      filtroMarca.value = '';
    }
    const buscaInput = document.getElementById('edit-p-comp-busca');
    if (buscaInput) buscaInput.value = '';

    AdminEstoqueView.mostrarModalEdicao(peca, this.fornecedores);
    this.filtrarERenderizarWidgetEdicao();
    this.atualizarWidgetEdicaoUI();
  },

  fecharModal() {
    this.idPecaSendoEditada = null;
    AdminEstoqueView.fecharModalEdicao();
  },

  async submeterEdicao(e) {
    e.preventDefault();
    if (!this.idPecaSendoEditada) return;

    const campos = {
      nome:            AdminEstoqueView.editNome.value.trim(),
      sku:             AdminEstoqueView.editSku.value.trim(),
      compatibilidade: Array.from(this.editSelectedVehicleIds),
      preco:           AdminEstoqueView.editPreco.value.trim(),
      estoque:         AdminEstoqueView.editEstoque.value.trim(),
      fabricanteId:    AdminEstoqueView.editFornecedor.value,
      categoria:       AdminEstoqueView.editCategoria.value,
      tipo:            AdminEstoqueView.editTipo.value
    };

    const erros = this.validarPecaEdicao(campos);
    if (erros.length) {
      erros.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('error');
      });
      AdminEstoqueView.showToast('Preencha os campos obrigatórios corretamente.', 'error');
      return;
    }

    try {
      const sucesso = await AdminEstoqueModel.atualizarPeca(this.idPecaSendoEditada, campos);
      if (sucesso) {
        AdminEstoqueView.showToast('Peça atualizada com sucesso!', 'success');
        this.fecharModal();
        await this.carregarDados(); // Recarrega e atualiza
      }
    } catch (error) {
      console.error(error);
      AdminEstoqueView.showToast('Erro ao atualizar: ' + error.message, 'error');
    }
  },

  validarPecaEdicao(c) {
    const erros = [];
    if (!c.nome)            erros.push('edit-p-nome');
    if (!c.sku)             erros.push('edit-p-sku');
    if (!c.compatibilidade || c.compatibilidade.length === 0) erros.push('edit-p-compatibilidade-container');
    if (!c.preco || isNaN(parseFloat(c.preco.replace(',', '.')))) erros.push('edit-p-preco');
    if (c.estoque === "" || isNaN(Number(c.estoque)) || Number(c.estoque) < 0) erros.push('edit-p-estoque');
    if (!c.fabricanteId)    erros.push('edit-p-fornecedor');
    if (!c.categoria)       erros.push('edit-p-categoria');
    if (!c.tipo)            erros.push('edit-p-tipo');
    return erros;
  },

  // ── MÉTODOS DO WIDGET DE EDIÇÃO ─────────────────────────────────────────────
  obterVeiculosFiltradosEdicao() {
    const query = document.getElementById('edit-p-comp-busca')?.value.toLowerCase().trim() || '';
    const marca = document.getElementById('edit-p-comp-filtro-marca')?.value || '';

    return this.veiculos.filter(v => {
      if (marca && v.marca !== marca) return false;
      if (query) {
        const text = `${v.marca} ${v.modelo} ${v.anoFabricacao} ${v.placa}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });
  },

  filtrarERenderizarWidgetEdicao() {
    const filtered = this.obterVeiculosFiltradosEdicao();
    const listaContainer = document.getElementById('edit-p-comp-lista');
    if (!listaContainer) return;

    if (this.veiculos.length === 0) {
      listaContainer.innerHTML = '<div style="grid-column: span 2; padding: 12px; color: var(--gray-text); text-align: center;">Nenhum veículo cadastrado.</div>';
      return;
    }

    if (filtered.length === 0) {
      listaContainer.innerHTML = '<div style="grid-column: span 2; padding: 12px; color: var(--gray-text); text-align: center;">Nenhum veículo correspondente.</div>';
      return;
    }

    listaContainer.innerHTML = filtered.map(v => {
      const isChecked = this.editSelectedVehicleIds.has(v.idVeiculo);
      return `
        <div class="widget-item ${isChecked ? 'checked' : ''}" data-id="${v.idVeiculo}" onclick="AdminEstoqueController.toggleWidgetEdicaoSelection(${v.idVeiculo})">
          <input type="checkbox" class="widget-item-checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); AdminEstoqueController.toggleWidgetEdicaoSelection(${v.idVeiculo})"/>
          <div class="widget-item-label">
            <span class="widget-item-title">${v.marca} ${v.modelo} (${v.anoFabricacao})</span>
            <span class="widget-item-meta">Placa: ${v.placa}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  toggleWidgetEdicaoSelection(id) {
    if (this.editSelectedVehicleIds.has(id)) {
      this.editSelectedVehicleIds.delete(id);
    } else {
      this.editSelectedVehicleIds.add(id);
    }
    this.atualizarWidgetEdicaoUI();
  },

  atualizarWidgetEdicaoUI() {
    const contador = document.getElementById('edit-p-comp-contador');
    if (contador) {
      contador.textContent = `${this.editSelectedVehicleIds.size} veículo(s) selecionado(s)`;
    }

    const items = document.querySelectorAll('#edit-p-comp-lista .widget-item');
    items.forEach(item => {
      const id = Number(item.dataset.id);
      const isChecked = this.editSelectedVehicleIds.has(id);
      const checkbox = item.querySelector('.widget-item-checkbox');

      if (isChecked) {
        item.classList.add('checked');
      } else {
        item.classList.remove('checked');
      }
      if (checkbox) {
        checkbox.checked = isChecked;
      }
    });

    if (this.editSelectedVehicleIds.size > 0) {
      document.getElementById('edit-p-compatibilidade-container')?.classList.remove('error');
    }
  }
};

// Vincula no window para cliques do acordeon/tabela renderizados em string
window.AdminEstoqueController = AdminEstoqueController;

AdminEstoqueController.init();
