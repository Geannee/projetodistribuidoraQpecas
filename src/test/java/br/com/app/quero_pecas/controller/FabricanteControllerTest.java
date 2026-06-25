package br.com.app.quero_pecas.controller;

import br.com.app.quero_pecas.entity.Fabricante;
import br.com.app.quero_pecas.repository.FabricanteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class FabricanteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private FabricanteRepository fabricanteRepository;

    @BeforeEach
    void setup() {
        fabricanteRepository.deleteAll();
    }

    @Test
    @DisplayName("Deve cadastrar fabricante com sucesso")
    void deveCadastrarFabricanteComSucesso() throws Exception {
        String json = """
                {
                  "cnpj": "12345678000199",
                  "nome": "Fabricante de Teste"
                }
                """;

        mockMvc.perform(post("/fabricantes/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isCreated())
                .andExpect(content().string(containsString("Fabricante cadastrado com sucesso!")));
    }

    @Test
    @DisplayName("Deve retornar 400 se campos obrigatórios do fabricante estiverem ausentes")
    void deveRetornarBadRequestAoCadastrarFabricanteInvalido() throws Exception {
        String json = """
                {
                  "cnpj": "",
                  "nome": ""
                }
                """;

        mockMvc.perform(post("/fabricantes/cadastro")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Deve retornar a lista histórica de fabricantes cadastrados")
    void deveRetornarHistoricoDeFabricantes() throws Exception {
        Fabricante fabricante = new Fabricante();
        fabricante.setCnpj("12345678000199");
        fabricante.setNome("Bosch");
        fabricanteRepository.save(fabricante);

        mockMvc.perform(get("/fabricantes/historico"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].nome").value("Bosch"))
                .andExpect(jsonPath("$[0].cnpj").value("12345678000199"));
    }
}
