// ── ADMIN AUDITORIA MODEL ──────────────────────────────────────────────────────

const AuditoriaModel = {

  KEY: 'qp_auditoria_logs',

  _seed() {
    if (localStorage.getItem(this.KEY)) return;
    const demo = [
      { id: 1, dataHora: '03/05/2026 09:02', usuario: 'silva@oficina.com',    acao: 'LOGIN',           detalhe: 'Login efetuado',              ip: '187.45.12.33'  },
      { id: 2, dataHora: '03/05/2026 08:55', usuario: 'contato@autopecas.com',acao: 'SENHA_ERRADA',    detalhe: 'Tentativa 3 de 5',            ip: '200.100.55.12' },
      { id: 3, dataHora: '03/05/2026 08:40', usuario: 'admin',                acao: 'CADASTRO_VEICULO',detalhe: 'Placa PBQ2694 – VW Gol 2019', ip: '192.168.0.1'   },
      { id: 4, dataHora: '02/05/2026 17:30', usuario: 'admin',                acao: 'CADASTRO_PECA',   detalhe: 'SKU G8197 – Amortecedor',     ip: '192.168.0.1'   },
      { id: 5, dataHora: '02/05/2026 14:35', usuario: 'admin',                acao: 'ACESSO_LIBERADO', detalhe: 'Usuário contato@autopecas.com',ip: '192.168.0.1'  },
      { id: 6, dataHora: '02/05/2026 14:30', usuario: 'contato@autopecas.com',acao: 'SENHA_ERRADA',    detalhe: 'Tentativa 5 – conta bloqueada',ip: '200.100.55.12'},
      { id: 7, dataHora: '01/05/2026 10:15', usuario: 'mecanicaboa@gmail.com',acao: 'LOGIN',           detalhe: 'Login efetuado',              ip: '177.22.88.44'  },
      { id: 8, dataHora: '01/05/2026 08:12', usuario: 'silva@oficina.com',    acao: 'SENHA_ERRADA',    detalhe: 'Tentativa 5 – conta bloqueada',ip: '187.45.12.33' },
    ];
    localStorage.setItem(this.KEY, JSON.stringify(demo));
  },

  getLogs() {
    this._seed();
    return JSON.parse(localStorage.getItem(this.KEY)) || [];
  },

  registrar(acao, usuario, detalhe = '', ip = '—') {
    const logs = this.getLogs();
    logs.unshift({
      id:       Date.now(),
      dataHora: new Date().toLocaleString('pt-BR'),
      usuario,
      acao,
      detalhe,
      ip
    });
    localStorage.setItem(this.KEY, JSON.stringify(logs));
  },

  filtrar({ tipo, dataIni, dataFim, usuario }) {
    return this.getLogs().filter(log => {
      if (tipo    && log.acao    !== tipo)                           return false;
      if (usuario && !log.usuario.toLowerCase().includes(usuario.toLowerCase())) return false;
      // Filtragem por data simples (compara string DD/MM/AAAA)
      if (dataIni || dataFim) {
        const [d, m, y] = log.dataHora.split(' ')[0].split('/');
        const logDate   = new Date(`${y}-${m}-${d}`);
        if (dataIni && logDate < new Date(dataIni)) return false;
        if (dataFim && logDate > new Date(dataFim)) return false;
      }
      return true;
    });
  }
};
