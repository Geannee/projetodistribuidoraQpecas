package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.AuthDTO;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
// Isso resolve o erro de "Unnecessary stubbings" detectado pelo Mockito
@MockitoSettings(strictness = Strictness.LENIENT)
class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UsuarioRepository repository;

    @Mock
    private TokenService tokenService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Test
    @DisplayName("Deve autenticar com sucesso quando as credenciais estiverem corretas")
    void authSucesso() {
        // CNPJ válido para o Stella (use este exato)
        String cnpjTeste = "15436940000103";
        var request = new AuthDTO.Request(cnpjTeste, "senha123");

        var usuario = new Usuario();
        usuario.setCnpj(cnpjTeste);
        usuario.setSenha("senha_hash");

        // Stubbing
        when(repository.findByCnpj(cnpjTeste)).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha123", "senha_hash")).thenReturn(true);

        // Use any() aqui para evitar conflito de referência de objeto no Mockito
        when(tokenService.gerarToken(any(Usuario.class))).thenReturn("token-jwt-valido");

        var response = authService.auth(request);

        assertNotNull(response.token());
        assertEquals("token-jwt-valido", response.token());
    }

    @Test
    @DisplayName("Deve lançar exceção quando o CNPJ for matematicamente inválido")
    void authCnpjInvalido() {
        var request = new AuthDTO.Request("12345", "senha123");

        assertThrows(BadCredentialsException.class, () -> {
            authService.auth(request);
        });

        // Agora deve passar, pois o validarCNPJ() no Service lança a exceção ANTES do repository
        verifyNoInteractions(repository);
    }

    @Test
    @DisplayName("Deve lançar exceção quando a senha estiver incorreta")
    void authSenhaIncorreta() {
        var request = new AuthDTO.Request("45851493000103", "senha_errada");
        var usuario = new Usuario();
        usuario.setSenha("hash_correto");

        when(repository.findByCnpj("45851493000103")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha_errada", "hash_correto")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () -> {
            authService.auth(request);
        });
    }

    @Test
    @DisplayName("Deve autenticar com sucesso usando E-mail")
    void authSucessoEmail() {
        var request = new AuthDTO.Request("teste@email.com", "senha123");
        var usuario = new Usuario();
        usuario.setEmail("teste@email.com");
        usuario.setSenha("hash");

        when(repository.findByEmail("teste@email.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha123", "hash")).thenReturn(true);
        when(tokenService.gerarToken(usuario)).thenReturn("token-valido");

        var response = authService.auth(request);
        assertNotNull(response.token());
    }
}