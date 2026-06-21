// ── ADMIN CADASTRO CONTROLLER ──────────────────────────────────────────────────
// Orquestra o formulário de cadastro de veículos e peças
// ─────────────────────────────────────────────────────────────────────────────

const AdminCadastroController = {

  init() {
    Auth.checkAdmin();
    this._bindForms();
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
    ['p-nome','p-sku','p-compatibilidade','p-preco','p-estoque','p-fornecedor','p-categoria','p-tipo'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', () => {
        document.getElementById(id)?.classList.remove('error');
      });
    });
  },

  // ── LISTAS ─────────────────────────────────────────────────────────────────

  async _renderListas() {
    const veiculos = await AdminCadastroModel.getVeiculos();
    AdminCadastroView.renderVeiculos(veiculos);

    // Populate compatibility select dropdown
    const selectCompatibilidade = document.getElementById('p-compatibilidade');
    if (selectCompatibilidade) {
      if (veiculos.length === 0) {
        selectCompatibilidade.innerHTML = '<option value="" disabled>Nenhum veículo cadastrado. Cadastre um veículo primeiro.</option>';
      } else {
        selectCompatibilidade.innerHTML = veiculos.map(v => 
          `<option value="${v.idVeiculo}">${v.marca} ${v.modelo} (${v.anoFabricacao}) - ${v.placa}</option>`
        ).join('');
      }
    }

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

    AdminCadastroView.renderPecas(await AdminCadastroModel.getPecas());
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
    const compatibilidadeSelect = document.getElementById('p-compatibilidade');
    let compatibilidadeIds = [];
    if (compatibilidadeSelect) {
      compatibilidadeIds = Array.from(compatibilidadeSelect.selectedOptions).map(opt => Number(opt.value));
    }
    const campos = {
      nome:            document.getElementById('p-nome')?.value.trim(),
      sku:             document.getElementById('p-sku')?.value.trim(),
      compatibilidade: compatibilidadeIds,
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
    const listaAtualizada = await AdminCadastroModel.getPecas();
    AdminCadastroView.renderPecas(listaAtualizada);
  },

  async _validarPeca(c) {
    const erros = [];
    if (!c.nome)            erros.push('p-nome');
    if (!c.sku)             erros.push('p-sku');
    if (!c.compatibilidade || c.compatibilidade.length === 0) erros.push('p-compatibilidade');
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
    const ids = ['p-nome','p-sku','p-compatibilidade','p-preco','p-estoque','p-fornecedor','p-categoria','p-tipo'];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.value = ''; el.classList.remove('error'); }
    });
  },

  async excluirPeca(id) {
    if (!confirm('Excluir esta peça?')) return;
    try {
      await AdminCadastroModel.excluirPeca(id);

      AdminCadastroView.showToast('Veículo removido com sucesso!', 'success');

      const listaAtualizada = await AdminCadastroModel.getPecas();
      AdminCadastroView.renderPecas(listaAtualizada);

    } catch (error) {
      AdminCadastroView.showToast('Não foi possível excluir o veículo.', 'error');
    }
  }
};

AdminCadastroController.init();