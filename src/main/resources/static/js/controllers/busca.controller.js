/**
 * CONTROLLER: Intercepta eventos e orquestra a comunicação entre Model e View
 */
const BuscaController = {

    /**
     * Disparado pelo onchange="onMarcaChange()" do select de Marca
     */
    async lidarComMudancaMarca() {
        const marcaSelecionada = BuscaView.selectMarca.value;

        if (!marcaSelecionada) {
            BuscaView.popularModelos([]); // Limpa e desabilita caso selecione a opção padrão
            return;
        }

        // Aciona o Model para buscar e a View para renderizar a mudança do select secundário
        const modelos = await BuscaModel.obterModelosPorMarca(marcaSelecionada);
        BuscaView.popularModelos(modelos);
    },
    async lidarComMudancaModelo() {

        const modeloSelecionado = BuscaView.selectModelo.value;

        // if (!modeloSelecionado) {
        //     BuscaView.popularAno([]); // Limpa e desabilita caso selecione a opção padrão
        //     return;
        // }

        // Aciona o Model para buscar e a View para renderizar a mudança do select secundário
        const anos = await BuscaModel.obterAnoPorModelo(modeloSelecionado);
        BuscaView.popularAno(anos);
    },
    /**
     * Disparado pelo onclick="searchApp()" no botão "Buscar peças →"
     */
    async lidarComBuscaAplicacao() {
        // Captura os estados atuais do formulário mapeado na View
        const marca = BuscaView.selectMarca.value;
        const modelo = BuscaView.selectModelo.value;
        const ano = BuscaView.selectAno.value ? parseInt(BuscaView.selectAno.value) : null;
        const categoria = BuscaView.selectCategoria.value;

        // Aciona o modelo para buscar no endpoint /pecas/busca-inteligente
        const pecasFiltradas = await BuscaModel.buscarPecasInteligente(marca, modelo, ano, categoria);

        // Envia o payload retornado pelo banco para a View renderizar dinamicamente na tela
        BuscaView.renderizarPecas(pecasFiltradas, { marca, modelo, ano, categoria });
    }
};

// Vinculação explícita com as funções globais chamadas inline via atributos do HTML original
window.onMarcaChange = () => BuscaController.lidarComMudancaMarca();
window.onModeloChange = () => BuscaController.lidarComMudancaModelo();
window.searchApp = () => BuscaController.lidarComBuscaAplicacao();

// Função dummy de troca de abas mantida para preservar o comportamento visual do seu painel esquerdo
window.switchTab = function(tabName) {
    document.querySelectorAll('.stab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.stab-content').forEach(content => content.classList.remove('active'));

    const activeBtn = document.getElementById(`stab-btn-${tabName}`);
    const activeContent = document.getElementById(`stab-${tabName}`);

    if(activeBtn) activeBtn.classList.add('active');
    if(activeContent) activeContent.classList.add('active');
};





