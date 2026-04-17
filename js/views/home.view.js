// ── HOME VIEW ─────────────────────────────────────────────────────────────────
// Renderização da página inicial: ofertas e slideshows
// ─────────────────────────────────────────────────────────────────────────────

const HomeView = {

  /** Renderiza todas as seções de ofertas no container */
  renderOfertas(container, ofertas) {
    ofertas.forEach(grupo => {
      const sec = document.createElement('section');
      sec.className = 'oferta-section section-white';
      sec.innerHTML = `
        <div class="oferta-header">
          <div>
            <div class="section-title">${grupo.titulo}</div>
            <div class="section-sub">${grupo.sub}</div>
          </div>
          <div class="carousel-controls">
            <button class="carousel-btn">‹</button>
            <button class="carousel-btn active">›</button>
          </div>
        </div>
        <div class="produtos-grid">
          ${grupo.produtos.map(p => `
            <div class="produto-card">
              <div class="produto-img">
                <span class="badge-oferta">OFERTA</span>
                <span class="badge-desc">${p.desc}</span>
                ${p.icon}
              </div>
              <div class="produto-body">
                <div class="produto-marca">${p.marca}</div>
                <div class="produto-nome">${p.nome}</div>
                <div class="produto-ref">${p.ref}</div>
                <div class="produto-preco">
                  <div>
                    <div class="preco-de">De ${p.de}</div>
                    <div class="preco-por">Por ${p.por}</div>
                  </div>
                  <button class="btn-comprar" onclick="HomeController.addToCart('${p.nome}', this)">Comprar</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="ver-mais-wrap">
          <button class="btn-ver-mais">⊕ Ver mais ofertas</button>
        </div>
      `;
      container.appendChild(sec);
    });
  },

  /** Inicia slideshow genérico dado um seletor CSS */
  iniciarSlideshow(seletor, intervaloMs) {
    const slides = document.querySelectorAll(seletor);
    if (!slides.length) return;
    let atual = 0;
    setInterval(() => {
      slides[atual].classList.remove('active');
      atual = (atual + 1) % slides.length;
      slides[atual].classList.add('active');
    }, intervaloMs);
  },

  /** Mostra estado logado na navbar */
  renderNavLogado(navActions, usuario, perfil) {
    const iniciais = Auth.getIniciais(usuario);
    navActions.innerHTML = `
      <div class="nav-user">
        <div class="nav-avatar">${iniciais}</div>
        <div class="nav-user-info">
          <div class="nav-user-nome">${usuario}</div>
          <div class="nav-user-perfil">${perfil}</div>
        </div>
      </div>
      <a href="dashboard.html" class="btn-outline" style="text-decoration:none;display:flex;align-items:center;">Minha conta</a>
      <button class="btn-outline" onclick="Auth.logout()">Sair</button>
      <button class="btn-coral">+ Adicionar ao carrinho</button>
    `;
  }
};
