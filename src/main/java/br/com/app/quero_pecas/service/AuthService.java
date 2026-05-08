package br.com.app.quero_pecas.service;

import br.com.app.quero_pecas.dto.AuthDTO;
import br.com.app.quero_pecas.entity.Usuario;
import br.com.app.quero_pecas.repository.UsuarioRepository;
import br.com.caelum.stella.validation.CNPJValidator;
import jakarta.validation.Valid;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UsuarioRepository repository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;

    public AuthDTO.Response auth(@Valid AuthDTO.Request data) {
        String login = data.login().trim();

        if (login.contains("@")) {
            validarEmail(login);
        } else {
            validarCNPJ(login);
        }

        Optional<Usuario> usuarioOpt = login.contains("@")
                ? repository.findByEmail(login.toLowerCase())
                : repository.findByCnpj(login.replaceAll("\\D", ""));

        Usuario usuario = usuarioOpt.orElseThrow(() ->
                new BadCredentialsException("Login ou senha inválidos"));

        if (!passwordEncoder.matches(data.senha(), usuario.getSenha())) {
            throw new BadCredentialsException("Login ou senha inválidos");
        }

        String token = tokenService.gerarToken(usuario);

        return new AuthDTO.Response(
                usuario.getIdUsuario(),
                usuario.getCnpj(),
                usuario.getEmail(),
                usuario.getRepresentanteLegal(),
                token
        );
    }

    private void validarEmail(@NonNull String email) {
        if (!email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            throw new BadCredentialsException("Formato de E-mail Invalido");
        }
    }

    private void validarCNPJ(String cnpj) {
        try {
            new CNPJValidator(false).assertValid(cnpj);
        } catch (Exception e) {
            throw new BadCredentialsException("O CNPJ não é válido");
        }
    }
}
