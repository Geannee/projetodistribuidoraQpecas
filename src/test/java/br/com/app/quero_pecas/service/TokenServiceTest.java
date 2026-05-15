package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.entity.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.junit.jupiter.api.Assertions.*;

class TokenServiceTest {

    private static final String SECRET = "meuSegredo";
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        usuario = new Usuario();
        usuario.setIdUsuario(1L);
        usuario.setEmail("teste@email.com");
    }

    @Test
    @DisplayName("Deve aceitar token válido (não expirado)")
    void deveAceitarTokenValido() {
        Clock clock = Clock.systemUTC();
        TokenService tokenService = new TokenService(SECRET, clock);
        String token = tokenService.gerarToken(usuario);

        String subject = tokenService.validarToken(token);
        assertEquals(usuario.getEmail(), subject);
    }

    @Test
    @DisplayName("Deve rejeitar token expirado")
    void deveRejeitarTokenExpirado() {
        Clock clock = Clock.fixed(Instant.parse("2025-01-01T00:00:00Z"), ZoneOffset.UTC);
        TokenService tokenService = new TokenService(SECRET, clock);
        String tokenExpirado = tokenService.gerarTokenExpirado(usuario);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> tokenService.validarToken(tokenExpirado));
        assertEquals("Token expirado", exception.getMessage());
    }

    @Test
    @DisplayName("Deve rejeitar token com assinatura inválida")
    void deveRejeitarTokenInvalido() {
        Clock clock = Clock.fixed(Instant.parse("2025-01-01T00:00:00Z"), ZoneOffset.UTC);
        TokenService tokenService = new TokenService(SECRET, clock);
        String tokenInvalido = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

        RuntimeException exception = assertThrows(RuntimeException.class, () -> tokenService.validarToken(tokenInvalido));
        assertEquals("Token inválido", exception.getMessage());
    }
}