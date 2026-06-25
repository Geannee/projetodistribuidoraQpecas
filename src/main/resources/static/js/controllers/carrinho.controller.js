const CarrinhoController = {
    valorFreteAtual: 20.00,

    init() {
        if (!Auth.check()) return;
        CarrinhoController.renderCart();
        if (typeof Cart !== 'undefined') {
            Cart.updateBadge();
        }
    },

    fmt(valor) {
        return 'R$ ' + valor.toFixed(2).replace('.', ',');
    },

    atualizarBtnLimpar(temItens) {
        const btn = document.getElementById('btnLimpar');
        if (!btn) return;
        btn.disabled = !temItens;
        btn.style.opacity = temItens ? '1' : '0.35';
    },

    renderCart() {
        if (typeof Cart === 'undefined') return;

        const items = Cart.get();
        const container = document.getElementById('cartItems');
        const empty = document.getElementById('cartEmpty');
        const footer = document.getElementById('cartFooter');

        CarrinhoController.atualizarBtnLimpar(items.length > 0);

        if (items.length === 0) {
            if (container) container.innerHTML = '';
            if (empty) empty.style.display = 'flex';
            if (footer) footer.style.display = 'none';

            document.getElementById('cartCountLabel').textContent = 'Carrinho vazio';

            document.getElementById('summarySubtotal').textContent = CarrinhoController.fmt(0);
            document.getElementById('summaryTotal').textContent = CarrinhoController.fmt(0);
            document.getElementById('cfTotal').textContent = CarrinhoController.fmt(0);

            const subLabel = document.querySelector('.os-row .os-label');
            if (subLabel) subLabel.textContent = 'Subtotal (0 itens)';
            return;
        }

        if (empty) empty.style.display = 'none';
        if (footer) footer.style.display = 'flex';

        container.innerHTML = items.map(item => `
            <div class="cart-item" id="ci-${item.id}">
                <div class="ci-thumb">${item.icon || '⚙️'}</div>
                <div class="ci-info">
                    <div class="ci-brand">${item.brand} — ${item.name}</div>
                    <div class="ci-ref">Ref.: ${item.ref}</div>
                    ${item.vehicle ? `<div class="ci-compat">${item.vehicle}</div>` : ''}
                </div>
                <div class="ci-qty">
                    <button class="ci-qty-btn" onclick="alterarQty('${item.id}', -1)">−</button>
                    <span class="ci-qty-num" id="qty-${item.id}">${item.qty}</span>
                    <button class="ci-qty-btn" onclick="alterarQty('${item.id}', 1)">+</button>
                </div>
                <div class="ci-price">
                    <div class="ci-price-unit">${CarrinhoController.fmt(item.price)} / ${item.label}</div>
                    <div class="ci-price-total" id="total-${item.id}">${CarrinhoController.fmt(item.price * item.qty)}</div>
                </div>
                <button class="ci-remove" onclick="removerItem('${item.id}')" title="Remover">&times;</button>
            </div>
        `).join('');

        CarrinhoController.recalcular();
    },

    recalcular() {
        if (typeof Cart === 'undefined') return;

        const items = Cart.get();
        let totalItens = 0;
        let count = 0;

        items.forEach(item => {
            totalItens += item.price * item.qty;
            count += item.qty;
            const el = document.getElementById('total-' + item.id);
            if (el) el.textContent = CarrinhoController.fmt(item.price * item.qty);
        });

        const totalGeral = totalItens + CarrinhoController.valorFreteAtual;

        document.getElementById('cfTotal').textContent = CarrinhoController.fmt(totalItens);
        document.getElementById('summarySubtotal').textContent = CarrinhoController.fmt(totalItens);
        document.getElementById('summaryFrete').textContent = CarrinhoController.fmt(CarrinhoController.valorFreteAtual);
        document.getElementById('summaryTotal').textContent = CarrinhoController.fmt(totalGeral);

        const label = count + (count === 1 ? ' item' : ' itens');
        if (document.getElementById('cfCount')) document.getElementById('cfCount').textContent = label;
        document.getElementById('cartCountLabel').textContent = label + ' · selecionados';

        const sub = document.querySelector('.os-row .os-label');
        if (sub) sub.textContent = `Subtotal (${label})`;
    },

    alterarQty(id, delta) {
        if (typeof Cart === 'undefined') return;

        Cart.updateQty(id, delta);
        const items = Cart.get();
        const item = items.find(i => i.id === id);
        if (item) {
            const qtyEl = document.getElementById('qty-' + id);
            if (qtyEl) qtyEl.textContent = item.qty;
        }
        CarrinhoController.recalcular();
    },

    removerItem(id) {
        if (typeof Cart === 'undefined') return;

        const el = document.getElementById('ci-' + id);
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateX(-20px)';
            el.style.transition = 'opacity .22s, transform .22s';
            setTimeout(() => {
                Cart.remove(id);
                CarrinhoController.renderCart();
            }, 240);
        }
    },

    limparCarrinho() {
        if (typeof Cart === 'undefined' || Cart.count() === 0) return;
        if (!confirm('Deseja remover todos os itens do carrinho?')) return;

        const items = document.querySelectorAll('.cart-item');
        items.forEach((el, i) => {
            setTimeout(() => {
                el.style.opacity = '0';
                el.style.transform = 'translateX(-20px)';
                el.style.transition = 'opacity .2s, transform .2s';
            }, i * 60);
        });

        setTimeout(() => {
            Cart.save([]);
            Cart.updateBadge();
            CarrinhoController.renderCart();
        }, items.length * 60 + 220);
    },

    async finalizarPedido() {
        if (typeof Cart === 'undefined' || Cart.count() === 0) {
            alert('Adicione itens ao carrinho antes de finalizar.');
            return;
        }
        const idUsuarioLogado = sessionStorage.getItem('qp_id');
        if (!idUsuarioLogado || idUsuarioLogado === "null") {
            alert('Você precisa estar logado para finalizar o pedido. Por favor, faça login ou cadastre-se.');
            location.href = 'login.html'
            return;
        }

        const cepInput = document.getElementById('cepInput').value;
        const numeroInput = document.getElementById('numeroInput').value.trim();
        const addressForm = document.getElementById('deliveryAddressForm');

        if (addressForm.style.display === 'none' || !numeroInput) {
            alert('Por favor, calcule o CEP e preencha o número do endereço de entrega.');
            if(addressForm.style.display !== 'none') {
                document.getElementById('numeroInput').focus();
            }
            return;
        }

        const btnFinalizar = document.querySelector('.btn-finalizar');
        if (btnFinalizar) {
            btnFinalizar.disabled = true;
            btnFinalizar.innerHTML = 'Processando...';
        }

        const itensPedido = Cart.get().map(item => {
            const parteAntesDoTraco = item.ref.includes(' — ')
                ? item.ref.split(' — ')[0]
                : item.ref;
            const apenasNumeros = parteAntesDoTraco.replace(/\D/g, '');
            const idLimpo = parseInt(apenasNumeros, 10);

            return {
                idPeca: isNaN(idLimpo) ? 1 : idLimpo,
                quantidade: item.qty
            };
        });

        const payload = {
            idUsuario: parseInt(idUsuarioLogado, 10),
            valorFrete: CarrinhoController.valorFreteAtual,
            enderecoEntrega: {
                cep: cepInput.replace(/\D/g, ''),
                logradouro: document.getElementById('logradouroInput').value,
                numero: numeroInput,
                complemento: document.getElementById('complementoInput').value,
                bairro: document.getElementById('bairroInput').value,
                cidadeUf: document.getElementById('cidadeUfInput').value
            },
            itens: itensPedido
        };

        try {
            const response = await fetch('http://localhost:8080/pedidos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const text = await response.text();
                let message = 'Falha ao processar pedido.';
                try {
                    const json = JSON.parse(text);
                    message = json.message || message;
                } catch {
                }
                throw new Error(message);
            }

            const pedidoCriado = await response.json();
            sessionStorage.setItem('ultimoPedidoId', pedidoCriado.idPedido);

            Cart.save([]);
            Cart.updateBadge();
            CarrinhoController.renderCart();

            setTimeout(() => {
                location.href = 'pedidos.html';
            }, 800);

        } catch (error) {
            console.error('[API ERRO]:', error);
            alert('Erro ao salvar pedido no servidor: ' + error.message);

            if (btnFinalizar) {
                btnFinalizar.disabled = false;
                btnFinalizar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px"><polyline points="20 6 9 17 4 12"/></svg> Finalizar Pedido`;
            }
        }
    },

    async calcularFrete() {
        const cepInput = document.getElementById('cepInput');
        const feedback = document.getElementById('freteFeedback');
        const addressForm = document.getElementById('deliveryAddressForm');

        if (!cepInput || !feedback || !addressForm) return;

        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            feedback.style.color = '#ff4a4a';
            feedback.textContent = 'CEP inválido. Digite 8 números.';
            feedback.style.display = 'block';
            addressForm.style.display = 'none'; // Esconde se o CEP estiver errado
            return;
        }

        feedback.style.color = '#888';
        feedback.textContent = 'Buscando região...';
        feedback.style.display = 'block';

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await response.json();

            if (dados.erro) {
                throw new Error('CEP não encontrado');
            }

            // 1. Preenche os campos automaticamente com o retorno da API
            document.getElementById('logradouroInput').value = dados.logradouro || '';
            document.getElementById('bairroInput').value = dados.bairro || '';
            document.getElementById('cidadeUfInput').value = `${dados.localidade} / ${dados.uf}`;

            // 2. Mostra o formulário de endereço com a animação
            addressForm.style.display = 'block';

            // Regra de negócio do frete baseada na região
            let valorFrete = 25.00;
            if (dados.uf === 'DF') {
                valorFrete = 12.00;
            } else if (['SP', 'RJ', 'MG', 'GO'].includes(dados.uf)) {
                valorFrete = 22.00;
            }

            CarrinhoController.valorFreteAtual = valorFrete;

            feedback.style.color = 'var(--green, #4caf50)';
            feedback.textContent = `CEP Localizado! Frete: ${CarrinhoController.fmt(valorFrete)}`;

            CarrinhoController.recalcular();

        } catch (error) {
            feedback.style.color = '#ff4a4a';
            feedback.textContent = 'Erro ao buscar CEP. Tente novamente.';
            addressForm.style.display = 'none';
        }
    },

    gerarOrcamento() {
        window.print();
    }
};

function renderCart() {
    CarrinhoController.renderCart();
}

function alterarQty(id, d) {
    CarrinhoController.alterarQty(id, d);
}

function removerItem(id) {
    CarrinhoController.removerItem(id);
}

function limparCarrinho() {
    CarrinhoController.limparCarrinho();
}

function finalizarPedido() {
    CarrinhoController.finalizarPedido();
}

function gerarOrcamento() {
    CarrinhoController.gerarOrcamento();
}

function calcularFrete() {
    CarrinhoController.calcularFrete();
}

document.addEventListener('DOMContentLoaded', () => {
    CarrinhoController.init();
});