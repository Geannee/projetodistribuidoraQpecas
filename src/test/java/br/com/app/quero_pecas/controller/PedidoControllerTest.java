package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.PedidoDTO;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PedidoRepository;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import br.com.app.quero_pecas.utils.StatusPedido;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PedidoControllerTest {
    private static final Logger log = LoggerFactory.getLogger(PedidoControllerTest.class);

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private PecaRepository pecaRepository;
    @Autowired
    private PedidoRepository pedidoRepository;

    // 1. Injete o repository do usuário para preparar o cenário real
    @Autowired
    private UsuarioRepository usuarioRepository;

    private Peca pecaSalva;
    private Usuario usuarioSalvo; // Guarda a referência do usuário criado

    @BeforeEach
    void setup() {
        log.info("[INTEGRAÇÃO] Limpando o banco de dados e preparando cenário...");
        pedidoRepository.deleteAll();
        pecaRepository.deleteAll();
        usuarioRepository.deleteAll(); // Limpa a tabela de usuários

        // 2. Cria e persiste um Usuário real para o teste de integridade referencial
        Usuario usuario = new Usuario();
        // preencha os campos obrigatórios da sua entidade (ex: nome, email, senha)
        usuario.setRepresentanteLegal("Isaque Teste");
        usuario.setEmail("isaque@teste.com");
        usuarioSalvo = usuarioRepository.save(usuario);

        // 3. Cria e persiste a Peça
        Peca peca = new Peca();
        peca.setNome("Pastilha de Freio");
        peca.setPreco(120.0);
        peca.setEstoque(5);
        pecaSalva = pecaRepository.save(peca);

        log.info("[INTEGRAÇÃO] Cenário pronto. Usuário ID: {}, Peça ID: {}",
                usuarioSalvo.getIdUsuario(), pecaSalva.getIdPeca());
    }

    @Test
    @DisplayName("Fluxo Completo: Deve criar pedido e depois atualizar para PAGO com sucesso via HTTP")
    void deveExecutarFluxoCompletoDePedido() throws Exception {
        log.info("--- INICIANDO TESTE DE INTEGRAÇÃO: Fluxo Completo de Compra ---");

        PedidoDTO.EnderecoEntregaRequest enderecoDto = new PedidoDTO.EnderecoEntregaRequest(
                "72660378", "Quadra 511 Conjunto 26", "1", "1", "Recanto das Emas", "Brasília / DF"
        );

        PedidoDTO.ItemPedidoRequest itemRequest = new PedidoDTO.ItemPedidoRequest(pecaSalva.getIdPeca(), 2);

        // 4. CORREÇÃO AQUI: Usa o ID dinâmico gerado pelo banco em vez de fixar 1L
        PedidoDTO.PedidoRequest pedidoRequest = new PedidoDTO.PedidoRequest(
                usuarioSalvo.getIdUsuario(), 20.0, enderecoDto, List.of(itemRequest)
        );

        log.info("[PASSO 1] Disparando POST /pedidos para criar a intenção de compra...");

        MvcResult resultPost = mockMvc.perform(post("/pedidos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pedidoRequest)))
                .andExpect(status().isCreated())
                .andReturn();

        String jsonRespostaPost = resultPost.getResponse().getContentAsString();
        PedidoDTO.PedidoResponse pedidoResponse = objectMapper.readValue(jsonRespostaPost, PedidoDTO.PedidoResponse.class);

        assertNotNull(pedidoResponse.idPedido());
        assertEquals(StatusPedido.AGUARDANDO_PAGAMENTO, pedidoResponse.status());
        assertEquals(260.0, pedidoResponse.valorTotal());
        assertNotNull(pedidoResponse.idEntrega());

        log.info("[PASSO 1 SUCESSO] Pedido criado no banco com ID: {} e Status: {}", pedidoResponse.idPedido(), pedidoResponse.status());

        Peca pecaNoBancoPosCompra = pecaRepository.findById(pecaSalva.getIdPeca()).orElseThrow();
        assertEquals(3, pecaNoBancoPosCompra.getEstoque());
        log.info("[PASSO 1 ESTOQUE] Verificado no banco. Estoque atual da peça: {}", pecaNoBancoPosCompra.getEstoque());

        PedidoDTO.AtualizarPagamentoRequest pagamentoRequest = new PedidoDTO.AtualizarPagamentoRequest("CARTAO", "PAGO");

        log.info("[PASSO 2] Disparando PUT /pedidos/{} para simular aprovação do pagamento...", pedidoResponse.idPedido());

        MvcResult resultPut = mockMvc.perform(put("/pedidos/" + pedidoResponse.idPedido())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pagamentoRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String jsonRespostaPut = resultPut.getResponse().getContentAsString();
        PedidoDTO.PedidoResponse pedidoAtualizadoResponse = objectMapper.readValue(jsonRespostaPut, PedidoDTO.PedidoResponse.class);

        assertEquals(StatusPedido.PAGO, pedidoAtualizadoResponse.status());
        assertNotNull(pedidoAtualizadoResponse.idEntrega());

        log.info("[PASSO 2 SUCESSO] Pagamento Processado! Status do pedido: {}, ID da Entrega Gerada: {}",
                pedidoAtualizadoResponse.status(), pedidoAtualizadoResponse.idEntrega());

        log.info("--- TESTE DE INTEGRAÇÃO FINALIZADO COM SUCESSO ---");
    }
}
