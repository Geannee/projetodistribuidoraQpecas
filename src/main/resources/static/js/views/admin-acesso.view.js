// ── ADMIN ACESSO VIEW ──────────────────────────────────────────────────────────

const AcessoView = {

  showToast(msg, tipo = 'success') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className   = `toast toast-${tipo} show`;
    clearTimeout(this._t);
    this._t = setTimeout(() => { el.className = 'toast'; }, 3000);
  },

  renderStats(pendentes, recusados, liberados) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set('stat-bloqueados', pendentes);
    set('stat-tentativas', recusados);
    set('stat-liberados',  liberados);
  },

  // MÉTODOS ADICIONADOS PARA SUPORTAR O CONTROLLER SEM VIOLAR O MVC:
  exibirPainelRecusa(id) {
    const inline = document.getElementById(`recusa-inline-${id}`);
    if (inline) inline.style.display = 'block';
  },

  ocultarPainelRecusa(id) {
    const inline = document.getElementById(`recusa-inline-${id}`);
    if (inline) inline.style.display = 'none';
    const input = document.getElementById(`motivo-${id}`);
    if (input) input.value = '';
  },

  getMotivoRecusa(id) {
    return document.getElementById(`motivo-${id}`)?.value.trim() || '';
  },

  focarMotivoRecusa(id) {
    document.getElementById(`motivo-${id}`)?.focus();
  },

  renderBloqueados(lista) {
    const tbody = document.getElementById('tbody-bloqueados');
    const count = document.getElementById('count-bloqueados');

    if (!tbody) return;
    if (count) count.textContent = `${lista.length} registro${lista.length !== 1 ? 's' : ''}`;

    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="empty-row">Nenhum cadastro pendente.</td></tr>';
      return;
    }

    tbody.innerHTML = lista.map(u => {
      const id = u.idUsuario;
      const enderecoFormatado = u.endereco
          ? `${u.endereco.logradouro}, ${u.endereco.numero} - ${u.endereco.cidade}/${u.endereco.estado}`
          : 'Endereço não informado';

      return `
      <tr id="row-${id}">
        <td>
          <div style="font-weight:600">${u.razaoSocial}</div> 
          <div style="font-size:11px;color:var(--gray-text)">${u.email}</div>
        </td>
        <td>${u.cnpj}</td>
        <td>${enderecoFormatado}</td>
        <td>${u.status}</td> 
        <td>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn-liberar" onclick="AcessoController.liberar(${id})">Liberar</button>
            <button class="btn-recusar" onclick="AcessoController.mostrarCampoRecusa(${id})">Recusar</button>
          </div>
          
          <div class="recusa-inline" id="recusa-inline-${id}" style="display:none;margin-top:8px">
            <input type="text" class="form-input recusa-input" id="motivo-${id}" placeholder="Informe o motivo da recusa..."/>
            <div style="display:flex;gap:6px;margin-top:6px">
              <button class="btn-confirmar-recusa" onclick="AcessoController.confirmarRecusa(${id})">Confirmar</button>
              <button class="btn-cancelar-recusa"  onclick="AcessoController.cancelarRecusa(${id})">Cancelar</button>
            </div>
          </div>
        </td>
      </tr>
      `;
    }).join('');
  },

  renderHistorico(lista) {
    const tbody = document.getElementById('tbody-historico');
    const count = document.getElementById('count-historico');
    if (!tbody) return;
    if (count) count.textContent = `${lista.length} registro${lista.length !== 1 ? 's' : ''}`;
    if (!lista.length) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-row">Nenhum registro ainda.</td></tr>';
      return;
    }
    tbody.innerHTML = lista.map(h => `
      <tr>
        <td>${h.usuario}<br><span style="font-size:11px;color:var(--gray-text)">${h.email}</span></td>
        <td>${h.acao}</td>
        <td>${h.realizadoPor}</td>
        <td>${h.dataHora}</td>
      </tr>
    `).join('');
  }
};