// ── HOME MODEL ────────────────────────────────────────────────────────────────
// Dados estáticos da página inicial
// ─────────────────────────────────────────────────────────────────────────────

const HomeModel = {

  ofertas: [
    {
      titulo: 'Oferta do Dia',
      sub: 'Peças com os melhores preços · Atualizado diariamente',
      produtos: [
        { img: 'images/kitcoxim.webp',     marca: 'COFAP', nome: 'Kit Suspensão Completo',  ref: 'Ref: MONKSC001', de: 'R$484,03', por: 'R$364,03', desc: '-25%' },
        { img: 'images/amortecedor.png',     marca: 'COFAP',  nome: 'Kit Amortecedor Diant.',  ref: 'Ref: CF-80025',  de: 'R$490,00', por: 'R$380,00', desc: '-22%' },
        { img: 'images/Fraslepasti.png',     marca: 'TRW',    nome: 'Pastilha de Freio Kit',   ref: 'Ref: GDB1497K',  de: 'R$280,00', por: 'R$210,00', desc: '-25%' },
      ]
    },
    {
      titulo: 'Oferta do Dia',
      sub: 'Kits de manutenção preventiva com desconto especial',
      produtos: [
        { img: 'images/filtrosbosch.webp',    marca: 'BOSCH', nome: 'Kit Revisão Completo',   ref: 'Ref: BKR-7810',  de: 'R$560,25', por: 'R$415,25', desc: '-26%' },
        { img: 'images/filtrosMann.webp',    marca: 'MANN',  nome: 'Kit Filtros Completo',   ref: 'Ref: MK-FLT22',  de: 'R$349,00', por: 'R$315,26', desc: '-10%' },
        { img: 'images/SachsKitEmbreagem.webp', marca: 'SACHS',   nome: 'Kit Embreagem Completo', ref: 'Ref: Sachs 6291', de: 'R$469,00', por: 'R$398,33', desc: '-15%' },
      ]
    },
    {
      titulo: 'Oferta do Dia',
      sub: 'Peças elétricas e eletrônicas com garantia de fábrica',
      produtos: [
        { img: 'images/BobinaIgnição.webp', marca: 'BOSCH', nome: 'Bobina Ignição Bosch',     ref: 'Ref: F000TE159H',  de: 'R$589,90', por: 'R$449,90', desc: '-24%' },
        { img: 'images/velairidiumNGK.webp', marca: 'NGK',   nome: 'Kit Velas Iridium',       ref: 'Ref: ILFR6B',  de: 'R$260,00', por: 'R$196,00', desc: '-25%' },
        { img: 'images/cabovelaNGK.png',     marca: 'NGK', nome: 'Cabo de Vela NGK',   ref: 'Ref: STV-25',  de: 'R$520,00', por: 'R$398,33', desc: '-23%' },
      ]
    }
  ],

  heroSlides: [
    'images/amortecedor.png',
    'images/pistao com anel.png',
    'images/peçasfiltros.png',
    'images/Fraslepasti.png'
  ]
};
