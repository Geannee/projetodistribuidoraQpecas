// ── ADMIN AUDITORIA VIEW ───────────────────────────────────────────────────────

const AuditoriaView = {

  BADGE: {
    LOGIN:           'acao-login',
    SENHA_ERRADA:    'acao-senha-errada',
    ACESSO_LIBERADO: 'acao-acesso-liberado',
    CADASTRO_VEICULO:'acao-cadastro',
    CADASTRO_PECA:   'acao-cadastro',
    EXCLUSAO:        'acao-exclusao'
  },

  LABEL: {
    LOGIN:           'Login',
    SENHA_ERRADA:    'Senha errada',
    ACESSO_LIBERADO: 'Acesso liberado',
    CADASTRO_VEICULO:'Cadastro veículo',
    CADASTRO_PECA:   'Cadastro peça',
    EXCLUSAO:        'Exclusão'
  },

  renderStats(logs) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('stat-total',      logs.length);
    set('stat-senhas',     logs.filter(l => l.acao === 'SENHA_ERRADA').length);
    set('stat-cadastros',  logs.filter(l => l.acao.startsWith('CADASTRO')).length);
    set('stat-liberacoes', logs.filter(l => l.acao === 'ACESSO_LIBERADO').length);
  },

  renderTabela(logs, pagina = 1, porPagina = 12) {
    const tbody = document.getElementById('tbody-auditoria');
    const count = document.getElementById('count-logs');
    if (!tbody) return;

    const total = logs.length;
    const inicio = (pagina - 1) * porPagina;
    const pagina_logs = logs.slice(inicio, inicio + porPagina);

    if (count) count.textContent = `${total} registro${total !== 1 ? 's' : ''}`;

    if (!total) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Nenhum registro encontrado.</td></tr>';
      this.renderPaginacao(0, 0, 1);
      return;
    }

    tbody.innerHTML = pagina_logs.map(l => {
      const cls   = this.BADGE[l.acao] || 'acao-outro';
      const label = this.LABEL[l.acao] || l.acao;
      return `
        <tr>
          <td style="white-space:nowrap;font-size:12px">${l.dataHora}</td>
          <td>${l.usuario}</td>
          <td><span class="badge-acao ${cls}">${label}</span></td>
          <td style="font-size:12px;color:var(--gray-text)">${l.detalhe}</td>
          <td style="font-size:12px;color:var(--gray-text)">${l.ip}</td>
        </tr>
      `;
    }).join('');

    this.renderPaginacao(total, porPagina, pagina);
  },

  renderPaginacao(total, porPagina, atual) {
    const el = document.getElementById('paginacao');
    if (!el) return;
    const totalPag = Math.ceil(total / porPagina);
    if (totalPag <= 1) { el.innerHTML = ''; return; }
    let html = '';
    for (let i = 1; i <= totalPag; i++) {
      html += `<button class="pag-btn ${i === atual ? 'current' : ''}" onclick="AuditoriaController.irPagina(${i})">${i}</button>`;
    }
    el.innerHTML = html;
  }
};
