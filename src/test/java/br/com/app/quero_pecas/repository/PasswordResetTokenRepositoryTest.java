package br.com.app.quero_pecas.repository;


import br.com.app.quero_pecas.entity.PasswordResetToken;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;


@DataJpaTest
@ActiveProfiles("test")
class PasswordResetTokenRepositoryTest {

    @Autowired
    private PasswordResetTokenRepository repository;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private String email = "usuario@email.com";
    private String tokenOriginal = "abc123token";
    private String tokenHash;
    private PasswordResetToken tokenSalvo;

    @BeforeEach
    void setUp() {
        tokenHash = encoder.encode(tokenOriginal);
        LocalDateTime expiraEm = LocalDateTime.now().plusHours(1);
        PasswordResetToken token = new PasswordResetToken(email, tokenHash, expiraEm);
        tokenSalvo = repository.save(token);
    }

    @Test
    void devePersistirEEncontrarTokenPorHash() {
        Optional<PasswordResetToken> found = repository.findByTokenHashAndUtilizadoFalseAndExpiraEmAfter(tokenHash, LocalDateTime.now());
        assertThat(found).isPresent();
        assertThat(found.get().getTokenHash()).isEqualTo(tokenHash);
        assertThat(found.get().isUtilizado()).isFalse();
    }

    @Test
    void deveMarcarTokenComoUtilizado() {
        int updated = repository.markAsUsed(tokenHash);
        assertThat(updated).isEqualTo(1);

        Optional<PasswordResetToken> used = repository.findById(tokenSalvo.getIdPasswordResetToken());
        assertThat(used).isPresent();
        assertThat(used.get().isUtilizado()).isTrue();
    }

    @Test
    void naoDeveEncontrarTokenExpirado() {
        String hashExpirado = encoder.encode("expirado");
        PasswordResetToken expirado = new PasswordResetToken(email, hashExpirado, LocalDateTime.now().minusMinutes(1));
        repository.save(expirado);

        Optional<PasswordResetToken> found = repository.findByTokenHashAndUtilizadoFalseAndExpiraEmAfter(hashExpirado, LocalDateTime.now());
        assertThat(found).isEmpty();
    }
}