// // Mapeamento marca → modelos
// const MODELOS_POR_MARCA = {
//     'Chevrolet': ['Blazer', 'Celta', 'Classic', 'Cobalt', 'Cruze', 'Meriva', 'Montana',
//         'Onix', 'Prisma', 'S10', 'Spin', 'Tracker', 'Trailblazer', 'Zafira'],
//     'Citroën': ['Berlingo', 'C3', 'C4', 'C4 Cactus', 'C4 Picasso', 'C5', 'DS3', 'Jumpy', 'Xsara'],
//     'Fiat': ['Argo', 'Bravo', 'Cronos', 'Doblo', 'Ducato', 'Fastback', 'Grand Siena',
//         'Linea', 'Mobi', 'Palio', 'Pulse', 'Siena', 'Strada', 'Toro', 'Uno'],
//     'Ford': ['Courier', 'EcoSport', 'Edge', 'Fiesta', 'Focus', 'Fusion', 'Ka',
//         'Ranger', 'Territory'],
//     'Honda': ['City', 'Civic', 'CR-V', 'Fit', 'HR-V', 'WR-V'],
//     'Hyundai': ['Azera', 'Creta', 'HB20', 'HB20S', 'HB20X', 'i30', 'IX35', 'Santa Fe',
//         'Sonata', 'Tucson'],
//     'Jeep': ['Cherokee', 'Commander', 'Compass', 'Gladiator', 'Renegade', 'Wrangler'],
//     'Kia': ['Bongo', 'Carens', 'Carnival', 'Cerato', 'Optima', 'Seltos', 'Sorento',
//         'Soul', 'Sportage', 'Stinger'],
//     'Peugeot': ['207', '208', '2008', '3008', '307', '308', '408', '5008',
//         'Boxer', 'Expert', 'Partner'],
//     'Renault': ['Captur', 'Clio', 'Duster', 'Fluence', 'Kardian', 'Kwid', 'Logan',
//         'Master', 'Megane', 'Oroch', 'Sandero', 'Symbol'],
//     'Toyota': ['Bandeirante', 'Camry', 'Corolla', 'Corolla Cross', 'Etios', 'Fielder',
//         'Hilux', 'Land Cruiser', 'Prado', 'RAV4', 'SW4', 'Yaris'],
//     'Volkswagen': ['Amarok', 'Fox', 'Fusca', 'Gol', 'Golf', 'Jetta', 'Kombi', 'Nivus',
//         'Parati', 'Polo', 'Saveiro', 'T-Cross', 'Taos', 'Tiguan', 'Up!', 'Virtus', 'Voyage'],
// };
//
// const BuscaController = {
//
//     veiculos: [],
//     pecas: [],
//
//     async init() {
//         // Carrega base de veículos e peças do JSON local
//         try {
//             const [resV, resP] = await Promise.all([
//                 fetch('../static/veiculos.json'),
//                 fetch('../static/pecas.json')
//             ]);
//             this.veiculos = await resV.json();
//             this.pecas    = await resP.json();
//         } catch (e) {
//             this.veiculos = [];
//             this.pecas    = [];
//         }
//
//         const inputPlate = document.getElementById('plateInput');
//         if (inputPlate) {
//             inputPlate.addEventListener('keydown', e => {
//                 if (e.key === 'Enter') this.searchPlate();
//             });
//         }
//
//         const inputCode = document.getElementById('codeInput');
//         if (inputCode) {
//             inputCode.addEventListener('keydown', e => {
//                 if (e.key === 'Enter') searchCode();
//             });
//         }
//     },
//
//     _normalizePlate(p) {
//         return p.toUpperCase().replace(/[^A-Z0-9]/g, '');
//     },
//
//     async searchPlate() {
//         const input = document.getElementById('plateInput');
//         const placa = input.value.trim();
//
//         if (!placa || placa.length < 7) {
//             input.style.borderColor = '#ef4444';
//             input.focus();
//             setTimeout(() => {
//                 input.style.borderColor = '';
//             }, 1500);
//             return;
//         }
//         try {
//             const response = await fetch(`http://localhost:8080/veiculos/findByPlaca?placa=${encodeURIComponent(placa)}`);
//             if (!response.ok) {
//                 if (response.status === 404) {
//                     const mensagem = await response.text();
//                     BuscaView.mostrarNaoEncontrado(mensagem || `Placa "${placa}" não encontrada. Tente buscar por modelo.`);
//                 } else {
//                     throw new Error(`Erro HTTP ${response.status}`);
//                 }
//                 return;
//             }
//             const data = await response.json(); // { veiculo, pecas }
//             BuscaView.mostrarResultados(data.veiculo, data.pecas);
//         } catch (error) {
//             console.error('Erro na busca por placa:', error);
//             BuscaView.mostrarNaoEncontrado('Erro de conexão com o servidor. Tente novamente mais tarde.');
//         }
//     },
//
//     resetSearch() {
//         BuscaView.ocultarResultados();
//     },
//
//     togglePart(id) {
//         BuscaView.togglePart(id);
//     },
//
//     filterEquiv(btn) {
//         BuscaView.filtrarEquivalencias(btn);
//     },
//
//      switchTab(tab) {
//         document.querySelectorAll('.stab').forEach(b => b.classList.remove('active'));
//         const btn = document.getElementById(`stab-btn-${tab}`);
//         if (btn) btn.classList.add('active');
//
//         document.querySelectorAll('.stab-content').forEach(c => c.classList.remove('active'));
//         const content = document.getElementById(`stab-${tab}`);
//         if (content) content.classList.add('active');
//     }
// };
//
// // Aliases globais para chamadas inline no HTML
// function searchPlate() {
//     BuscaController.searchPlate();
// }
//
// function resetSearch() {
//     BuscaController.resetSearch();
// }
//
// function togglePart(id) {
//     BuscaController.togglePart(id);
// }
//
// function filterEquiv(btn) {
//     BuscaController.filterEquiv(btn);
// }
//
// function switchTab(tab) {
//     BuscaController.switchTab(tab);
// }
//
// function searchApp() {
//     const marca = document.getElementById('appMarca').value;
//     const modelo = document.getElementById('appModelo').value;
//     const ano = document.getElementById('appAno').value;
//     const categoria = document.getElementById('appCategoria').value;
//
//     if (!marca) {
//         const sel = document.getElementById('appMarca');
//         sel.style.borderColor = '#ef4444';
//         sel.focus();
//         setTimeout(() => {
//             sel.style.borderColor = '';
//         }, 1500);
//         return;
//     }
//
//     // Filtra peças pela categoria selecionada (ou todas se não selecionada)
//     const pecasFiltradas = categoria
//         ? BuscaController.pecas.filter(p => p.categoria === categoria)
//         : BuscaController.pecas;
//
//     const appData = {marca, modelo, ano, categoria};
//     BuscaView.mostrarResultadosApp(appData, pecasFiltradas);
// }
//
// function searchCode() {
//     const input = document.getElementById('codeInput');
//     const codigo = input.value.trim();
//
//     if (!codigo || codigo.length < 2) {
//         input.style.borderColor = '#ef4444';
//         input.focus();
//         setTimeout(() => {
//             input.style.borderColor = '';
//         }, 1500);
//         return;
//     }
//
//     const termo = codigo.toLowerCase().replace(/[\s\-\.]/g, '');
//
//     const resultados = BuscaController.pecas
//         .map(cat => ({
//             ...cat,
//             opcoes: cat.opcoes.filter(op =>
//                 op.ref.toLowerCase().replace(/[\s\-\.]/g, '').includes(termo) ||
//                 op.marca.toLowerCase().includes(codigo.toLowerCase())
//             )
//         }))
//         .filter(cat => cat.opcoes.length > 0);
//
//     BuscaView.mostrarResultadosCodigo(codigo, resultados);
// }
//
// function onMarcaChange() {
//     const marca = document.getElementById('appMarca').value;
//     const select = document.getElementById('appModelo');
//     const modelos = MODELOS_POR_MARCA[marca] || [];
//
//     // Reseta modelo
//     select.innerHTML = '<option value="">Modelo</option>';
//     select.disabled = modelos.length === 0;
//
//     modelos.forEach(m => {
//         const opt = document.createElement('option');
//         opt.value = m;
//         opt.textContent = m;
//         select.appendChild(opt);
//     });
// }
//
// BuscaController.init();
