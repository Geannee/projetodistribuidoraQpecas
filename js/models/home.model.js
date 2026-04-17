// ── HOME MODEL ────────────────────────────────────────────────────────────────
// Dados estáticos da página inicial
// ─────────────────────────────────────────────────────────────────────────────

const HomeModel = {

  ofertas: [
    {
      titulo: 'Oferta do Dia',
      sub: 'Peças com os melhores preços · Atualizado diariamente',
      produtos: [
        { icon: '🔩', marca: 'MONROE', nome: 'Kit Suspensão Completo',  ref: 'Ref: MONKSC001', de: 'R$484,03', por: 'R$364,03', desc: '-25%' },
        { icon: '⚙',  marca: 'COFAP',  nome: 'Kit Amortecedor Diant.',  ref: 'Ref: CF-80025',  de: 'R$490,00', por: 'R$380,00', desc: '-22%' },
        { icon: '🛑', marca: 'TRW',    nome: 'Pastilha de Freio Kit',   ref: 'Ref: GDB1497K',  de: 'R$280,00', por: 'R$210,00', desc: '-25%' },
      ]
    },
    {
      titulo: 'Oferta do Dia',
      sub: 'Kits de manutenção preventiva com desconto especial',
      produtos: [
        { icon: '🔧', marca: 'BOSCH', nome: 'Kit Revisão Completo',   ref: 'Ref: BKR-7810',  de: 'R$560,25', por: 'R$415,25', desc: '-26%' },
        { icon: '💧', marca: 'MANN',  nome: 'Kit Filtros Completo',   ref: 'Ref: MK-FLT22',  de: 'R$349,00', por: 'R$315,26', desc: '-10%' },
        { icon: '⚙',  marca: 'LUK',   nome: 'Kit Embreagem Completo', ref: 'Ref: LK-624398', de: 'R$469,00', por: 'R$398,33', desc: '-15%' },
      ]
    },
    {
      titulo: 'Oferta do Dia',
      sub: 'Peças elétricas e eletrônicas com garantia de fábrica',
      produtos: [
        { icon: '🔋', marca: 'MOURA', nome: 'Bateria Automotiva 60Ah', ref: 'Ref: MF60LD',  de: 'R$589,90', por: 'R$449,90', desc: '-24%' },
        { icon: '⚡', marca: 'NGK',   nome: 'Kit Velas Iridium',       ref: 'Ref: ILFR6B',  de: 'R$260,00', por: 'R$196,00', desc: '-25%' },
        { icon: '⚡', marca: 'BOSCH', nome: 'Alternador Remanufat.',   ref: 'Ref: AL-0123',  de: 'R$520,00', por: 'R$398,33', desc: '-23%' },
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
