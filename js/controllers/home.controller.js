// ── HOME CONTROLLER ───────────────────────────────────────────────────────────
// Orquestra a página inicial: sessão, ofertas, slideshows, formulários
// ─────────────────────────────────────────────────────────────────────────────

const HomeController = {

  init() {
    this.verificarSessao();
    this.renderOfertas();
    this.iniciarSlideshows();
    this.initScrollSuave();
  },

  verificarSessao() {
    const usuario  = Auth.getUsuario();
    const perfil   = Auth.getPerfil();
    const navActions = document.getElementById('nav-actions');
    if (!navActions) return;
    if (usuario) HomeView.renderNavLogado(navActions, usuario, perfil);
  },

  renderOfertas() {
    const container = document.getElementById('ofertas-container');
    if (container) HomeView.renderOfertas(container, HomeModel.ofertas);
  },

  iniciarSlideshows() {
    HomeView.iniciarSlideshow('.hero-slide', 3000);
    HomeView.iniciarSlideshow('.app-slide',  2000);
  },

  addToCart(nome, btn) {
    const original = btn.textContent;
    btn.textContent = '✓ Adicionado!';
    btn.style.background = '#2EB855';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 2000);
  },

  handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.btn-enviar');
    btn.textContent = '✓ Mensagem enviada!';
    btn.style.background = '#2EB855';
    setTimeout(() => {
      btn.textContent = 'Enviar mensagem →';
      btn.style.background = '';
      e.target.reset();
    }, 3000);
  },

  handleNewsletter() {
    const input = document.querySelector('.newsletter-input');
    const btn   = document.querySelector('.btn-inscrever');
    if (!input.value) { input.style.borderColor = 'var(--coral)'; return; }
    btn.textContent = '✓ Inscrito!';
    btn.style.background = '#2EB855';
    input.value = '';
    setTimeout(() => {
      btn.textContent = 'Inscrever-se →';
      btn.style.background = '';
      input.style.borderColor = '';
    }, 3000);
  },

  initScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    });
  }
};

// Aliases globais para chamadas inline nos HTML
function addToCart(nome, btn)  { HomeController.addToCart(nome, btn); }
function handleSubmit(e)       { HomeController.handleSubmit(e); }
function handleNewsletter()    { HomeController.handleNewsletter(); }

HomeController.init();
