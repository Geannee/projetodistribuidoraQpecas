package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.entity.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    private final Clock clock;

    public TokenService(@Value("${api.security.token.secret}") String secret, Clock clock) {
        this.secret = secret;
        this.clock = clock;
    }

    public String gerarToken(Usuario usuario) {
        Instant expiration = Instant.now(clock).plusSeconds(30 * 60);
        return gerarTokenComExpiracao(usuario, expiration);
    }

    private String gerarTokenComExpiracao(Usuario usuario, Instant expiration) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("quero_pecas_api")
                    .withSubject(usuario.getEmail())
                    .withClaim("id", usuario.getIdUsuario())
                    .withClaim("role", usuario.getTipoUsuario() != null ? usuario.getTipoUsuario().name() : "MECANICO")
                    .withExpiresAt(expiration)
                    .sign(algorithm);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar token", e);
        }
    }

    public String gerarTokenExpirado(Usuario usuario) {
        Instant past = Instant.now(clock).minusSeconds(1);
        return gerarTokenComExpiracao(usuario, past);
    }

    public String validarToken(String token) {
        return validarEObterToken(token).getSubject();
    }

    public DecodedJWT validarEObterToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            var verifier = JWT.require(algorithm)
                    .withIssuer("quero_pecas_api")
                    .build();
            return verifier.verify(token);
        } catch (TokenExpiredException e) {
            throw new RuntimeException("Token expirado", e);
        } catch (Exception e) {
            throw new RuntimeException("Token inválido", e);
        }
    }
}
