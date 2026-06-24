/**
 * CONTROLLER: Intercepta eventos e orquestra a comunicação entre Model e View
 */
const BuscaController = {

    async init() {
        try {
            const veiculos = await BuscaModel.getVeiculos();
            const marcasUnicas = [...new Set(veiculos.map(v => v.marca))].sort();
            BuscaView.popularMarcas(marcasUnicas);
        } catch (error) {
            console.error("Erro ao inicializar dados de busca:", error);
        }
    },

    /**
     * Disparado pelo onchange="onMarcaChange()" do select de Marca
     */
    async lidarComMudancaMarca() {
        const marcaSelecionada = BuscaView.selectMarca.value;

        if (!marcaSelecionada) {
            BuscaView.popularModelos([]); // Limpa e desabilita caso selecione a opção padrão
            BuscaView.popularAno([]); // Limpa e desabilita ano
            return;
        }

        // Aciona o Model para buscar e a View para renderizar a mudança do select secundário
        const modelos = await BuscaModel.obterModelosPorMarca(marcaSelecionada);
        BuscaView.popularModelos(modelos);
        BuscaView.popularAno([]); // Limpa e desabilita ano
    },

    async lidarComMudancaModelo() {
        const modeloSelecionado = BuscaView.selectModelo.value;

        if (!modeloSelecionado) {
            BuscaView.popularAno([]);
            return;
        }

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
    },

    /**
     * NOVO: Disparado pelo clique no botão de buscar por placa
     */
    async lidarComBuscaPlaca() {
        const placa = BuscaView.plateInput ? BuscaView.plateInput.value.trim() : '';

        // Validação básica do tamanho da placa
        if (!placa || placa.length < 7) {
            BuscaView.destacarErroInputPlaca();
            return;
        }

        // Chama o Model para bater no endpoint do Spring Boot
        const data = await BuscaModel.buscarPorPlaca(placa);

        if (!data || !data.veiculo) {
            BuscaView.mostrarNaoEncontrado(`A placa "${placa.toUpperCase()}" não foi localizada no sistema.`);
            return;
        }

        // REUTILIÇÃO DO SEU CODIGO: Aproveita o seu template e agrupamento de acordeon!
        // Passamos a lista de peças vindas da placa e um objeto simulando os filtros para o subtítulo
        const filtroFake = {
            marca: `${data.veiculo.marca} ${data.veiculo.modelo} (${data.veiculo.placa.toUpperCase()})`,
            categoria: 'Compatíveis'
        };

        BuscaView.renderizarPecas(data.pecas, filtroFake);
    }
};

// Vinculação explícita com as funções globais chamadas inline via atributos do HTML original
window.onMarcaChange = () => BuscaController.lidarComMudancaMarca();
window.onModeloChange = () => BuscaController.lidarComMudancaModelo();
window.searchApp = () => BuscaController.lidarComBuscaAplicacao();
window.searchPlate = () => BuscaController.lidarComBuscaPlaca();

// Função dummy de troca de abas mantida para preservar o comportamento visual do seu painel esquerdo
window.switchTab = function(tabName) {
    document.querySelectorAll('.stab').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.stab-content').forEach(content => content.classList.remove('active'));

    const activeBtn = document.getElementById(`stab-btn-${tabName}`);
    const activeContent = document.getElementById(`stab-${tabName}`);

    if(activeBtn) activeBtn.classList.add('active');
    if(activeContent) activeContent.classList.add('active');
};

// Inicializa o Controller
BuscaController.init();