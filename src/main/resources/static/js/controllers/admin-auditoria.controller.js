// ── ADMIN AUDITORIA CONTROLLER ─────────────────────────────────────────────────

const AuditoriaController = {

  _logs:     [],
  _pagina:   1,
  _porPagina: 12,

  init() {
    this._logs = AuditoriaModel.getLogs();
    AuditoriaView.renderStats(this._logs);
    AuditoriaView.renderTabela(this._logs, this._pagina, this._porPagina);
  },

  filtrar() {
    const tipo    = document.getElementById('filtro-tipo')?.value;
    const dataIni = document.getElementById('filtro-data-ini')?.value;
    const dataFim = document.getElementById('filtro-data-fim')?.value;
    const usuario = document.getElementById('filtro-usuario')?.value.trim();
    this._logs   = AuditoriaModel.filtrar({ tipo, dataIni, dataFim, usuario });
    this._pagina = 1;
    AuditoriaView.renderStats(this._logs);
    AuditoriaView.renderTabela(this._logs, this._pagina, this._porPagina);
  },

  limparFiltros() {
    ['filtro-tipo','filtro-data-ini','filtro-data-fim','filtro-usuario'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    this._logs   = AuditoriaModel.getLogs();
    this._pagina = 1;
    AuditoriaView.renderStats(this._logs);
    AuditoriaView.renderTabela(this._logs, this._pagina, this._porPagina);
  },

  irPagina(n) {
    this._pagina = n;
    AuditoriaView.renderTabela(this._logs, this._pagina, this._porPagina);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  exportar() {
    const header = 'Data/Hora,Usuário,Ação,Detalhe,IP\n';
    const rows   = this._logs.map(l =>
      `"${l.dataHora}","${l.usuario}","${l.acao}","${l.detalhe}","${l.ip}"`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `auditoria_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

AuditoriaController.init();
