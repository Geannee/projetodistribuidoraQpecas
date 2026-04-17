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
  }
};
