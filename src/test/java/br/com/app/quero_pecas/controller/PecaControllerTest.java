package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.dto.PecaDTO;
import br.com.app.quero_pecas.entity.Fabricante;
import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.PecaVeiculo;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.FabricanteRepository;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import br.com.app.quero_pecas.utils.TipoDeCombustivel;
import br.com.app.quero_pecas.utils.TipoPeca;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Year;
import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Transactional
public class PecaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private PecaRepository pecaRepository;

    @Autowired
    private PecaVeiculoRepository pecaVeiculoRepository;

    @Autowired
    private VeiculoRepository veiculoRepository;

    @Autowired
    private FabricanteRepository fabricanteRepository;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private Fabricante fabricante;
    private Veiculo veiculo;
    private Peca peca;

    @BeforeEach
    void setup() {
        pecaVeiculoRepository.deleteAll();
        pecaRepository.deleteAll();
        veiculoRepository.deleteAll();
        fabricanteRepository.deleteAll();

        // 1. Cadastra Fabricante
        fabricante = new Fabricante();
        fabricante.setCnpj("12345678000199");
        fabricante.setNome("Bosch");
        fabricante = fabricanteRepository.save(fabricante);

        // 2. Cadastra Veículo
        veiculo = new Veiculo();
        veiculo.setPlaca("ABC1234");
        veiculo.setChassi("CHASSI999");
        veiculo.setMarca("Honda");
        veiculo.setModelo("Civic");
        veiculo.setAnoFabricacao(Year.of(2020));
        veiculo.setTipoDeCombustivel(TipoDeCombustivel.FLEX);
        veiculo = veiculoRepository.save(veiculo);

        // 3. Cadastra Peça
        peca = new Peca();
        peca.setNome("Filtro de Óleo");
        peca.setCodigo("COD-FILTRO");
        peca.setDescricao("Filtro Bosch original");
        peca.setEstoque(15);
        peca.setPreco(45.90f);
        peca.setFabricante(fabricante);
        peca.setTipoPeca(TipoPeca.ORIGINAL);
        peca.setAtivo(true);
        peca = pecaRepository.save(peca);

        // 4. Associa Peça e Veículo
        PecaVeiculo pv = new PecaVeiculo();
        pv.setPeca(peca);
        pv.setVeiculo(veiculo);
        pecaVeiculoRepository.save(pv);
    }

    @Test
    @DisplayName("Deve buscar peças com busca inteligente por múltiplos filtros")
    void deveBuscarPecasPorBuscaInteligente() throws Exception {
        mockMvc.perform(get("/pecas/busca-inteligente")
                        .param("marca", "Honda")
                        .param("modelo", "Civic")
                        .param("ano", "2020")
                        .param("categoria", "Filtro de Óleo"))
                .andDo(print())
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("Deve buscar peças por código específico")
    void deveBuscarPecaPorCodigo() throws Exception {
        mockMvc.perform(get("/pecas/buscar-por-codigo")
                        .param("codigo", "COD-FILTRO"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nome").value("Filtro de Óleo"))
                .andExpect(jsonPath("$[0].codigo").value("COD-FILTRO"));
    }

    @Test
    @DisplayName("Deve salvar uma nova peça com sucesso")
    void deveSalvarNovaPeca() throws Exception {
        PecaDTO.Save saveDto = new PecaDTO.Save(
                "Freio",
                "COD-PASTILHA",
                "Pastilha de freio ceramica",
                10,
                fabricante.getIdFabricante(),
                "Pastilha Bosch",
                89.90,
                TipoPeca.PREMIUM,
                List.of(veiculo.getIdVeiculo())
        );

        mockMvc.perform(post("/pecas/save")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(saveDto)))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().string(containsString("Peça cadastrada com sucesso")));
    }

    @Test
    @DisplayName("Deve retornar a lista histórica de peças ativas")
    void deveListarHistoricoAtivo() throws Exception {
        mockMvc.perform(get("/pecas/historico"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nome").value("Filtro de Óleo"));
    }

    @Test
    @DisplayName("Deve retornar a lista histórica de associações ativas")
    void deveListarAssociacoesAtivas() throws Exception {
        mockMvc.perform(get("/pecas/associacoes"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    @DisplayName("Deve atualizar uma peça existente com sucesso")
    void deveAtualizarPecaExistente() throws Exception {
        PecaDTO.Save updateDto = new PecaDTO.Save(
                "Filtros",
                "COD-FILTRO",
                "Filtro Bosch atualizado",
                20,
                fabricante.getIdFabricante(),
                "Filtro de Óleo Renovado",
                50.00,
                TipoPeca.ORIGINAL,
                List.of(veiculo.getIdVeiculo())
        );

        mockMvc.perform(put("/pecas/" + peca.getIdPeca())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDto)))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Peça atualizada com sucesso!")));
    }

    @Test
    @DisplayName("Deve realizar a exclusão lógica (soft-delete) de uma peça com sucesso")
    void deveExcluirPecaComSucesso() throws Exception {
        mockMvc.perform(patch("/pecas/" + peca.getIdPeca() + "/deletar"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("Peça excluída com sucesso!")));
    }
}
