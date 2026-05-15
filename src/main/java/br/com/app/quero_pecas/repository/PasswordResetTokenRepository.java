package br.com.app.quero_pecas.repository;

import br.com.app.quero_pecas.entity.PasswordResetToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByTokenHashAndUtilizadoFalseAndExpiraEmAfter(String tokenHash, LocalDateTime now);

    @Modifying
    @Transactional
    @Query("UPDATE PasswordResetToken t SET t.utilizado = true WHERE t.tokenHash = :tokenHash")
    void setTokenUsed(@Param("tokenHash") String tokenHash);

    @Modifying(clearAutomatically = true)
    @Transactional
    @Query("UPDATE PasswordResetToken t SET t.utilizado = true WHERE t.tokenHash = :tokenHash")
    int markAsUsed(@Param("tokenHash") String tokenHash);
}
