// ── ADMIN FORNECEDOR VIEW ───────────────────────────────────────────────────
// Renderização e feedback visual da tela de cadastro de fornecedor
// ─────────────────────────────────────────────────────────────────────────────

const AdminFornecedorView = {

  // ── TOAST ──────────────────────────────────────────────────────────────────

  showToast(msg, tipo = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className   = `toast toast-${tipo} show`;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => { el.className = 'toast'; }, 3500);
  },

  // ── ERRO DE CAMPO ──────────────────────────────────────────────────────────

  marcarErro(id) {
    document.getElementById(id)?.classList.add('error');
  },

  // ── LOADING DO BOTÃO VERIFICAR ─────────────────────────────────────────────

  setLoadingCNPJ(loading) {
    const btn = document.getElementById('btn-validar-cnpj');
    if (!btn) return;
    btn.disabled    = loading;
    btn.textContent = loading ? 'Verificando…' : 'Verificar';
  },

  setLoadingCEP(loading) {
    const btn = document.getElementById('btn-buscar-cep');
    if (!btn) return;
    btn.disabled    = loading;
    btn.textContent = loading ? 'Buscando…' : 'Buscar';
  },

  // ── PREENCHER CAMPOS VIA CNPJ ──────────────────────────────────────────────

  preencherCNPJ(dados) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.value = val;
    };
    set('f-razao-social', dados.razao_social);
    set('f-nome-fantasia', dados.nome_fantasia);

    if (dados.cnae_fiscal_descricao) {
      const cnaeEl = document.getElementById('f-cnae-principal');
      if (cnaeEl && !cnaeEl.value) {
        cnaeEl.value = `${dados.cnae_fiscal} – ${dados.cnae_fiscal_descricao}`;
      }
    }

    const ativa  = dados.descricao_situacao_cadastral === 'ATIVA' || dados.situacao_cadastral === 'ATIVA';
    const badge  = document.getElementById('cnpj-status');
    if (badge) {
      const sit = dados.descricao_situacao_cadastral || dados.situacao_cadastral || 'DESCONHECIDA';
      badge.textContent = ativa ? `✓ Situação: ${sit} na Receita Federal` : `⚠ Situação: ${sit}`;
      badge.className   = `cnpj-status-badge ${ativa ? 'ativa' : 'inativa'}`;
      badge.style.display = 'block';
    }
  },

  ocultarBadgeCNPJ() {
    const badge = document.getElementById('cnpj-status');
    if (badge) badge.style.display = 'none';
  },

  mostrarErroCNPJ() {
    const badge = document.getElementById('cnpj-status');
    if (badge) {
      badge.textContent   = '✗ CNPJ inválido ou não encontrado na Receita Federal';
      badge.className     = 'cnpj-status-badge erro';
      badge.style.display = 'block';
    }
  },

  // ── PREENCHER ENDEREÇO VIA CEP ─────────────────────────────────────────────

  preencherCEP(dados) {
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el && val) el.value = val;
    };
    set('f-logradouro', dados.logradouro);
    set('f-bairro',     dados.bairro);
    set('f-cidade',     dados.localidade);

    const ufEl = document.getElementById('f-uf');
    if (ufEl && dados.uf) {
      ufEl.value = dados.uf;
    }

    document.getElementById('f-numero')?.focus();
  },

  // ── TABELA DE FORNECEDORES ─────────────────────────────────────────────────

  renderFornecedores(lista) {
    const tbody = document.getElementById('tbody-fornecedores');
    const count = document.getElementById('count-fornecedores');
    if (!tbody) return;

    if (count) count.textContent = `${lista.length} registro${lista.length !== 1 ? 's' : ''}`;

    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="8" class="empty-row">Nenhum fornecedor cadastrado.</td></tr>';
      return;
    }

    tbody.innerHTML = lista.map(f => {
      const porteCls  = { MEI: 'porte-mei', ME: 'porte-me', EPP: 'porte-epp', Grande: 'porte-grande' }[f.porte] || '';
      return `
        <tr>
          <td>
            <div style="font-weight:600">${f.razaoSocial}</div>
            ${f.nomeFantasia ? `<div style="font-size:11px;color:var(--gray-text)">${f.nomeFantasia}</div>` : ''}
          </td>
          <td style="font-size:12px;font-family:monospace">${f.cnpj}</td>
          <td><span class="badge-porte ${porteCls}">${f.porte}</span></td>
          <td>${f.telefoneComercial || '—'}</td>
          <td>${f.emailComercial}</td>
          <td>${f.cidade}/${f.uf}</td>
          <td>${f.representante}</td>
          <td>
            <button class="btn-excluir" onclick="AdminFornecedorController.excluirFornecedor(${f.id})">
              Excluir
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }
};
