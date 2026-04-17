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
  const icon   = paItem?.querySelector('.pa-icon')?.textContent?.trim() || '⚙';
  const name   = paItem?.querySelector('.pa-name')?.textContent?.trim() || '';

  const plateEl = document.getElementById('plateDisplay');
  const vehicle = plateEl ? plateEl.textContent.replace('·', '-') : '';

  Cart.add({ brand, ref, price, label, icon, name, vehicle });

  // Feedback visual no botão
  btn.textContent         = '✓';
  btn.style.background    = 'var(--green)';
  btn.style.pointerEvents = 'none';
  setTimeout(() => {
    btn.textContent         = '+ Add';
    btn.style.background    = '';
    btn.style.pointerEvents = '';
  }, 1800);

  showCartToast(`${brand} adicionado ao carrinho`);
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
  toast.innerHTML = `🛒 ${msg} <a href="carrinho.html" class="toast-link">Ver carrinho →</a>`;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── Inicializa badge ao carregar a página ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => Cart.updateBadge());
