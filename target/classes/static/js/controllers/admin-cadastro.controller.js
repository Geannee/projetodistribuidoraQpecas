// ── ADMIN CADASTRO CONTROLLER ──────────────────────────────────────────────────
// Orquestra o formulário de cadastro de veículos e peças
// ─────────────────────────────────────────────────────────────────────────────

const AdminCadastroController = {
  veiculos: [],
  selectedVehicleIds: new Set(),

  init() {
    if (!Auth.checkAdmin()) return;
    this.veiculos = [];
    this.selectedVehicleIds = new Set();
    this._bindForms();
    this._bindWidgetEvents();
    this._renderListas();
  },

  // ── BIND ───────────────────────────────────────────────────────────────────
  _bindForms() {
    document.getElementById('form-veiculo')
      ?.addEventListener('submit', e => { e.preventDefault(); this.submeterVeiculo(); });

    document.getElementById('form-peca')
      ?.addEventListener('submit', e => { e.preventDefault(); this.submeterPeca(); });

    // Remove marcação de erro ao digitar
    ['v-marca','v-modelo','v-ano','v-combustivel','v-chassi','v-placa'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        document.getElementById(id)?.classList.remove('error');
      });
    });
    ['p-nome','p-sku','p-preco','p-estoque','p-fornecedor','p-categoria','p-tipo'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        document.getElementById(id)?.classList.remove('error');
      });
    });
  },

  _bindWidgetEvents() {
    const buscaInput = document.getElementById('p-comp-busca');
    const filtroMarca = document.getElementById('p-comp-filtro-marca');
    const btnTodos = document.getElementById('p-comp-btn-todos');
    const btnNenhum = document.getElementById('p-comp-btn-nenhum');

    buscaInput?.addEventListener('input', () => this._filtrarERenderizarWidget());
    filtroMarca?.addEventListener('change', () => this._filtrarERenderizarWidget());

    btnTodos?.addEventListener('click', () => {
      const filtered = this._getFilteredVeiculos();
      filtered.forEach(v => this.selectedVehicleIds.add(v.idVeiculo));
      this._atualizarWidgetUI();
    });

    btnNenhum?.addEventListener('click', () => {
      const filtered = this._getFilteredVeiculos();
      filtered.forEach(v => this.selectedVehicleIds.delete(v.idVeiculo));
      this._atualizarWidgetUI();
    });
  },

  // ── WIDGET COMPATIBILIDADE DE VEÍCULOS ──────────────────────────────────────
  _getFilteredVeiculos() {
    const query = document.getElementById('p-comp-busca')?.value.toLowerCase().trim() || '';
    const nameFilter = document.getElementById('p-comp-filtro-marca')?.value || '';

    return this.veiculos.filter(v => {
      if (nameFilter && v.marca !== nameFilter) return false;
      if (query) {
        const text = `${v.marca} ${v.modelo} ${v.anoFabricacao} ${v.placa}`.toLowerCase();
        if (!text.includes(query)) return false;
      }
      return true;
    });
  },

  _filtrarERenderizarWidget() {
    const filtered = this._getFilteredVeiculos();
    const listaContainer = document.getElementById('p-comp-lista');
    if (!listaContainer) return;

    if (this.veiculos.length === 0) {
      listaContainer.innerHTML = '<div style="grid-column: span 2; padding: 12px; color: var(--gray-text); text-align: center;">Nenhum veículo cadastrado. Cadastre um veículo primeiro.</div>';
      return;
    }

    if (filtered.length === 0) {
      listaContainer.innerHTML = '<div style="grid-column: span 2; padding: 12px; color: var(--gray-text); text-align: center;">Nenhum veículo correspondente.</div>';
      return;
    }

    listaContainer.innerHTML = filtered.map(v => {
      const isChecked = this.selectedVehicleIds.has(v.idVeiculo);
      return `
        <div class="widget-item ${isChecked ? 'checked' : ''}" data-id="${v.idVeiculo}" onclick="AdminCadastroController.toggleWidgetSelection(${v.idVeiculo})">
          <input type="checkbox" class="widget-item-checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); AdminCadastroController.toggleWidgetSelection(${v.idVeiculo})"/>
          <div class="widget-item-label">
            <span class="widget-item-title">${v.marca} ${v.modelo} (${v.anoFabricacao})</span>
            <span class="widget-item-meta">Placa: ${v.placa}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  toggleWidgetSelection(id) {
    if (this.selectedVehicleIds.has(id)) {
      this.selectedVehicleIds.delete(id);
    } else {
      this.selectedVehicleIds.add(id);
    }
    this._atualizarWidgetUI();
  },

  _atualizarWidgetUI() {
    const contador = document.getElementById('p-comp-contador');
    if (contador) {
      contador.textContent = `${this.selectedVehicleIds.size} veículo(s) selecionado(s)`;
    }

    const items = document.querySelectorAll('#p-comp-lista .widget-item');
    items.forEach(item => {
      const id = Number(item.dataset.id);
      const isChecked = this.selectedVehicleIds.has(id);
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

    if (this.selectedVehicleIds.size > 0) {
      document.getElementById('p-compatibilidade-container')?.classList.remove('error');
    }
  },

  // ── LISTAS ─────────────────────────────────────────────────────────────────
  async _renderListas() {
    const veiculos = await AdminCadastroModel.getVeiculos();
    this.veiculos = veiculos;
    AdminCadastroView.renderVeiculos(veiculos);

    // Popular filtro de marcas do widget
    const filtroMarca = document.getElementById('p-comp-filtro-marca');
    if (filtroMarca) {
      const marcasUnicas = [...new Set(veiculos.map(v => v.marca))].sort();
      filtroMarca.innerHTML = '<option value="">Todas as Marcas</option>' +
        marcasUnicas.map(m => `<option value="${m}">${m}</option>`).join('');
    }

    // Renderizar lista inicial do widget
    this._filtrarERenderizarWidget();
    this._atualizarWidgetUI();

    // Populate manufacturers select dropdown
    const selectFornecedor = document.getElementById('p-fornecedor');
    if (selectFornecedor) {
      const fornecedores = await AdminCadastroModel.getFornecedores();
      if (fornecedores.length === 0) {
        selectFornecedor.innerHTML = '<option value="" disabled>Nenhum fabricante cadastrado. Cadastre um fabricante primeiro.</option>';
      } else {
        selectFornecedor.innerHTML = '<option value="">Selecione...</option>' + fornecedores.map(f =>
          `<option value="${f.idFabricante}">${f.nome}</option>`
        ).join('');
      }
    }

    if (document.getElementById('tbody-pecas')) {
      AdminCadastroView.renderPecas(await AdminCadastroModel.getPecas());
    }
  },

  // ── VEÍCULO ────────────────────────────────────────────────────────────────

  async submeterVeiculo() {
    const campos = {
      marca:       document.getElementById('v-marca')?.value.trim(),
      modelo:      document.getElementById('v-modelo')?.value.trim(),
      ano:         document.getElementById('v-ano')?.value.trim(),
      combustivel: document.getElementById('v-combustivel')?.value,
      chassi:      document.getElementById('v-chassi')?.value.trim(),
      placa:       document.getElementById('v-placa')?.value.trim(),
      obs:         document.getElementById('v-obs')?.value.trim()
    };

    const erros = this._validarVeiculo(campos);
    if (erros.length) {
      erros.forEach(id => AdminCadastroView.marcarErro(id));
      AdminCadastroView.showToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    try {
      // 1. Envia para o servidor e espera a resposta
      await AdminCadastroModel.salvarVeiculo(campos);

      // 2. Só limpa e avisa se o 'await' acima deu certo
      AdminCadastroView.showToast('Veículo cadastrado com sucesso!', 'success');
      this.limparVeiculo();

      // 3. ATENÇÃO: Agora precisamos buscar a lista atualizada do BANCO
      const listaAtualizada = await AdminCadastroModel.getVeiculos();
      AdminCadastroView.renderVeiculos(listaAtualizada);

    } catch (error) {
      // 4. Se o Java der erro, ele cai aqui e te avisa no Toast
      console.error("Erro ao salvar:", error);
      AdminCadastroView.showToast('Erro ao salvar no banco: ' + error.message, 'error');
    }
  },

  async _validarVeiculo(c) {
    const erros = [];
    if (!c.marca)       erros.push('v-marca');
    if (!c.modelo)      erros.push('v-modelo');
    if (!c.ano || isNaN(c.ano) || c.ano < 1950 || c.ano > 2030) erros.push('v-ano');
    if (!c.combustivel) erros.push('v-combustivel');
    if (!c.chassi || c.chassi.length < 11) erros.push('v-chassi');
    if (!c.placa  || c.placa.length  < 7)  erros.push('v-placa');

    const placaExiste = await AdminCadastroModel.placaExiste(c.placa)
    if (!erros.includes('v-placa') && placaExiste) {
      AdminCadastroView.showToast(`Placa ${c.placa.toUpperCase()} já cadastrada.`, 'error');
      erros.push('v-placa');
    }
    return erros;
  },

  limparVeiculo() {
    const ids = ['v-marca','v-modelo','v-ano','v-combustivel','v-chassi','v-placa','v-obs'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error'); }
    });
  },

  async excluirVeiculo(id) {
    if (!confirm('Excluir este veículo?')) return;
    try {
      await AdminCadastroModel.excluirVeiculo(id);

      AdminCadastroView.showToast('Veículo removido com sucesso!', 'success');

      const listaAtualizada = await AdminCadastroModel.getVeiculos();
      AdminCadastroView.renderVeiculos(listaAtualizada);

    } catch (error) {
      AdminCadastroView.showToast('Não foi possível excluir o veículo.', 'error');
    }
  },

  // ── PEÇA ───────────────────────────────────────────────────────────────────

  async submeterPeca() {
    const campos = {
      nome:            document.getElementById('p-nome')?.value.trim(),
      sku:             document.getElementById('p-sku')?.value.trim(),
      compatibilidade: Array.from(this.selectedVehicleIds),
      preco:           document.getElementById('p-preco')?.value.trim(),
      estoque:         document.getElementById('p-estoque')?.value.trim(),
      fabricanteId:    document.getElementById('p-fornecedor')?.value,
      categoria:       document.getElementById('p-categoria')?.value,
      tipo:            document.getElementById('p-tipo')?.value
    };

    const erros = await this._validarPeca(campos);
    if (erros.length) {
      erros.forEach(id => AdminCadastroView.marcarErro(id));
      AdminCadastroView.showToast('Preencha os campos obrigatórios.', 'error');
      return;
    }

    await AdminCadastroModel.salvarPeca(campos);
    AdminCadastroView.showToast('Peça cadastrada com sucesso!', 'success');
    this.limparPeca();
    if (document.getElementById('tbody-pecas')) {
      const listaAtualizada = await AdminCadastroModel.getPecas();
      AdminCadastroView.renderPecas(listaAtualizada);
    }
  },

  async _validarPeca(c) {
    const erros = [];
    if (!c.nome)            erros.push('p-nome');
    if (!c.sku)             erros.push('p-sku');
    if (!c.compatibilidade || c.compatibilidade.length === 0) erros.push('p-compatibilidade-container');
    if (!c.preco || isNaN(parseFloat(c.preco.replace(',', '.')))) erros.push('p-preco');
    if (!c.estoque || isNaN(Number(c.estoque)) || Number(c.estoque) < 0) erros.push('p-estoque');
    if (!c.fabricanteId)    erros.push('p-fornecedor');
    if (!c.categoria)       erros.push('p-categoria');
    if (!c.tipo)            erros.push('p-tipo');

    const skuExiste = await AdminCadastroModel.skuExiste(c.sku);
    if (!erros.includes('p-sku') && skuExiste) {
      AdminCadastroView.showToast(`SKU "${c.sku}" já cadastrado.`, 'error');
      erros.push('p-sku');
    }
    return erros;
  },

  limparPeca() {
    const ids = ['p-nome','p-sku','p-preco','p-estoque','p-fornecedor','p-categoria','p-tipo'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error'); }
    });

    this.selectedVehicleIds.clear();
    const buscaInput = document.getElementById('p-comp-busca');
    if (buscaInput) buscaInput.value = '';
    const filtroMarca = document.getElementById('p-comp-filtro-marca');
    if (filtroMarca) filtroMarca.value = '';
    document.getElementById('p-compatibilidade-container')?.classList.remove('error');

    this._filtrarERenderizarWidget();
    this._atualizarWidgetUI();
  },

  async excluirPeca(id) {
    if (!confirm('Excluir esta peça?')) return;
    try {
      await AdminCadastroModel.excluirPeca(id);

      AdminCadastroView.showToast('Veículo removido com sucesso!', 'success');

      if (document.getElementById('tbody-pecas')) {
        const listaAtualizada = await AdminCadastroModel.getPecas();
        AdminCadastroView.renderPecas(listaAtualizada);
      }

    } catch (error) {
      AdminCadastroView.showToast('Não foi possível excluir o veículo.', 'error');
    }
  }
};

window.AdminCadastroController = AdminCadastroController;
AdminCadastroController.init();