package br.com.app.quero_pecas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter @AllArgsConstructor @NoArgsConstructor
public class PasswordResetToken {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPasswordResetToken;

    @Column(nullable = false)
    private String emailOrCnpj;

    @Column(nullable = false)
    private String tokenHash;

    @Column(nullable = false)
    private LocalDateTime criadoEm;

    @Column(nullable = false)
    private LocalDateTime expiraEm;

    @Column(nullable = false)
    private boolean utilizado;

    public PasswordResetToken(String emailOrCnpj, String tokenHash, LocalDateTime expiraEm) {
        this.emailOrCnpj = emailOrCnpj;
        this.tokenHash = tokenHash;
        this.expiraEm = expiraEm;
        this.criadoEm = LocalDateTime.now();
        this.utilizado = false;
    }

}
