const OrcamentoController = {
  subtotalItens: 0,
  valorServicos: 0,

  init() {
    if (!Auth.check()) return;

    // Preenche dados do usuario logado (SharedView or local check)
    if (typeof SharedView !== 'undefined' && SharedView.preencherUsuario) {
      SharedView.preencherUsuario();
    }
    this.preencherDadosMecanico();
    
    // Inicializa a data de emissao e numero do orcamento
    this.inicializarCabecalho();

    // Carrega itens do carrinho local
    this.carregarItens();

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
      
      // Redireciona para dashboard/pagina principal
      window.location.href = 'dashboard.html';

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
