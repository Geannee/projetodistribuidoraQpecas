// ── ADMIN SOLICITAÇÕES MODEL ───────────────────────────────────────────────────

const SolicitacoesModel = {

  mockData: [
    {
      id: 'CAD-0001',
      cnpj: '12.345.678/0001-99',
      razao: 'Oficina Boa Mecânica LTDA',
      nomeOficina: 'Boa Mecânica',
      especialidade: 'Mecânica geral, Freios, Suspensão',
      cep: '01310-100',
      logradouro: 'Rua das Flores',
      numero: '123',
      bairro: 'Centro',
      cidade: 'São Paulo',
      estado: 'SP',
      responsavel: 'João da Silva',
      telefone: '(11) 98765-4321',
      email: 'joao@boamecanica.com',
      status: 'pendente',
      dataEnvio: '30/04/2026'
    },
    {
      id: 'CAD-0002',
      cnpj: '98.765.432/0001-11',
      razao: 'Auto Peças Norte LTDA',
      nomeOficina: 'Auto Norte',
      especialidade: 'Elétrica automotiva',
      cep: '30130-010',
      logradouro: 'Av. Amazonas',
      numero: '456',
      bairro: 'Funcionários',
      cidade: 'Belo Horizonte',
      estado: 'MG',
      responsavel: 'Maria Oliveira',
      telefone: '(31) 97654-3210',
      email: 'maria@autonorte.com',
      status: 'pendente',
      dataEnvio: '29/04/2026'
    },
    {
      id: 'CAD-0003',
      cnpj: '55.444.333/0001-22',
      razao: 'Tudo Autos Comércio EIRELI',
      nomeOficina: 'Tudo Autos',
      especialidade: 'Funilaria, Pintura',
      cep: '41770-395',
      logradouro: 'Rua do Progresso',
      numero: '789',
      bairro: 'Pituba',
      cidade: 'Salvador',
      estado: 'BA',
      responsavel: 'Carlos Souza',
      telefone: '(71) 96543-2109',
      email: 'carlos@tudoautos.com',
      status: 'aprovado',
      dataEnvio: '25/04/2026',
      dataDecisao: '26/04/2026'
    },
    {
      id: 'CAD-0004',
      cnpj: '33.222.111/0001-44',
      razao: 'Garagem Expressa ME',
      nomeOficina: 'Garagem Expressa',
      especialidade: 'Troca de óleo, Revisão',
      cep: '80010-020',
      logradouro: 'Rua XV de Novembro',
      numero: '321',
      bairro: 'Centro',
      cidade: 'Curitiba',
      estado: 'PR',
      responsavel: 'Ana Lima',
      telefone: '(41) 95432-1098',
      email: 'ana@garagemexpressa.com',
      status: 'recusado',
      dataEnvio: '22/04/2026',
      dataDecisao: '23/04/2026'
    }
  ],

  carregar() {
    const salvos = JSON.parse(localStorage.getItem('qp_solicitacoes') || '[]');
    return [...salvos, ...this.mockData];
  },

  atualizar(id, status) {
    const lista  = JSON.parse(localStorage.getItem('qp_solicitacoes') || '[]');
    const idx    = lista.findIndex(s => s.id === id);
    if (idx !== -1) {
      lista[idx].status      = status;
      lista[idx].dataDecisao = new Date().toLocaleDateString('pt-BR');
      localStorage.setItem('qp_solicitacoes', JSON.stringify(lista));
      return true;
    }
    // Verifica se é dado mock (não persiste, só retorna true)
    return this.mockData.some(s => s.id === id);
  },

  statusClasse: {
    'pendente': 'sol-pendente',
    'aprovado': 'sol-aprovado',
    'recusado': 'sol-recusado'
  },

  statusLabel: {
    'pendente': 'Pendente',
    'aprovado': 'Aprovado',
    'recusado': 'Recusado'
  }
};
