package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.PedidoDTO;
import br.com.app.quero_pecas.entity.*;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PedidoRepository;
import br.com.app.quero_pecas.utils.StatusEntrega;
import br.com.app.quero_pecas.utils.StatusPedido;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    // Inicializando o Logger manualmente (caso não queira usar o @Slf4j do Lombok no teste)
    private static final Logger log = LoggerFactory.getLogger(PedidoServiceTest.class);

    @InjectMocks
    private PedidoService pedidoService;

    @Mock
    private PedidoRepository pedidoRepository;
    @Mock
    private PecaRepository pecaRepository;

    private Peca pecaExemplo;
    private Pedido pedidoExemplo;

    @BeforeEach
    void setUp() {
        log.info("Iniciando o setup dos dados de teste...");

        pecaExemplo = new Peca();
        pecaExemplo.setIdPeca(1L);
        pecaExemplo.setNome("Amortecedor Dianteiro");
        pecaExemplo.setPreco(250.0);
        pecaExemplo.setEstoque(10);

        pedidoExemplo = new Pedido();
        pedidoExemplo.setIdPedido(1L);
        pedidoExemplo.setNumeroPedido("QP-12345678");
        pedidoExemplo.setStatus(StatusPedido.AGUARDANDO_PAGAMENTO);
        pedidoExemplo.setValorFrete(30.0);
        pedidoExemplo.setItens(new ArrayList<>());

        Entrega entregaExemplo = new Entrega();
        entregaExemplo.setIdEntrega(1L);
        entregaExemplo.setCodigoRastreio("QP-REFA1234BR");
        entregaExemplo.setStatusEntrega(StatusEntrega.AGUARDANDO_PAGAMENTO); // Garante o Enum correto de inicialização

        Endereco enderecoExemplo = new Endereco();
        enderecoExemplo.setCep("72660378");
        enderecoExemplo.setLogradouro("Quadra 511 Conjunto 26");
        enderecoExemplo.setNumero("1");
        enderecoExemplo.setComplemento("1");
        enderecoExemplo.setBairro("Recanto das Emas");
        enderecoExemplo.setCidadeUf("Brasília / DF");

        entregaExemplo.setEndereco(enderecoExemplo);
        entregaExemplo.setPedido(pedidoExemplo);
        pedidoExemplo.setEntrega(entregaExemplo);
    }

    @Test
    @DisplayName("Deve salvar o pedido com status aguardando pagamento e abater estoque")
    void deveSalvarPedidoComSucesso() {
        PedidoDTO.EnderecoEntregaRequest enderecoDto = new PedidoDTO.EnderecoEntregaRequest(
                "72660378", "Quadra 511 Conjunto 26", "1", "1", "Recanto das Emas", "Brasília / DF"
        );
        log.info("--- INICIANDO TESTE: deveSalvarPedidoComSucesso ---");
        PedidoDTO.ItemPedidoRequest itemRequest = new PedidoDTO.ItemPedidoRequest(1L, 2);
        PedidoDTO.PedidoRequest request = new PedidoDTO.PedidoRequest(1L, 30.0, enderecoDto, List.of(itemRequest));

        when(pecaRepository.findById(1L)).thenReturn(Optional.of(pecaExemplo));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> {
            Pedido p = invocation.getArgument(0);
            p.setIdPedido(1L);
            return p;
        });

        log.info("Executando a criação do pedido via PedidoService...");
        PedidoDTO.PedidoResponse response = pedidoService.save(request);

        log.info("Validando os resultados do pedido gerado...");
        assertNotNull(response);
        assertEquals(1L, response.idPedido());
        assertEquals(StatusPedido.AGUARDANDO_PAGAMENTO, response.status());
        assertEquals(530.0, response.valorTotal());

        log.info("Verificando se o estoque foi abatido corretamente...");
        assertEquals(8, pecaExemplo.getEstoque());

        verify(pecaRepository, times(1)).save(pecaExemplo);
        verify(pedidoRepository, times(1)).save(any(Pedido.class));

        log.info("--- TESTE FINALIZADO COM SUCESSO: Pedido criado com ID {} e valor total R$ {} ---", response.idPedido(), response.valorTotal());
    }

    @Test
    @DisplayName("Deve lançar exceção se tentar comprar quantidade maior do que o estoque")
    void deveLancarExcecaoQuandoEstoqueInsuficiente() {
        log.info("--- INICIANDO TESTE: deveLancarExcecaoQuandoEstoqueInsuficiente ---");
        PedidoDTO.EnderecoEntregaRequest enderecoDto = new PedidoDTO.EnderecoEntregaRequest(
                "72660378", "Quadra 511 Conjunto 26", "1", "1", "Recanto das Emas", "Brasília / DF"
        );
        PedidoDTO.ItemPedidoRequest itemRequest = new PedidoDTO.ItemPedidoRequest(1L, 15); // Pedindo mais do que tem (15 > 10)
        PedidoDTO.PedidoRequest request = new PedidoDTO.PedidoRequest(1L, 30.0, enderecoDto, List.of(itemRequest));

        when(pecaRepository.findById(1L)).thenReturn(Optional.of(pecaExemplo));

        log.info("Disparando a execução esperando falha de estoque...");
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            pedidoService.save(request);
        });

        log.info("Exceção capturada com a mensagem esperada: '{}'", exception.getMessage());
        assertEquals("Estoque insuficiente para a peça: Amortecedor Dianteiro", exception.getMessage());

        verify(pedidoRepository, never()).save(any(Pedido.class));
        log.info("--- TESTE FINALIZADO COM SUCESSO: O sistema impediu a venda por falta de estoque ---");
    }

    @Test
    @DisplayName("Deve atualizar pedido para PAGO e instanciar Entrega quando pagamento for aprovado")
    void deveAtualizarPedidoParaPagoECriarEntrega() {
        log.info("--- INICIANDO TESTE: deveAtualizarPedidoParaPagoECriarEntrega ---");

        PedidoDTO.AtualizarPagamentoRequest updateRequest = new PedidoDTO.AtualizarPagamentoRequest("PIX", "PAGO");

        when(pedidoRepository.findById(1L)).thenReturn(Optional.of(pedidoExemplo));
        when(pedidoRepository.save(any(Pedido.class))).thenReturn(pedidoExemplo);
        pedidoExemplo.setItens(Collections.emptyList());

        log.info("Status atual do pedido antes do update: {}", pedidoExemplo.getStatus());
        log.info("Enviando requisição de atualização para status 'PAGO'...");

        PedidoDTO.PedidoResponse response = pedidoService.update(1L, updateRequest);

        log.info("Validando transição de estados após aprovação do pagamento...");
        assertNotNull(response);
        assertEquals(StatusPedido.PAGO, pedidoExemplo.getStatus());
        assertNotNull(pedidoExemplo.getEntrega());

        log.info("Status novo do Pedido: {}", pedidoExemplo.getStatus());
        log.info("Status novo da Entrega: {}", pedidoExemplo.getEntrega().getStatusEntrega());

        verify(pedidoRepository, times(1)).save(pedidoExemplo);
        log.info("--- TESTE FINALIZADO COM SUCESSO: Pedido faturado e enviado para a logística ---");
    }
}