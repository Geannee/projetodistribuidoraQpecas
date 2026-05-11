package br.com.app.quero_pecas.Controller;

import br.com.app.quero_pecas.entity.Peca;
import br.com.app.quero_pecas.entity.PecaVeiculo;
import br.com.app.quero_pecas.entity.Veiculo;
import br.com.app.quero_pecas.repository.PecaRepository;
import br.com.app.quero_pecas.repository.PecaVeiculoRepository;
import br.com.app.quero_pecas.repository.VeiculoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Year;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class PecaControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private VeiculoRepository veiculoRepository;
    @Autowired
    private PecaRepository pecaRepository;
    @Autowired
    private PecaVeiculoRepository pecaVeiculoRepository;

    @BeforeEach
    void setup() {
        pecaVeiculoRepository.deleteAll();
        pecaRepository.deleteAll();
        veiculoRepository.deleteAll();

        // Cria um veículo
        Veiculo veiculo = new Veiculo();
        veiculo.setPlaca("ABC1234");
        veiculo.setModelo("Civic");
        veiculo.setMarca("Honda");
        veiculo.setAnoFabricacao(Year.of(2020));
        veiculo = veiculoRepository.save(veiculo);

        // Cria algumas peças
        Peca peca1 = new Peca();
        peca1.setNome("Filtro de Óleo");
        peca1.setPrecoBase(25.90f);
        peca1.setEstoque(10);
        peca1 = pecaRepository.save(peca1);

        Peca peca2 = new Peca();
        peca2.setNome("Pastilha de Freio");
        peca2.setPrecoBase(89.90f);
        peca2.setEstoque(5);
        peca2 = pecaRepository.save(peca2);

        // Associa as peças ao veículo via tabela de ligação
        PecaVeiculo pv1 = new PecaVeiculo();
        pv1.setVeiculo(veiculo);
        pv1.setPeca(peca1);
        pecaVeiculoRepository.save(pv1);

        PecaVeiculo pv2 = new PecaVeiculo();
        pv2.setVeiculo(veiculo);
        pv2.setPeca(peca2);
        pecaVeiculoRepository.save(pv2);
    }

    @Test
    @DisplayName("Cenário 01: Placa válida -> retornar listas de peças")
    void buscarPecasPorPlaca_DeveRetornar200() throws Exception {
        mockMvc.perform(get("/pecas/findByPlaca")
                    .param("placa", "ABC-1234"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("[0].nome").value("Filtro de Óleo"));
    }

    @Test
    @DisplayName("Cenário 02: Placa não encontrada -> 404 com mensagem")
    void buscarPecasPorPlaca_PlacaNaoEcontrada_DeveRetornar404() throws Exception {
        mockMvc.perform(get("/pecas/findByPlaca")
                    .param("placa", "CBA-4321"))
                .andDo(print())
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("Placa não encontrada. Tente buscar por modelo")));
    }
}
