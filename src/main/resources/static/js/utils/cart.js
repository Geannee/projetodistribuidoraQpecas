// ── CARRINHO — Utilitário compartilhado (localStorage) ──────────────────────

const Cart = {
  KEY: 'qp_cart',

  get() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },

  save(items) {
    localStorage.setItem(this.KEY, JSON.stringify(items));
  },

  add(item) {
    const items = this.get();
    const exist = items.find(i => i.ref === item.ref);
    if (exist) {
      exist.qty++;
    } else {
      items.push({ ...item, qty: 1, id: 'ci-' + Date.now() });
    }
    this.save(items);
    this.updateBadge();
    return items;
  },

  remove(id) {
    const items = this.get().filter(i => i.id !== id);
    this.save(items);
    this.updateBadge();
    return items;
  },

  updateQty(id, delta) {
    const items = this.get();
    const item  = items.find(i => i.id === id);
    if (item) {
      item.qty = Math.max(1, item.qty + delta);
    }
    this.save(items);
    return items;
  },

  count() {
    return this.get().reduce((s, i) => s + i.qty, 0);
  },

  total() {
    return this.get().reduce((s, i) => s + i.price * i.qty, 0);
  },

  updateBadge() {
    const badge = document.getElementById('cartBadge');
    if (!badge) return;
    const n = this.count();
    badge.textContent = n;
    badge.style.display = n > 0 ? 'inline-flex' : 'none';
  }
};

// ── Funções auxiliares ────────────────────────────────────────────────────────
function fmt(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// ── Função global: adicionar ao carrinho a partir de um botão na busca ───────
function addToCart(btn) {
  const row    = btn.closest('.equiv-row');
  const paItem = btn.closest('.pa-item');

  const brand = row.querySelector('.equiv-brand').textContent.trim();
  const ref   = row.querySelector('.equiv-ref').textContent.replace('Ref.:', '').trim();
  const price = parseFloat(
    row.querySelector('.price').textContent
      .replace('R$', '').replace(/\./g, '').replace(',', '.').trim()
  );
  const label  = row.querySelector('.equiv-preco .label').textContent.trim();
  const icon   = paItem?.querySelector('.pa-icon')?.innerHTML?.trim() || ICONS.wrench;
  const name   = paItem?.querySelector('.pa-name')?.textContent?.trim() || '';

  const plateEl = document.getElementById('plateDisplay');
  const vehicle = plateEl ? plateEl.textContent.replace('·', '-') : '';

  Cart.add({ brand, ref, price, label, icon, name, vehicle });

  // Feedback visual no botão
  btn.innerHTML           = ICONS.check;
  btn.style.background    = 'var(--green)';
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    btn.textContent         = '+ Add';
    btn.style.background    = '';
    btn.style.pointerEvents = '';
  }, 1800);

  // Exibe o toast clássico
  showCartToast(`${brand} adicionado ao carrinho`);

  // Abre e atualiza o carrinho lateral dinamicamente
  toggleSideCart(true);
}

// ── Toast de confirmação ─────────────────────────────────────────────────────
function showCartToast(msg) {
  let toast = document.getElementById('cartToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id        = 'cartToast';
    toast.className = 'cart-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `${msg} <a href="carrinho.html" class="toast-link">Ver carrinho →</a>`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Lógica de Controle do Carrinho Lateral (Drawer) ──────────────────────────

function toggleSideCart(open) {
  const drawer  = document.getElementById('sideCartDrawer');
  const overlay = document.getElementById('drawerOverlay');
  if (!drawer || !overlay) return;

  if (open === undefined) {
    open = !drawer.classList.contains('open');
  }

  if (open) {
    renderDrawerCart();
    drawer.classList.add('open');
    overlay.classList.add('active');
  } else {
    drawer.classList.remove('open');
    overlay.classList.remove('active');
  }
}

function renderDrawerCart() {
  const container = document.getElementById('drawerCartItems');
  const empty     = document.getElementById('drawerCartEmpty');
  const totalEl   = document.getElementById('drawerCartTotal');
  if (!container || !empty || !totalEl) return;

  const items = Cart.get();

  if (items.length === 0) {
    container.innerHTML = '';
    empty.style.display = 'flex';
    totalEl.textContent = fmt(0);
    return;
  }

  empty.style.display = 'none';

  container.innerHTML = items.map(item => `
    <div class="drawer-cart-item" id="dci-${item.id}">
      <div class="dci-thumb">${item.icon || '⚙️'}</div>
      <div class="dci-info">
        <div class="dci-brand" title="${item.brand} — ${item.name}">${item.brand} — ${item.name}</div>
        <div class="dci-ref" title="Ref.: ${item.ref}">Ref.: ${item.ref}</div>
        ${item.vehicle ? `<div class="dci-compat">${item.vehicle}</div>` : ''}
      </div>
      <div class="dci-qty">
        <button class="dci-qty-btn" onclick="alterarQtyDrawer('${item.id}', -1)">−</button>
        <span class="dci-qty-num">${item.qty}</span>
        <button class="dci-qty-btn" onclick="alterarQtyDrawer('${item.id}', 1)">+</button>
      </div>
      <div class="dci-price">
        <div class="dci-price-unit">${fmt(item.price)} / ${item.label}</div>
        <div class="dci-price-total">${fmt(item.price * item.qty)}</div>
      </div>
      <button class="dci-remove" onclick="removerItemDrawer('${item.id}')" title="Remover">&times;</button>
    </div>
  `).join('');

  totalEl.textContent = fmt(Cart.total());
}

function alterarQtyDrawer(id, delta) {
  Cart.updateQty(id, delta);
  renderDrawerCart();
}

function removerItemDrawer(id) {
  const el = document.getElementById('dci-' + id);
  if (el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(20px)';
    el.style.transition= 'opacity .22s, transform .22s';
    setTimeout(() => {
      Cart.remove(id);
      renderDrawerCart();
    }, 240);
  } else {
    Cart.remove(id);
    renderDrawerCart();
  }
}

function limparCarrinhoDrawer() {
  if (Cart.count() === 0) return;
  if (!confirm('Deseja remover todos os itens do carrinho?')) return;

  const itemsElements = document.querySelectorAll('.drawer-cart-item');
  itemsElements.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity   = '0';
      el.style.transform = 'translateX(20px)';
      el.style.transition= 'opacity .2s, transform .2s';
    }, i * 60);
  });

  setTimeout(() => {
    Cart.save([]);
    Cart.updateBadge();
    renderDrawerCart();
  }, itemsElements.length * 60 + 220);
}

// Bind das funções ao objeto window para garantir acesso aos onclick inline do HTML
window.toggleSideCart = toggleSideCart;
window.alterarQtyDrawer = alterarQtyDrawer;
window.removerItemDrawer = removerItemDrawer;
window.limparCarrinhoDrawer = limparCarrinhoDrawer;

// ── Inicializa badge ao carregar a página ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
