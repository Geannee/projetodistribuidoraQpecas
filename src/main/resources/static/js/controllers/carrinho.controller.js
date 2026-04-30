// ── CARRINHO CONTROLLER ───────────────────────────────────────────────────────

function fmt(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// ── Atualiza visibilidade do botão "Limpar tudo" ─────────────────────────────
function atualizarBtnLimpar(temItens) {
  const btn = document.getElementById('btnLimpar');
  if (btn) btn.disabled = !temItens;
}

// ── Renderiza os itens do carrinho a partir do localStorage ──────────────────
function renderCart() {
  const items     = Cart.get();
  const container = document.getElementById('cartItems');
  const empty     = document.getElementById('cartEmpty');
  const footer    = document.getElementById('cartFooter');

  atualizarBtnLimpar(items.length > 0);

  if (items.length === 0) {
    container.innerHTML  = '';
    empty.style.display  = 'flex';
    footer.style.display = 'none';
    document.getElementById('cartCountLabel').textContent = 'Carrinho vazio';
    return;
  }

  empty.style.display  = 'none';
  footer.style.display = 'flex';

  container.innerHTML = items.map(item => `
    <div class="cart-item" id="ci-${item.id}">
      <div class="ci-thumb">${item.icon || '⚙'}</div>
      <div class="ci-info">
        <div class="ci-brand">${item.brand} — ${item.name}</div>
        <div class="ci-ref">Ref.: ${item.ref}</div>
        ${item.vehicle ? `<div class="ci-compat">✓ ${item.vehicle}</div>` : ''}
      </div>
      <div class="ci-qty">
        <button class="ci-qty-btn" onclick="alterarQty('${item.id}', -1)">−</button>
        <span class="ci-qty-num" id="qty-${item.id}">${item.qty}</span>
        <button class="ci-qty-btn" onclick="alterarQty('${item.id}', 1)">+</button>
      </div>
      <div class="ci-price">
        <div class="ci-price-unit">${fmt(item.price)} / ${item.label}</div>
        <div class="ci-price-total" id="total-${item.id}">${fmt(item.price * item.qty)}</div>
      </div>
      <button class="ci-remove" onclick="removerItem('${item.id}')" title="Remover">✕</button>
    </div>
  `).join('');

  recalcular();
}

// ── Recalcula totais ─────────────────────────────────────────────────────────
function recalcular() {
  const items = Cart.get();
  let total = 0;
  let count = 0;

  items.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;
    const el = document.getElementById('total-' + item.id);
    if (el) el.textContent = fmt(item.price * item.qty);
  });

  document.getElementById('cfTotal').textContent         = fmt(total);
  document.getElementById('summarySubtotal').textContent  = fmt(total);
  document.getElementById('summaryTotal').textContent     = fmt(total);

  const label = count + (count === 1 ? ' item' : ' itens');
  document.getElementById('cfCount').textContent          = label;
  document.getElementById('cartCountLabel').textContent   = label + ' · selecionados';

  // Atualiza label no resumo
  const sub = document.querySelector('.os-row .os-label');
  if (sub) sub.textContent = `Subtotal (${label})`;
}

// ── Alterar quantidade ───────────────────────────────────────────────────────
function alterarQty(id, delta) {
  Cart.updateQty(id, delta);
  const items = Cart.get();
  const item  = items.find(i => i.id === id);
  if (item) {
    document.getElementById('qty-' + id).textContent = item.qty;
  }
  recalcular();
}

// ── Remover item individual ───────────────────────────────────────────────────
function removerItem(id) {
  const el = document.getElementById('ci-' + id);
  if (el) {
    el.style.opacity   = '0';
    el.style.transform = 'translateX(-20px)';
    el.style.transition= 'opacity .22s, transform .22s';
    setTimeout(() => {
      Cart.remove(id);
      renderCart();
    }, 240);
  }
}

// ── Limpar todo o carrinho ────────────────────────────────────────────────────
function limparCarrinho() {
  if (Cart.count() === 0) return;
  if (!confirm('Deseja remover todos os itens do carrinho?')) return;

  const items = document.querySelectorAll('.cart-item');
  items.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity   = '0';
      el.style.transform = 'translateX(-20px)';
      el.style.transition= 'opacity .2s, transform .2s';
    }, i * 60);
  });

  setTimeout(() => {
    Cart.save([]);
    Cart.updateBadge();
    renderCart();
  }, items.length * 60 + 220);
}

// ── Ações do pedido ──────────────────────────────────────────────────────────
function finalizarPedido() {
  if (Cart.count() === 0) { alert('Adicione itens ao carrinho antes de finalizar.'); return; }
  const numero = '#QP-' + Math.floor(Math.random() * 9000 + 1000);
  const itens  = Cart.get().map(i => i.name).join(', ');
  const total  = Cart.get().reduce((s, i) => s + i.price * i.qty, 0);
  const pedido = {
    id: numero,
    data: new Date().toLocaleDateString('pt-BR'),
    itens: itens,
    total: 'R$ ' + total.toFixed(2).replace('.', ','),
    status: 'Aguardando Pagamento',
    statusClass: 'status-aguardando',
    previsao: '—'
  };
  const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  pedidos.unshift(pedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  Cart.save([]);
  Cart.updateBadge();
  renderCart();
  setTimeout(() => { location.href = 'pedidos.html'; }, 800);
}

function gerarPedido() {
  if (Cart.count() === 0) { alert('Adicione itens ao carrinho antes de gerar o pedido.'); return; }
  const numero = '#QP-' + Math.floor(Math.random() * 9000 + 1000);
  const itens  = Cart.get().map(i => i.name).join(', ');
  const total  = Cart.get().reduce((s, i) => s + i.price * i.qty, 0);
  const pedido = {
    id: numero,
    data: new Date().toLocaleDateString('pt-BR'),
    itens: itens,
    total: 'R$ ' + total.toFixed(2).replace('.', ','),
    status: 'Em Separação',
    statusClass: 'status-separacao',
    previsao: '—'
  };
  const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
  pedidos.unshift(pedido);
  localStorage.setItem('pedidos', JSON.stringify(pedidos));
  Cart.save([]);
  Cart.updateBadge();
  renderCart();
  setTimeout(() => { location.href = 'pedidos.html'; }, 800);
}

function gerarPDF() {
  window.print();
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderCart();
  Cart.updateBadge();
});
