// ── SHARED VIEW ───────────────────────────────────────────────────────────────
// Renderização do usuário na sidebar/topbar (compartilhado entre páginas internas)
// ─────────────────────────────────────────────────────────────────────────────

const SharedView = {

  /** Preenche avatar, nome e perfil na sidebar e topbar */
  preencherUsuario() {
    const usuario = Auth.getUsuario() || 'Cliente';
    const iniciais = Auth.getIniciais(usuario);
    const nome     = Auth.getNomeFormatado(usuario);
    const perfil   = Auth.getPerfil();

    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    set('sidebar-avatar', iniciais);
    set('topbar-avatar',  iniciais);
    set('sidebar-nome',   nome);
    if (perfil) set('sidebar-cnpj', perfil);

    // Inicializa notificações do cliente
    this.inicializarNotificacoes();
  },

  inicializarNotificacoes() {
    const bellBtn = document.querySelector('.btn-bell[title="Notificações"]');
    if (!bellBtn) return;

    let bellDot = bellBtn.querySelector('.bell-dot');
    if (!bellDot) {
      bellDot = document.createElement('span');
      bellDot.className = 'bell-dot';
      bellBtn.appendChild(bellDot);
    }
    bellDot.id = 'bell-dot-global';

    let dropdown = document.getElementById('notifDropdownGlobal');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'notifDropdownGlobal';
      dropdown.style.cssText = 'display:none; position: absolute; right: 20px; top: 70px; background: white; border: 1px solid #E5E7EB; border-radius: 8px; width: 320px; max-height: 400px; overflow-y: auto; box-shadow: 0 4px 6px rgba(0,0,0,0.1); z-index: 1000; padding: 12px; font-family: sans-serif; text-align: left;';
      document.body.appendChild(dropdown);
    }

    const list = JSON.parse(localStorage.getItem('qp_notificacoes') || '[]');
    const hasUnread = list.some(n => !n.lida);
    bellDot.style.display = hasUnread ? 'block' : 'none';

    bellBtn.onclick = (e) => {
      e.stopPropagation();
      const isVisible = dropdown.style.display === 'block';
      dropdown.style.display = isVisible ? 'none' : 'block';
      
      if (!isVisible) {
        const currentList = JSON.parse(localStorage.getItem('qp_notificacoes') || '[]');
        currentList.forEach(n => n.lida = true);
        localStorage.setItem('qp_notificacoes', JSON.stringify(currentList));
        bellDot.style.display = 'none';
        this.renderizarNotificacoes(dropdown);
      }
    };

    document.addEventListener('click', () => {
      dropdown.style.display = 'none';
    });
    dropdown.onclick = (e) => e.stopPropagation();

    window.addEventListener('storage', (e) => {
      if (e.key === 'qp_notif_trigger') {
        const updatedList = JSON.parse(localStorage.getItem('qp_notificacoes') || '[]');
        const updatedUnread = updatedList.some(n => !n.lida);
        bellDot.style.display = updatedUnread ? 'block' : 'none';
        if (dropdown.style.display === 'block') {
          this.renderizarNotificacoes(dropdown);
        }
      }
    });
  },

  renderizarNotificacoes(dropdown) {
    const list = JSON.parse(localStorage.getItem('qp_notificacoes') || '[]');
    if (list.length === 0) {
      dropdown.innerHTML = `
        <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px;">Notificações</div>
        <div style="padding: 12px; text-align: center; color: #9CA3AF; font-size: 12px;">Nenhuma notificação.</div>
      `;
      return;
    }

    const itemsHtml = list.map(n => `
      <div style="padding: 8px 4px; border-bottom: 1px solid #E5E7EB; font-size: 12px;">
        <div style="font-weight: 700; margin-bottom: 2px; color: #1F2937;">${n.titulo}</div>
        <div style="color: #4B5563; margin-bottom: 4px;">${n.mensagem}</div>
        <div style="font-size: 10px; color: #9CA3AF; text-align: right;">${n.data}</div>
      </div>
    `).join('');

    dropdown.innerHTML = `
      <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #E5E7EB; padding-bottom: 6px; display: flex; justify-content: space-between; align-items: center;">
        <span>Notificações</span>
        <button onclick="localStorage.setItem('qp_notificacoes', '[]'); document.getElementById('notifDropdownGlobal').style.display='none'; document.getElementById('bell-dot-global').style.display='none';" style="background: none; border: none; font-size: 11px; color: #2563EB; cursor: pointer;">Limpar</button>
      </div>
      <div>${itemsHtml}</div>
    `;
  }
};
