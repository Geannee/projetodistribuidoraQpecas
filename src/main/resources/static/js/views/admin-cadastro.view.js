// ── ADMIN CADASTRO VIEW ────────────────────────────────────────────────────────
// Renderização das tabelas de veículos e peças cadastrados
// ─────────────────────────────────────────────────────────────────────────────

const AdminCadastroView = {

  // ── TOAST ──────────────────────────────────────────────────────────────────

  showToast(msg, tipo = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className   = `toast toast-${tipo} show`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => { el.className = 'toast'; }, 3000);
  },

  // ── CAMPOS COM ERRO ────────────────────────────────────────────────────────

  marcarErro(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('error');
  },

  limparErros(ids) {
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.remove('error');
    });
  },

  // ── TABELA VEÍCULOS ────────────────────────────────────────────────────────

  renderVeiculos(veiculos) {
    const tbody = document.getElementById('tbody-veiculos');
    const count = document.getElementById('count-veiculos');
    if (!tbody) return;

    if (count) count.textContent = `${veiculos.length} registro${veiculos.length !== 1 ? 's' : ''}`;

    if (veiculos.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" class="empty-row">Nenhum veículo cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = veiculos.map(v => `
      <tr>
        <td><strong>${v.placa}</strong></td>
        <td>${v.marca} ${v.modelo}</td>
        <td>${v.anoFabricacao}</td>
        <td>${v.tipoDeCompustivel}</td>
        <td style="font-size:12px;color:var(--gray-text)">${v.chassi}</td>
        <td>
          <button class="btn-excluir" onclick="AdminCadastroController.excluirVeiculo(${v.idVeiculo})">
            Excluir
          </button>
        </td>
      </tr>
    `).join('');
  },

  // ── TABELA PEÇAS ───────────────────────────────────────────────────────────

  renderPecas(pecas) {
    const tbody = document.getElementById('tbody-pecas');
    const count = document.getElementById('count-pecas');
    if (!tbody) return;

    if (count) count.textContent = `${pecas.length} registro${pecas.length !== 1 ? 's' : ''}`;

    if (pecas.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-row">Nenhuma peça cadastrada.</td></tr>';
      return;
    }

    tbody.innerHTML = pecas.map(p => {
      const estoqueClass = p.estoque === 0 ? 'estoque-zero' : p.estoque <= 3 ? 'estoque-low' : 'estoque-ok';
      const estoqueLabel = p.estoque === 0 ? 'Sem estoque' : p.estoque <= 3 ? `Baixo (${p.estoque})` : p.estoque;
      const preco = p.precoBase.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
      return `
        <tr>
          <td><code style="font-size:12px">${p.codigo}</code></td>
          <td>
            <div style="font-weight:600">${p.nome}</div>
            <div style="font-size:11px;color:var(--gray-text)">${p.tipoPeca}</div>
            <!--TODO: MUDAR  ESSE TIPO DE PECA POR COMPATIBILIDADE-->
          </td>
          <td>${p.categoria}</td>
          <td>${p.fornecedor}</td>
          <td><strong>${preco}</strong></td>
          <td><span class="badge-estoque ${estoqueClass}">${estoqueLabel}</span></td>
          <td>
            <button class="btn-excluir" onclick="AdminCadastroController.excluirPeca(${p.idPeca})">
              Excluir
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
};