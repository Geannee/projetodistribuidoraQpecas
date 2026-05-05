// ── ADMIN SOLICITAÇÕES VIEW ────────────────────────────────────────────────────

const SolicitacoesView = {

  renderStats(lista) {
    const total    = lista.length;
    const pend     = lista.filter(s => s.status === 'pendente').length;
    const aprov    = lista.filter(s => s.status === 'aprovado').length;
    const recus    = lista.filter(s => s.status === 'recusado').length;

    document.getElementById('stat-total').textContent    = total;
    document.getElementById('stat-pendente').textContent = pend;
    document.getElementById('stat-aprovado').textContent = aprov;
    document.getElementById('stat-recusado').textContent = recus;
  },

  renderTabela(tbody, lista) {
    if (lista.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:48px;color:#9CA3AF;">
            Nenhuma solicitação encontrada.
          </td>
        </tr>`;
      return;
    }

    tbody.innerHTML = lista.map(s => `
      <tr class="sol-row" id="sol-row-${s.id}">
        <td class="sol-id">${s.id}</td>
        <td>
          <div class="sol-nome">${s.nomeOficina}</div>
          <div class="sol-razao">${s.razao}</div>
        </td>
        <td>${s.responsavel}</td>
        <td>${s.cnpj}</td>
        <td>${s.cidade} / ${s.estado}</td>
        <td>${s.dataEnvio}</td>
        <td>
          <span class="sol-badge ${SolicitacoesModel.statusClasse[s.status]}">
            ${SolicitacoesModel.statusLabel[s.status]}
          </span>
        </td>
        <td>
          <button class="btn-ver-sol" id="btn-sol-${s.id}"
            onclick="SolicitacoesController.toggleDetalhe('${s.id}')">
            Ver detalhes ▾
          </button>
        </td>
      </tr>
      <tr class="sol-detalhe-row" id="sol-det-${s.id}">
        <td colspan="8" class="sol-detalhe-td">
          ${this.renderPainel(s)}
        </td>
      </tr>
    `).join('');
  },

  renderPainel(s) {
    const podeAprovar = s.status !== 'aprovado';
    const podeRecusar = s.status !== 'recusado';

    return `
      <div class="sol-painel">

        <div class="sol-secao">
          <div class="sol-secao-titulo">🏢 Dados da Empresa</div>
          <div class="sol-grid">
            <div class="sol-campo"><span class="sol-label">CNPJ</span><span class="sol-valor">${s.cnpj}</span></div>
            <div class="sol-campo"><span class="sol-label">Razão Social</span><span class="sol-valor">${s.razao}</span></div>
            <div class="sol-campo"><span class="sol-label">Nome da Oficina</span><span class="sol-valor">${s.nomeOficina}</span></div>
            <div class="sol-campo"><span class="sol-label">Especialidade</span><span class="sol-valor">${s.especialidade || '—'}</span></div>
          </div>
        </div>

        <div class="sol-secao">
          <div class="sol-secao-titulo">📍 Endereço</div>
          <div class="sol-grid">
            <div class="sol-campo"><span class="sol-label">Logradouro</span><span class="sol-valor">${s.logradouro}, ${s.numero}</span></div>
            <div class="sol-campo"><span class="sol-label">Bairro</span><span class="sol-valor">${s.bairro}</span></div>
            <div class="sol-campo"><span class="sol-label">Cidade / UF</span><span class="sol-valor">${s.cidade} / ${s.estado}</span></div>
            <div class="sol-campo"><span class="sol-label">CEP</span><span class="sol-valor">${s.cep}</span></div>
          </div>
        </div>

        <div class="sol-secao">
          <div class="sol-secao-titulo">👤 Responsável</div>
          <div class="sol-grid">
            <div class="sol-campo"><span class="sol-label">Nome</span><span class="sol-valor">${s.responsavel}</span></div>
            <div class="sol-campo"><span class="sol-label">Telefone</span><span class="sol-valor">${s.telefone}</span></div>
            <div class="sol-campo"><span class="sol-label">E-mail</span><span class="sol-valor">${s.email}</span></div>
            <div class="sol-campo"><span class="sol-label">Data de Envio</span><span class="sol-valor">${s.dataEnvio}</span></div>
          </div>
        </div>

        <div class="sol-acoes">
          <div class="sol-acoes-titulo">Decisão do cadastro</div>
          <div class="sol-acoes-btns">
            <button class="btn-aprovar" id="btn-aprovar-${s.id}"
              onclick="SolicitacoesController.aprovar('${s.id}')"
              ${!podeAprovar ? 'disabled' : ''}>
              ✅ Aprovar cadastro
            </button>
            <button class="btn-recusar" id="btn-recusar-${s.id}"
              onclick="SolicitacoesController.recusar('${s.id}')"
              ${!podeRecusar ? 'disabled' : ''}>
              ❌ Recusar cadastro
            </button>
          </div>
          ${s.dataDecisao ? `<div class="sol-decisao-data">Decisão registrada em ${s.dataDecisao}</div>` : ''}
        </div>

      </div>`;
  },

  renderRodape(el, total, filtrado) {
    el.textContent = `Mostrando ${filtrado} de ${total} solicitações`;
  },

  mostrarToast(msg, tipo = 'ok') {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent  = msg;
    t.className    = `toast toast-${tipo} ativo`;
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove('ativo'), 3000);
  }
};
