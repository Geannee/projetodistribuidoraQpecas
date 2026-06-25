// ── MASKS UTILS ───────────────────────────────────────────────────────────────
// Máscaras de entrada compartilhadas entre todas as páginas
// ─────────────────────────────────────────────────────────────────────────────

const Masks = {

  valor(input) {
    let v = input.value.replace(/\D/g, '');
    v = (parseInt(v || '0') / 100).toFixed(2);
    input.value = isNaN(v) ? '' : v.replace('.', ',');
  },

  cnpj(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 14);
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    input.value = v;
  },

  cep(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 8);
    v = v.replace(/(\d{5})(\d)/, '$1-$2');
    input.value = v;
  },

  telefone(input) {
    let v = input.value.replace(/\D/g, '').slice(0, 11);
    v = v.replace(/^(\d{2})(\d)/, '($1) $2');
    v = v.replace(/(\d{5})(\d{4})$/, '$1-$2');
    input.value = v;
  }
};

// Aliases globais para chamadas inline nos HTML
function mascaraValor(input)   { Masks.valor(input); }
function mascaraCNPJ(input)    { Masks.cnpj(input); }
function mascaraCEP(input)     { Masks.cep(input); }
function mascaraTelefone(input){ Masks.telefone(input); }
