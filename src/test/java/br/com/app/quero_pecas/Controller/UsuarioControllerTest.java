package br.com.app.quero_pecas.Controller;

import br.com.app.quero_pecas.entity.Endereco;
import br.com.app.quero_pecas.entity.Telefone;
import br.com.app.quero_pecas.entity.TipoUsuario;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UsuarioControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        repository.deleteAll();

        Usuario usuario = new Usuario();
        usuario.setCnpj("15436940000103");
        usuario.setEmail("loja@pecas.com");
        usuario.setSenha(passwordEncoder.encode("senha123"));
        usuario.setRepresentanteLegal("Lojista Teste");
        usuario.setNomeFantasia("Fate é ruim");
        usuario.setRazaoSocial("É ruim pq sim");
        usuario.setTipoUsuario(TipoUsuario.MECANICO);

        Telefone telefone = new Telefone();
        telefone.setTelefone("61999994422");
        telefone.setTipo("Residencial");

        List<Telefone> telefoneList = List.of(telefone);
        usuario.setTelefone(telefoneList);

        Endereco endereco = new Endereco();
        endereco.setCep("04534000");
        endereco.setBairro("Centro");
        endereco.setCidade("Brasilia");
        endereco.setEstado("DF");
        endereco.setLogradouro("Ceilandia");
        endereco.setNumero(123);

        usuario.setEndereco(endereco);

        repository.save(usuario);
    }

    @Test
    @DisplayName("Cadastro realizado com sucesso deve retornar 201 e mensagem de sucesso")
    void deveCadastrarUsuarioComSucesso() throws Exception {
        String json = """
                {
                  "cnpj": "12654680000146",
                  "email": "nova.loja@pecas.com",
                  "senha": "senha123",
                  "representanteLegal": "Novo Lojista Teste",
                  "nomeFantasia": "Nova Loja de Peças",
                  "razaoSocial": "Nova Loja de Peças LTDA",
                  "tipoUsuario": "MECANICO",
                  "telefone": [
                    {
                      "telefone": "61999998888",
                      "tipo": "Comercial"
                    }
                  ],
                  "endereco": {
                    "cep": "04534000",
                    "bairro": "Centro",
                    "cidade": "Brasilia",
                    "estado": "DF",
                    "logradouro": "Rua das Peças",
                    "numero": 456
                  }
                }
                """;

        mockMvc.perform(post("/usuarios/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(content().string(containsString("Usuario cadastrado com sucesso!")));
    }

    @Test
    @DisplayName("Cadastro com CNPJ já existente deve retornar 400 e mensagem esperada")
    void deveRetornarBadRequestAoCadastrarUsuarioComCnpjJaExistente() throws Exception {
        String json = """
                {
                  "cnpj": "15436940000103",
                  "email": "outro.email@pecas.com",
                  "senha": "senha123",
                  "representanteLegal": "Outro Lojista",
                  "nomeFantasia": "Outra Loja",
                  "razaoSocial": "Outra Loja LTDA",
                  "tipoUsuario": "MECANICO",
                  "telefone": [
                    {
                      "telefone": "61999997777",
                      "tipo": "Comercial"
                    }
                  ],
                  "endereco": {
                    "cep": "04534000",
                    "bairro": "Centro",
                    "cidade": "Brasilia",
                    "estado": "DF",
                    "logradouro": "Rua Duplicada",
                    "numero": 789
                  }
                }
                """;

        mockMvc.perform(post("/usuarios/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("CNPJ já cadastrado no sistema.")));
    }

    @Test
    @DisplayName("Cadastro com campos obrigatórios inválidos deve retornar 400")
    void deveRetornarBadRequestQuandoCamposObrigatoriosForemInvalidosOuAusentes() throws Exception {
        String json = """
                {
                  "cnpj": "20402686000154",
                  "email": "loja.valida@pecas.com",
                  "senha": "",
                  "representanteLegal": "",
                  "nomeFantasia": "",
                  "razaoSocial": "",
                  "telefone": [],
                  "endereco": {
                    "cep": "",
                    "bairro": "",
                    "cidade": "",
                    "estado": "",
                    "logradouro": "",
                    "numero": ""
                  }
                }
                """;

        mockMvc.perform(post("/usuarios/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print()) //
                .andExpect(status().isBadRequest());

    }

    @Test
    @DisplayName("Cadastro com CNPJ muito curto deve retornar 400 bloqueado pelo DTO")
    void deveRetornarBadRequestQuandoCnpjTiverFormatoInvalido() throws Exception {
        String json = """
                {
                  "cnpj": "123",
                  "email": "loja.valida@pecas.com",
                  "senha": "senha123",
                  "representanteLegal": "Lojista",
                  "nomeFantasia": "Loja",
                  "razaoSocial": "Loja LTDA",
                  "telefone": [],
                  "endereco": {
                    "cep": "04534000",
                    "bairro": "Centro",
                    "cidade": "Brasilia",
                    "estado": "DF",
                    "logradouro": "Rua",
                    "numero": 321
                  }
                }
                """;

        mockMvc.perform(post("/usuarios/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isBadRequest())
                // Espera que o campo "cnpj" retorne um erro no JSON (barrado pelo @Size do DTO)
                .andExpect(jsonPath("$.cnpj").exists());
    }

    @Test
    @DisplayName("Cadastro com e-mail já existente deve retornar 400 e mensagem esperada")
    void deveRetornarBadRequestAoCadastrarUsuarioComEmailJaExistente() throws Exception {
        String json = """
                {
                  "cnpj": "20402686000154",
                  "email": "loja@pecas.com",
                  "senha": "senha123",
                  "representanteLegal": "Lojista Email Duplicado",
                  "nomeFantasia": "Loja Email Duplicado",
                  "razaoSocial": "Loja Email Duplicado LTDA",
                  "tipoUsuario": "MECANICO",
                  "telefone": [
                    {
                      "telefone": "61999995555",
                      "tipo": "Comercial"
                    }
                  ],
                  "endereco": {
                    "cep": "04534000",
                    "bairro": "Centro",
                    "cidade": "Brasilia",
                    "estado": "DF",
                    "logradouro": "Rua Email Duplicado",
                    "numero": 654
                  }
                }
                """;

        mockMvc.perform(post("/usuarios/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("E-mail já cadastrado no sistema.")));
    }

    @Test
    @DisplayName("Cadastro com e-mail inválido deve retornar 400 bloqueado pelo DTO")
    void deveRetornarBadRequestAoCadastrarUsuarioComEmailInvalido() throws Exception {
        String json = """
                {
                  "cnpj": "20402686000154",
                  "email": "email-invalido",
                  "senha": "senha123",
                  "representanteLegal": "Lojista",
                  "nomeFantasia": "Loja",
                  "razaoSocial": "Loja LTDA",
                  "telefone": [],
                  "endereco": {
                    "cep": "04534000",
                    "bairro": "Centro",
                    "cidade": "Brasilia",
                    "estado": "DF",
                    "logradouro": "Rua",
                    "numero": 987
                  }
                }
                """;

        mockMvc.perform(post("/usuarios/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andDo(print())
                .andExpect(status().isBadRequest())
                // Espera que o campo "email" retorne um erro no JSON (barrado pelo @Email do DTO)
                .andExpect(jsonPath("$.email").exists());
    }
}
