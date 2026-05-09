package br.com.app.quero_pecas.Controller;

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

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AuthControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final String JSON_CNPJ_INVALIDO = "{\"login\": \"11.111.111/1111-11\", \"senha\": \"senha111\"}";
    private static final String LOGIN_SUCESSO_CNPJ = "{\"login\": \"15.436.940/0001-03\", \"senha\": \"senha123\"}";
    private static final String LOGIN_SUCESSO_EMAIL = "{\"login\": \"loja@pecas.com\", \"senha\": \"senha123\"}";
    private static final String SENHA_INCORRETA = "{\"login\": \"15.436.940/0001-03\", \"senha\": \"senha_errada\"}";
    private static final String MSG_ERRO = "Login ou Senha inválidos";

    @BeforeEach
    void setup() {
        repository.deleteAll();

        Usuario usuario = new Usuario();
        usuario.setCnpj("15436940000103");
        usuario.setEmail("loja@pecas.com");
        usuario.setSenha(passwordEncoder.encode("senha123"));
        usuario.setRepresentanteLegal("Lojista Teste");
        usuario.setTipoUsuario(TipoUsuario.MECANICO);
        repository.save(usuario);
    }

    @Test
    @DisplayName("CA: Login com CNPJ válido e mascarado deve retornar 200")
    void loginSucessoCnpj() throws Exception {

        mockMvc.perform(post("/auth/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(LOGIN_SUCESSO_CNPJ))
                .andDo(print())
                .andExpectAll(
                        status().isOk(),
                        jsonPath("$.token").exists(),
                        jsonPath("$.id").exists(),
                        jsonPath("$.nome").exists(),
                        jsonPath("$.tipoUsuario").exists()
                );
    }

    @Test
    @DisplayName("CA: Login com E-mail válido e mascarado deve retornar 200")
    void loginSucessoEmail() throws Exception {
        mockMvc.perform(post("/auth/")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(LOGIN_SUCESSO_EMAIL))
                .andDo(print())
                .andExpectAll(
                        status().isOk(),
                        jsonPath("$.token").exists(),
                        jsonPath("$.id").exists(),
                        jsonPath("$.nome").exists(),
                        jsonPath("$.tipoUsuario").exists()
                );

    }

    @Test
    @DisplayName("CA: Bloqueio de CNPJ matematicamente inválido deve retornar 400")
    void loginCnpjInvalido() throws Exception {
        mockMvc.perform(post("/auth/")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(JSON_CNPJ_INVALIDO))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(MSG_ERRO)));
    }

    @Test
    @DisplayName("Deve retornar 400 quando a senha estiver incorreta")
    void loginSenhaIncorreta() throws Exception {
        mockMvc.perform(post("/auth/")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(SENHA_INCORRETA))
                .andDo(print())
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString(MSG_ERRO)));
    }
}
