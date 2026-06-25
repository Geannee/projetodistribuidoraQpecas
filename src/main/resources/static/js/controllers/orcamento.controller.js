const OrcamentoController = {
  subtotalItens: 0,
  valorServicos: 0,
  orcamentosList: [],

  init() {
    if (!Auth.check()) return;

    // Preenche dados do usuario logado
    if (typeof SharedView !== 'undefined' && SharedView.preencherUsuario) {
      SharedView.preencherUsuario();
    }
    this.preencherDadosMecanico();

    // Inicializa no modo listagem de orçamentos
    this.showListView();

    // Vincula os eventos
    this.bindEvents();
  },

  preencherDadosMecanico() {
    const qpNome = sessionStorage.getItem('qp_nome');
    const qpUsuario = sessionStorage.getItem('qp_usuario');

    const mecanicoNomeEl = document.getElementById('mecanicoNome');
    if (mecanicoNomeEl) {
      mecanicoNomeEl.textContent = qpNome || (qpUsuario ? Auth.getNomeFormatado(qpUsuario) : 'Oficina Mecânica');
    }

    const mecanicoContatoEl = document.getElementById('mecanicoContato');
    if (mecanicoContatoEl) {
      mecanicoContatoEl.textContent = qpUsuario || 'suporte@queropecas.com.br';
    }
  },

  inicializarCabecalho() {
    const dataEmissaoEl = document.getElementById('pdfDataEmissao');
    if (dataEmissaoEl) {
      dataEmissaoEl.textContent = new Date().toLocaleDateString('pt-BR');
    }

    const numOrcamentoEl = document.getElementById('pdfNumOrcamento');
    if (numOrcamentoEl) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const currentYear = new Date().getFullYear();
      numOrcamentoEl.textContent = `${randomNum}/${currentYear}`;
    }
  },

  async carregarOrcamentos() {
    try {
      const orcamentos = await OrcamentoModel.getOrcamentos();
      this.orcamentosList = orcamentos;
      this.renderOrcamentos();
    } catch (error) {
      console.error("Erro ao carregar orçamentos:", error);
      alert("Erro ao carregar lista de orçamentos: " + error.message);
    }
  },

  renderOrcamentos() {
    const listContainer = document.getElementById('orcamentoListContainer');
    const emptyState = document.getElementById('orcamentoEmptyState');
    const tableContainer = document.getElementById('orcamentoTableContainer');
    const tbody = document.getElementById('tbodyOrcamentos');

    if (!listContainer) return;

    if (!this.orcamentosList || this.orcamentosList.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (tableContainer) tableContainer.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';

    if (tbody) {
      tbody.innerHTML = this.orcamentosList.map(o => {
        const dataFormatted = o.dataHora
          ? new Date(o.dataHora).toLocaleString('pt-BR')
          : '--/--/---- --:--';
        return `
          <tr>
            <td><strong>Nº ${String(o.idOrcamento).padStart(6, '0')}</strong></td>
            <td>${o.nomeCliente || 'N/A'}</td>
            <td>${o.emailCliente || 'N/A'}</td>
            <td>${dataFormatted}</td>
            <td align="right" style="font-weight:600; color:var(--green);">${this.fmt(o.valorTotal || 0)}</td>
            <td align="center">
              <button class="btn-print" onclick="OrcamentoController.visualizarOrcamento(${o.idOrcamento})" style="padding: 6px 12px; font-size: 12px; border: 1px solid var(--coral); border-radius: 4px; background: transparent; color: var(--coral); cursor: pointer; font-weight: 600;">
                Visualizar / PDF
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  },

  showCreateView() {
    const listContainer = document.getElementById('orcamentoListContainer');
    const pdfContainer = document.getElementById('orcamentoPdfContainer');

    if (listContainer) listContainer.style.display = 'none';
    if (pdfContainer) pdfContainer.style.display = 'block';

    // Configura cabeçalho para novo orçamento
    this.inicializarCabecalho();

    // Habilita os campos
    this.setCamposReadOnly(false);

    // Carrega itens do carrinho
    this.carregarItens();
    this.valorServicos = 0;
    const totalServicosEl = document.getElementById('totalServicos');
    if (totalServicosEl) {
      totalServicosEl.textContent = this.fmt(0);
    }
    this.atualizarTotais();

    // Mostra botão de salvar
    const btnSave = document.querySelector('.btn-save-doc');
    if (btnSave) {
      btnSave.style.display = 'inline-block';
      btnSave.disabled = false;
      btnSave.textContent = 'Salvar e Finalizar Orçamento';
    }
  },

  showListView() {
    const listContainer = document.getElementById('orcamentoListContainer');
    const pdfContainer = document.getElementById('orcamentoPdfContainer');

    if (pdfContainer) pdfContainer.style.display = 'none';
    if (listContainer) listContainer.style.display = 'block';

    // Recarrega a lista
    this.carregarOrcamentos();
  },

  setCamposReadOnly(readonly) {
    const campos = ['nomeCliente', 'telefoneCliente', 'enderecoCliente', 'emailCliente', 'detalhesOrcamento'];
    campos.forEach(cId => {
      const el = document.getElementById(cId);
      if (el) {
        el.readOnly = readonly;
        el.disabled = readonly;
        if (!readonly) {
          el.value = '';
        }
      }
    });

    const totalServicosEl = document.getElementById('totalServicos');
    if (totalServicosEl) {
      totalServicosEl.contentEditable = !readonly;
      totalServicosEl.style.borderBottom = readonly ? 'none' : '1px dashed var(--coral)';
    }
  },

  visualizarOrcamento(id) {
    const o = this.orcamentosList.find(orc => orc.idOrcamento === id);
    if (!o) return;

    const listContainer = document.getElementById('orcamentoListContainer');
    const pdfContainer = document.getElementById('orcamentoPdfContainer');

    if (listContainer) listContainer.style.display = 'none';
    if (pdfContainer) pdfContainer.style.display = 'block';

    // Preenche cabeçalho
    const numOrcamentoEl = document.getElementById('pdfNumOrcamento');
    if (numOrcamentoEl) {
      numOrcamentoEl.textContent = `Nº ${String(o.idOrcamento).padStart(6, '0')}`;
    }

    const dataEmissaoEl = document.getElementById('pdfDataEmissao');
    if (dataEmissaoEl) {
      const dataFormatted = o.dataHora
        ? new Date(o.dataHora).toLocaleString('pt-BR')
        : '--/--/---- --:--';
      dataEmissaoEl.textContent = dataFormatted;
    }

    // Preenche dados do cliente
    const campos = {
      'nomeCliente': o.nomeCliente || '',
      'telefoneCliente': o.telefoneCliente || '',
      'enderecoCliente': o.enderecoCliente || '',
      'emailCliente': o.emailCliente || '',
      'detalhesOrcamento': o.detalhes || ''
    };
    for (const [cId, val] of Object.entries(campos)) {
      const el = document.getElementById(cId);
      if (el) {
        el.value = val;
      }
    }

    this.setCamposReadOnly(true);

    // Renderiza peças do orçamento
    const container = document.getElementById('pecasEscolhidasOrcamento');
    if (container) {
      if (!o.pecas || o.pecas.length === 0) {
        container.innerHTML = `
          <p class="empty-table-msg">Nenhuma peça no orçamento.</p>
        `;
        this.subtotalItens = 0;
      } else {
        this.subtotalItens = o.pecas.reduce((sum, item) => sum + ((item.precoCobrado || 0) * (item.quantidade || 0)), 0);

        let html = `
          <table class="orcamento-table">
            <thead>
              <tr>
                <th align="left">Peça / Componente</th>
                <th align="center">Código / Ref.</th>
                <th align="center">Qtd</th>
                <th align="right">Preço Unit.</th>
                <th align="right">Total</th>
              </tr>
            </thead>
            <tbody>
        `;

        o.pecas.forEach(item => {
          html += `
            <tr>
              <td>${item.nome || 'Sem nome'}</td>
              <td align="center">${item.codigo || 'N/A'}</td>
              <td align="center">${item.quantidade || 0}</td>
              <td align="right">${this.fmt(item.precoCobrado || 0)}</td>
              <td align="right">${this.fmt((item.precoCobrado || 0) * (item.quantidade || 0))}</td>
            </tr>
          `;
        });

        html += `
            </tbody>
          </table>
        `;
        container.innerHTML = html;
      }
    }

    // Define totais
    const totalGeral = o.valorTotal || 0;
    this.valorServicos = totalGeral - this.subtotalItens;
    if (this.valorServicos < 0) this.valorServicos = 0;

    const totalServicosEl = document.getElementById('totalServicos');
    if (totalServicosEl) {
      totalServicosEl.textContent = this.fmt(this.valorServicos);
    }
    this.atualizarTotais();

    // Esconde botão de salvar
    const btnSave = document.querySelector('.btn-save-doc');
    if (btnSave) {
      btnSave.style.display = 'none';
    }
  },

  carregarItens() {
    const container = document.getElementById('pecasEscolhidasOrcamento');
    if (!container) return;

    const items = typeof Cart !== 'undefined' ? Cart.get() : [];

    if (items.length === 0) {
      container.innerHTML = `
        <p class="empty-table-msg">Nenhuma peça adicionada do catálogo. Clique em "+ Add" acima para incluir peças.</p>
      `;
      this.subtotalItens = 0;
      this.atualizarTotais();
      return;
    }

    // Calcula subtotal
    this.subtotalItens = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    // Renderiza tabela premium
    let html = `
      <table class="orcamento-table">
        <thead>
          <tr>
            <th align="left">Peça / Componente</th>
            <th align="center">Código / Ref.</th>
            <th align="center">Marca / Fabricante</th>
            <th align="center">Qtd</th>
            <th align="right">Preço Unit.</th>
            <th align="right">Total</th>
          </tr>
        </thead>
        <tbody>
    `;

    items.forEach(item => {
      html += `
        <tr>
          <td>${item.name || 'Sem nome'}</td>
          <td align="center">${item.ref || 'N/A'}</td>
          <td align="center">${item.brand || 'N/A'}</td>
          <td align="center">${item.qty}</td>
          <td align="right">${this.fmt(item.price)}</td>
          <td align="right">${this.fmt(item.price * item.qty)}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;
    this.atualizarTotais();
  },

  fmt(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  },

  parseCurrency(str) {
    if (!str) return 0;
    const clean = str.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const val = parseFloat(clean);
    return isNaN(val) ? 0 : val;
  },

  atualizarTotais() {
    const totalItensEl = document.getElementById('totalItens');
    if (totalItensEl) {
      totalItensEl.textContent = this.fmt(this.subtotalItens);
    }

    const totalGeralEl = document.getElementById('totalGeral');
    if (totalGeralEl) {
      const totalGeral = this.subtotalItens + this.valorServicos;
      totalGeralEl.textContent = this.fmt(totalGeral);
    }
  },

  bindEvents() {
    // Escuta mudanca em Mao de Obra
    const totalServicosEl = document.getElementById('totalServicos');
    if (totalServicosEl) {
      totalServicosEl.addEventListener('input', () => {
        const textVal = totalServicosEl.textContent.trim();
        this.valorServicos = this.parseCurrency(textVal);
        this.atualizarTotais();
      });

      totalServicosEl.addEventListener('focus', () => {
        // Remove R$ e espacos para facilitar edicao
        let currentText = totalServicosEl.textContent.trim();
        currentText = currentText.replace('R$', '').trim();
        if (currentText === '0,00') {
          totalServicosEl.textContent = '';
        } else {
          totalServicosEl.textContent = currentText;
        }
      });

      totalServicosEl.addEventListener('blur', () => {
        const textVal = totalServicosEl.textContent.trim();
        this.valorServicos = this.parseCurrency(textVal);
        totalServicosEl.textContent = this.fmt(this.valorServicos);
        this.atualizarTotais();
      });
    }

    // Botao Imprimir
    const btnPrint = document.querySelector('.btn-print');
    if (btnPrint) {
      btnPrint.addEventListener('click', () => {
        window.print();
      });
    }

    // Botao Salvar
    const btnSave = document.querySelector('.btn-save-doc');
    if (btnSave) {
      btnSave.addEventListener('click', (e) => {
        e.preventDefault();
        this.salvarOrcamento();
      });
    }
  },

  async salvarOrcamento() {
    const nomeCliente = document.getElementById('nomeCliente')?.value?.trim();
    const emailCliente = document.getElementById('emailCliente')?.value?.trim();
    const telefoneCliente = document.getElementById('telefoneCliente')?.value?.trim() || '';
    const enderecoCliente = document.getElementById('enderecoCliente')?.value?.trim() || '';
    const detalhes = document.getElementById('detalhesOrcamento')?.value?.trim() || '';
    const idUsuarioLogado = sessionStorage.getItem('qp_id');

    if (!nomeCliente) {
      alert('Por favor, preencha o Nome do Cliente.');
      document.getElementById('nomeCliente')?.focus();
      return;
    }

    if (!emailCliente) {
      alert('Por favor, preencha o E-mail do Cliente.');
      document.getElementById('emailCliente')?.focus();
      return;
    }

    const items = typeof Cart !== 'undefined' ? Cart.get() : [];
    if (items.length === 0) {
      alert('Seu carrinho está vazio! Adicione peças no catálogo antes de salvar o orçamento.');
      return;
    }

    const btnSave = document.querySelector('.btn-save-doc');
    if (btnSave) {
      btnSave.disabled = true;
      btnSave.textContent = 'Salvando...';
    }

    const itensRequest = items.map(item => {
      const parteAntesDoTraco = item.ref.includes(' — ')
        ? item.ref.split(' — ')[0]
        : item.ref;
      const apenasNumeros = parteAntesDoTraco.replace(/\D/g, '');
      const idLimpo = parseInt(apenasNumeros, 10);

      return {
        idPeca: isNaN(idLimpo) ? 1 : idLimpo,
        quantidade: item.qty
      };
    });

    const totalGeral = this.subtotalItens + this.valorServicos;

    const payload = {
      nomeCliente,
      emailCliente,
      telefoneCliente,
      enderecoCliente,
      itens: itensRequest,
      valorTotal: totalGeral,
      detalhes: detalhes || 'Nenhum detalhe inserido.',
      idUsuario: idUsuarioLogado ? parseInt(idUsuarioLogado, 10) : null
    };

    try {
      await OrcamentoModel.salvarOrcamento(payload);

      // Limpa carrinho local
      if (typeof Cart !== 'undefined') {
        Cart.save([]);
        Cart.updateBadge();
      }

      alert('Orçamento criado com sucesso!');

      // Retorna para a lista de orçamentos
      this.showListView();

    } catch (error) {
      alert('Erro ao salvar orçamento: ' + error.message);
      if (btnSave) {
        btnSave.disabled = false;
        btnSave.textContent = 'Salvar e Finalizar Orçamento';
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  OrcamentoController.init();
});
