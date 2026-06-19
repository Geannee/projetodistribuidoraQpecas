
/**
 * VIEW: Manipula o DOM de forma limpa e dinâmica
 */
const BuscaView = {
  // Elementos dos Filtros
  selectMarca: document.getElementById('appMarca'),
  selectModelo: document.getElementById('appModelo'),
  selectAno: document.getElementById('appAno'),
  selectCategoria: document.getElementById('appCategoria'),

  // Elementos de Exibição
  emptyState: document.getElementById('emptyState'),
  resultSection: document.getElementById('resultSection'),
  partsAccordion: document.getElementById('partsAccordion'),
  rSub: document.getElementById('rSub'),

  // NOVO: Input de placa
  plateInput: document.getElementById('plateInput'),

  /**
   * NOVO: Aplica um feedback visual temporário de erro no input de placa
   */
  destacarErroInputPlaca() {
    if (this.plateInput) {
      this.plateInput.style.borderColor = '#ef4444';
      this.plateInput.focus();
      setTimeout(() => {
        this.plateInput.style.borderColor = '';
      }, 1500);
    }
  },

  /**
   * NOVO: Exibe mensagem de erro customizada usando o próprio layout de erro da página
   */
  mostrarNaoEncontrado(mensagem) {
    this.partsAccordion.innerHTML = ''; // Limpa resultados anteriores
    this.rSub.textContent = "Resultado da busca por placa.";

    this.partsAccordion.innerHTML = `
      <div class="empty-state">
        <div class="es-icon">❌</div>
        <h3>Veículo ou Peças não encontrados</h3>
        <p>${mensagem}</p>
      </div>`;

    this.emptyState.style.display = 'none';
    this.resultSection.style.display = 'block';
  },

  /**
   * Atualiza o select de modelos com base nos dados do banco
   */
  popularModelos(modelos) {
    this.selectModelo.innerHTML = '<option value="">Modelo</option>';

    if (modelos && modelos.length > 0) {
      modelos.forEach(modelo => {
        const option = document.createElement('option');
        option.value = modelo;
        option.textContent = modelo;
        this.selectModelo.appendChild(option);
      });
      this.selectModelo.disabled = false;
    } else {
      this.selectModelo.disabled = true;
    }
  },

  popularAno(anos) {
    this.selectAno.innerHTML = '<option value="">Ano</option>';

    // Se o backend retornou anos específicos para o modelo, renderiza-os
    if (anos && anos.length > 0) {
      anos.forEach(ano => {
        const option = document.createElement('option');
        option.value = ano;
        option.textContent = ano;
        this.selectAno.appendChild(option);
      });
      this.selectAno.disabled = false;
    }
    // Caso contrário (se veio vazio, nulo ou se o modelo foi desselecionado)
    else {
      // Gera o HTML dinamicamente de 2026 até 2008
      let opcoesPadrao = '<option value="">Ano</option>';
      for (let ano = 2026; ano >= 2008; ano--) {
        opcoesPadrao += `<option value="${ano}">${ano}</option>`;
      }

      this.selectAno.innerHTML = opcoesPadrao;
      // Garante que o select do ano fique ativo se uma marca já estiver selecionada
      this.selectAno.disabled = !this.selectMarca.value;
    }
  },

  /**
   * Renderiza os resultados de peças retornados pelo Spring Boot na interface
   */
  renderizarPecas(pecas, filtros) {
    this.partsAccordion.innerHTML = ''; // Limpa resultados anteriores

    if (!pecas || pecas.length === 0) {
      this.rSub.textContent = "Nenhuma peça compatível encontrada para os filtros aplicados.";
      this.partsAccordion.innerHTML = `
        <div class="empty-state">
          <div class="es-icon">⚠️</div>
          <h3>Nenhuma peça encontrada</h3>
          <p>Tente ajustar os filtros de busca ou escolher outra categoria.</p>
        </div>`;
      this.emptyState.style.display = 'none';
      this.resultSection.style.display = 'block';
      return;
    }

    // Atualiza o subtítulo com o resumo dos filtros ativos
    this.rSub.textContent = `Filtros aplicados: ${filtros.marca || 'Qualquer Marca'} ${filtros.modelo || ''} | Categoria: ${filtros.categoria || 'Todas'}`;

    // Agrupa as peças retornadas por categoria para manter a estrutura de Acordeon do HTML original
    const pecasAgrupadas = this.agruparPorCategoria(pecas);

    // Renderiza cada grupo (Acordeon) dinamicamente
    Object.keys(pecasAgrupadas).forEach((categoria, index) => {
      const idUnico = `pa-dinamico-${index}`;
      const grupoHtml = this.criarTemplateAcordeon(idUnico, categoria, pecasAgrupadas[categoria]);
      this.partsAccordion.insertAdjacentHTML('beforeend', grupoHtml);
    });

    // Alterna a exibição das seções
    this.emptyState.style.display = 'none';
    this.resultSection.style.display = 'block';
  },

  /**
   * Helper para agrupar o array linear de peças por categoria
   * CORREÇÃO: Blindado contra 'categoria' nula vinda do banco
   */
  agruparPorCategoria(pecas) {
    return pecas.reduce((grupos, peca) => {
      // Se a categoria for nula ou vazia, joga no grupo "OUTROS" para não quebrar o JS
      const categoria = peca.categoria ? peca.categoria.toUpperCase() : 'OUTROS';
      if (!grupos[categoria]) grupos[categoria] = [];
      grupos[categoria].push(peca);
      return grupos;
    }, {});
  },

  /**
   * Retorna a string HTML baseada na estrutura dark CSS para o acordeon e as linhas de peças
   * CORREÇÃO: Removido style="display:none" para respeitar o controle de classe .open do CSS original
   */
  criarTemplateAcordeon(id, nomeCategoria, listaDePecas) {
    const nomesAmigaveis = {
      'OUTROS': 'Outros Componentes',
      'FILTRO': 'Filtros e Elementos',
      'FREIO': 'Sistema de Freios',
      'MOTOR': 'Componentes do Motor',
      'ELETRICA': 'Componentes da Eletrica',
      'SUSPENSAO': 'Suspensão e Componentes'

    };

    const categoriaExibicao = nomesAmigaveis[nomeCategoria] || nomeCategoria;

    // Transforma os itens internos do grupo em linhas estruturadas
    const linhasPecasHtml = listaDePecas.map(peca => {
      const precoUnico = peca.precoBase !== undefined ? Number(peca.precoBase) : 0.0;

      let classeEstoque = 'estoque-ok';
      let textoEstoque = '● Em Estoque';

      if (peca.estoque <= 0) {
        classeEstoque = 'estoque-out';
        textoEstoque = '✕ Sem estoque';
      } else if (peca.estoque <= 3) {
        classeEstoque = 'estoque-low';
        textoEstoque = `⚠ Restam ${peca.estoque} unid.`;
      }

      return `
        <div class="equiv-row">
          <div class="equiv-thumb">⚙️</div>
          <div class="equiv-info">
            <div class="equiv-brand">${peca.marca || 'Genérico'}</div>
            <div class="equiv-ref">Ref.: ${peca.idPeca || 'N/A'} — ${peca.nome || 'Peça'}</div>
            <div class="equiv-badges">
              <span class="badge badge-original">Original</span>
              <span class="badge badge-compat">✓ compatível</span>
            </div>
          </div>
          <div class="equiv-estoque ${classeEstoque}">
            ${textoEstoque}
          </div>
          <div class="equiv-preco">
            <div class="price">R$ ${precoUnico.toFixed(2).replace('.', ',')}</div>
            <div class="label">à vista</div>
          </div>
          <button class="btn-add" onclick="if(typeof addToCart === 'function') addToCart(this)">+ Add</button>
        </div>
      `;
    }).join('');

    const icones = { 'FILTRO': '🔧', 'FREIO': '🛑', 'MOTOR': '⚙️', 'ELETRICA': '⚡', 'OUTROS': '📦' };
    const iconeSugerido = icones[nomeCategoria] || '🔩';

    // CORREÇÃO AQUI: Retirado o 'style="display: none;"' da div .pa-body
    // O controle se ela aparece ou some é feito pela classe '.open' colocada em '.pa-item'
    return `
      <div class="pa-item" id="${id}">
        <div class="pa-header" onclick="togglePart('${id}')">
          <span class="pa-icon">${iconeSugerido}</span>
          <div class="pa-info">
            <span class="pa-name">${categoriaExibicao}</span>
            <span class="pa-sub">Produtos disponíveis para o veículo</span>
          </div>
          <span class="pa-count">${listaDePecas.length} opções</span>
          <span class="pa-arrow">›</span>
        </div>
        <div class="pa-body">
          <div class="equiv-list">
            ${linhasPecasHtml}
          </div>
        </div>
      </div>
    `;
  }
};
/**
 * Função global exigida pelo comportamento do layout original para abrir/fechar os acordeons
 */
window.togglePart = function(id) {
  const item = document.getElementById(id);
  if (!item) return;

  const aberto = item.classList.contains('open');

  // Fecha todos os acordeons abertos para manter o comportamento limpo
  document.querySelectorAll('.pa-item').forEach(i => i.classList.remove('open'));

  // Se o que clicamos estava fechado, agora ele abre
  if (!aberto) {
    item.classList.add('open');
  }
};
